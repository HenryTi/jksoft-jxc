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

    readonly Render = (): JSX.Element => {
        const { atomHidden, atomDisabled, onAct } = this;
        const hidden = useAtomValue(atomHidden);
        const disabled = useAtomValue(atomDisabled);
        if (hidden === true) return null;
        return this.render(disabled);
    }

    protected abstract render(disabled: boolean): JSX.Element;
}

class ToolButton extends ToolItem {
    protected render(disabled: boolean): JSX.Element {
        const { caption, icon, className } = this.def;
        let vIcon: any;
        if (icon !== undefined) {
            vIcon = <FA name={icon} className="me-2" />;
        }
        return <ButtonAsync
            className={(className ?? btn + ' btn-outline-primary') + ' me-3'}
            disabled={disabled} onClick={this.onAct as any}>
            {vIcon}{caption}
        </ButtonAsync>;
    }
}

class ToolIcon extends ToolItem {
    protected render(disabled: boolean): JSX.Element {
        const { caption, icon, className } = this.def;
        let vIcon = <FA name={icon ?? 'question'} fixWidth={true} />;
        return <div className={className + ' me-3 cursor-pointer '} title={caption}
            onClick={this.onAct as any}>
            {vIcon}
        </div>;
    }
}

type ButtonDef = (onAct: OnAct, disabled?: boolean, hidden?: boolean) => ToolItem;

function buttonDef(def: Def) {
    return function (onAct: OnAct, disabled?: boolean, hidden?: boolean): ToolItem {
        return new ToolButton(def, onAct, disabled, hidden);
    }
}
function iconDef(def: Def) {
    return function (onAct: OnAct, disabled?: boolean, hidden?: boolean): ToolItem {
        return new ToolIcon(def, onAct, disabled, hidden);
    }
}
const btn = ' btn ';
const btnSm = ' btn btn-sm ';
export const buttonDefs: { [name: string]: ButtonDef } = {
    submit: buttonDef({ caption: '提交', /*icon: 'send-o', */className: btn + ' btn-success' }),
    batchSelect: buttonDef({ caption: '批选', /*icon: 'print', */className: btn + ' btn-primary' }),
    print: buttonDef({ caption: '打印', /*icon: 'print'*/ }),
    addDetail: buttonDef({ caption: '明细', icon: 'plus', className: btn + ' btn-primary' }),
    test: buttonDef({ caption: '测试', icon: undefined }),
    discard: buttonDef({ caption: '作废', /*icon: 'trash-o'*/ }),
    exit: iconDef({ caption: '退出', icon: 'times', className: ' px-2 ' }),
}

function Group({ group }: { group: ToolItem[]; }) {
    if (group === undefined) return null;
    return <>{group.map((v, index) => <v.Render key={index} />)}</>;
}

function Toolbar({ groups }: { groups: ToolItem[][] }) {
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

export function headerSheet({ store, toolGroups, headerGroup }: { store: SheetStore; toolGroups: ToolItem[][]; headerGroup?: ToolItem[]; }) {
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
