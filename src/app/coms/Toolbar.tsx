import { ButtonAsync, FA } from "tonwa-com";
import { WritableAtom, atom, useAtomValue } from "jotai";
import React from "react";

export interface ToolItemDef {
    caption: string;
    icon?: string;
    className?: string;
}

type OnAct = () => void | Promise<void>;

export abstract class ToolItem {
    abstract get Render(): () => JSX.Element;
}

export abstract class ToolActItem extends ToolItem {
    protected readonly def: ToolItemDef;
    protected readonly onAct: OnAct;
    readonly atomDisabled: WritableAtom<boolean, any, any>;
    readonly atomHidden: WritableAtom<boolean, any, any>;
    constructor(def: ToolItemDef, onAct: OnAct, disabled?: boolean, hidden?: boolean) {
        super();
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

export class ToolButton extends ToolActItem {
    protected render(disabled: boolean): JSX.Element {
        const { caption, icon, className } = this.def;
        let vIcon: any;
        if (icon !== undefined) {
            vIcon = <FA name={icon} className="me-2" />;
        }
        return <ButtonAsync
            className={(className ?? 'btn btn-outline-primary')}
            disabled={disabled} onClick={this.onAct as any}>
            {vIcon}{caption}
        </ButtonAsync>;
    }
}

export class ToolIcon extends ToolActItem {
    protected render(disabled: boolean): JSX.Element {
        const { caption, icon, className } = this.def;
        let vIcon = <FA name={icon ?? 'question'} fixWidth={true} />;
        return <div className={className + ' cursor-pointer '} title={caption}
            onClick={this.onAct as any}>
            {vIcon}
        </div>;
    }
}

export class ToolElement extends ToolItem {
    private readonly element: JSX.Element;
    constructor(element: JSX.Element) {
        super();
        this.element = element;
    }
    readonly Render = (): JSX.Element => {
        return this.element;
    }
}

export type ItemOnAct = () => void | Promise<void>;

export type ItemDef<T extends ToolItem> = (onAct: ItemOnAct, disabled?: boolean, hidden?: boolean) => T;

export function toolButtonDef(def: ToolItemDef) {
    return function (onAct: ItemOnAct, disabled?: boolean, hidden?: boolean): ToolButton {
        return new ToolButton(def, onAct, disabled, hidden);
    }
}
export function toolIconDef(def: ToolItemDef) {
    return function (onAct: ItemOnAct, disabled?: boolean, hidden?: boolean): ToolIcon {
        return new ToolIcon(def, onAct, disabled, hidden);
    }
}

export function ToolGroup({ group }: { group: ToolItem[]; }) {
    if (group === undefined) return null;
    return <>{group.map((v, index) => {
        if (index === 0) return <v.Render key={index} />;
        return <React.Fragment key={index}><span className="d-inline-block me-3" /><v.Render /></React.Fragment>;
    })}</>;
}

export function Toolbar({ groups }: { groups: ToolItem[][] }) {
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
                <ToolGroup group={g} />
            </div>);
        }
    }
    for (; i < len; i++) {
        vGroups.push(<div className="ms-2" key={i}>
            <ToolGroup group={groups[i]} />
        </div>);
    }
    return <div className={'d-flex py-3 px-3 bg-white border-bottom border-primary border-2'}>
        {vGroups}
    </div>;
}
