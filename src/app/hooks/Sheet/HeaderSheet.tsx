import { ButtonAsync, FA, wait } from "tonwa-com";
import { WritableAtom, atom, useAtomValue } from "jotai";
import { useSheetHeader } from "./useSheetStore";
import { SheetStore } from "./store";

interface Def {
    caption: string;
    icon?: string;
    className?: string;
}

type OnAct = () => void | Promise<void>;

export abstract class ToolItem/* implements ToolButtonDef*/ {
    protected readonly def: Def;
    protected readonly onAct: OnAct;
    readonly atomDisabled: WritableAtom<boolean, any, any>;
    readonly atomHidden: WritableAtom<boolean, any, any>;
    constructor(def: Def, onAct: OnAct, disabled?: boolean, hidden?: boolean) {
        this.def = def;
        this.onAct = onAct;
        this.atomDisabled = atom(disabled ?? false);
        this.atomHidden = atom(hidden ?? false);
    }

    abstract get Render(): () => JSX.Element;
}

class ToolButton extends ToolItem {
    readonly Render = (): JSX.Element => {
        const { caption, icon, className } = this.def;
        const { atomHidden, atomDisabled, onAct } = this;
        const hidden = useAtomValue(atomHidden);
        const disabled = useAtomValue(atomDisabled);
        if (hidden === true) return null;
        let vIcon: any;
        if (icon !== undefined) {
            vIcon = <FA name={icon} className="me-2" />;
        }
        return <ButtonAsync
            className={(className ?? btn + ' btn-outline-primary') + ' me-3'}
            disabled={disabled} onClick={onAct as any}>
            {vIcon}{caption}
        </ButtonAsync>;
    }
}

type ButtonDef = (onAct: OnAct, disabled?: boolean, hidden?: boolean) => ToolItem;

function buildDef(def: Def) {
    return function (onAct: OnAct, disabled?: boolean, hidden?: boolean): ToolItem {
        return new ToolButton(def, onAct, disabled, hidden);
    }
}
const btn = ' btn ';
const btnSm = ' btn btn-sm ';
export const buttonDefs: { [name: string]: ButtonDef } = {
    submit: buildDef({ caption: '提交', icon: 'send-o', className: btn + ' btn-success' }),
    batchSelect: buildDef({ caption: '批选待处理', icon: 'print', className: btn + ' btn-primary' }),
    print: buildDef({ caption: '打印', icon: 'print' }),
    addDetail: buildDef({ caption: '新增明细', icon: 'list-ul', className: btn + ' btn-primary' }),
    test: buildDef({ caption: '测试', icon: undefined }),
    discard: buildDef({ caption: '作废', icon: 'trash-o' }),
    exit: buildDef({ caption: '退出', icon: 'external-link', className: btnSm + ' btn-outline-light' }),
}

function Group({ group }: { group: ToolItem[]; }) {
    if (group === undefined) return null;
    return <>{group.map((v, index) => <v.Render key={index} />)}</>;
}

function Toolbar({ groups }: { groups: ToolButton[][] }) {
    let vGroups: any[] = [];
    let len = groups.length;
    let i = 0;
    for (; i < len; i++) {
        let g = groups[i];
        if (g === null) {
            vGroups.push(<div key={i} className="flex-fill" />);
            i++
            break;
        }
        else {
            vGroups.push(<div key={i} className="me-2">
                <Group group={g} />
            </div>);
        }
    }
    for (; i < len; i++) {
        vGroups.push(<div className="ms-2" key={i}>
            <Group group={groups[i]} />
        </div>);
    }
    return <div className={'d-flex py-3 ps-3 bg-white border-bottom border-primary border-2'}>
        {vGroups}
    </div>;
}

export function headerSheet({ store, toolGroups, headerGroup }: { store: SheetStore; toolGroups: ToolButton[][]; headerGroup?: ToolButton[]; }) {
    const { header: headerContent, back } = useSheetHeader(store);
    return {
        header: <div className="py-2 px-3">
            <FA name={back} className="me-3" />
            <span className="">{headerContent}</span>
        </div>,
        right: <div className="">
            <Group group={headerGroup} />
        </div>,
        top: <Toolbar groups={toolGroups} />,
    }
}
