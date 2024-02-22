import { ButtonAsync, FA, wait } from "tonwa-com";
import { WritableAtom, atom, useAtomValue } from "jotai";
import { useSheetHeader } from "./useSheetStore";
import { SheetStore } from "./store";

interface ToolButtonDef {
    name: string;
    caption: string;
    icon?: string;
    className?: string;
}

export class ToolButton implements ToolButtonDef {
    readonly name: string;
    caption: string;
    icon?: string;
    className?: string;
    readonly atomDisabled: WritableAtom<boolean, any, any>;
    readonly atomHidden: WritableAtom<boolean, any, any>;
    act: () => Promise<void>;
    constructor(def: ToolButtonDef, act: () => Promise<void> = undefined, disabled: boolean = true, hidden: boolean = false) {
        const { name, caption, icon, className } = def;
        this.name = name;
        if (caption === undefined) this.caption = caption;
        if (icon === undefined) this.icon = icon;
        if (className === undefined) this.className = this.className;
        this.act = act;
        this.atomDisabled = atom(disabled);
        this.atomHidden = atom(hidden);
    }
}

export const buttonDefs: { [name: string]: ToolButtonDef } = {
    submit: { name: 'submit', caption: '提交', icon: 'send-o' },
    test: { name: 'test', caption: '测试', },
    discard: { name: 'discard', caption: '作废', icon: 'trash-o', },
    exit: { name: 'exit', caption: '退出', icon: 'external-link', },
}

function useToolbar(groups: ToolButton[][]) {
    for (let group of groups) {
        if (!group) continue;
        for (let btn of group) {
            const { name } = btn;
            let bt = buttonDefs[name];
            if (bt === undefined) continue;
            const { caption, icon, className } = btn;
            if (caption === undefined) btn.caption = bt.caption;
            if (icon === undefined) btn.icon = bt.icon;
            if (className === undefined) btn.className = bt.className;
        }
    }
}

function ViewButton({ toolButton, cnBtn, cnGap }: { toolButton: ToolButton; cnBtn: string; cnGap: string; }) {
    if (toolButton === undefined) return null;
    const { caption, icon, className, atomHidden, atomDisabled, act } = toolButton;
    const hidden = useAtomValue(atomHidden);
    const disabled = useAtomValue(atomDisabled);
    if (hidden === true) return null;
    let vIcon: any;
    if (icon !== undefined) {
        vIcon = <FA name={icon} className="me-2" />;
    }
    return <ButtonAsync
        className={(className ?? ('btn btn-sm ' + cnBtn)) + cnGap}
        disabled={disabled} onClick={act}>
        {vIcon}{caption}
    </ButtonAsync>;
}

function Toolbar({ groups }: { groups: ToolButton[][] }) {
    useToolbar(groups);
    function Group({ group, cnGap, cnBtn }: { group: ToolButton[]; cnGap: string; cnBtn: string; }) {
        return <div className="me-2">
            {
                group.map((v, index) =>
                    <ViewButton key={v.name} toolButton={v} cnBtn={cnBtn} cnGap={cnGap} />
                )
            }
        </div>;
    }
    let vGroups: any[] = [];
    let len = groups.length;
    let cnGap = ' me-1 ';
    let cnBtn = ' btn-primary ';
    let i = 0;
    for (; i < len; i++) {
        let g = groups[i];
        if (g === null) {
            vGroups.push(<div key={i} className="flex-fill" />);
            i++
            break;
        }
        else {
            vGroups.push(<Group key={i} group={g} cnGap={cnGap} cnBtn={cnBtn} />);
        }
    }
    cnGap = ' ms-1 ';
    cnBtn = ' btn-outline-primary ';
    for (; i < len; i++) {
        vGroups.push(<Group key={i} group={groups[i]} cnGap={cnGap} cnBtn={cnBtn} />);
    }
    return <div className={'d-flex py-1 px-2 bg-white '}>
        {vGroups}
    </div>;
}

export function HeaderSheet({ store, toolGroups }: { store: SheetStore; toolGroups: ToolButton[][] }) {
    const { header, back } = useSheetHeader(store);
    return <div className="border-bottom border-primary">
        <div className={' text-center py-2 border-2 border-bottom border-primary-subtle bg-primary-subtle '}>
            <FA name={back} className="me-3 text-info" />
            <span className="text-primary fw-bold">{header}</span>
        </div>
        <Toolbar groups={toolGroups} />
    </div>;
}
