import { JSX } from "react";
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
    abstract Render(): JSX.Element;
}

function ViewToolButton({ toolButton }: { toolButton: ToolButton; }) {
    const { atomHidden, atomDisabled, def, onAct } = toolButton;
    const hidden = useAtomValue(atomHidden);
    const disabled = useAtomValue(atomDisabled);
    if (hidden === true) return null;
    const { caption, icon, className } = def;
    let vIcon: any;
    if (icon !== undefined) {
        vIcon = <FA name={icon} className="me-2" />;
    }
    return <ButtonAsync
        className={(className ?? 'btn btn-outline-primary')}
        disabled={disabled} onClick={onAct as any}>
        {vIcon}{caption}
    </ButtonAsync>;
}
export class ToolButton extends ToolItem {
    readonly def: ToolItemDef;
    readonly onAct: OnAct;
    readonly atomDisabled: WritableAtom<any, any, any>;
    readonly atomHidden: WritableAtom<any, any, any>;
    constructor(def: ToolItemDef, onAct: OnAct, disabled?: boolean, hidden?: boolean) {
        super();
        this.def = def;
        this.onAct = onAct;
        this.atomDisabled = this.atomBoolean(disabled);
        this.atomHidden = this.atomBoolean(hidden) as any;
    }

    private atomBoolean(v: boolean) {
        switch (typeof (v)) {
            default:
            case 'boolean': return atom(v);
            case 'undefined': return atom(false);
        }
    }

    Render(): JSX.Element {
        return <ViewToolButton toolButton={this} />;
    }
}

export class ToolIcon extends ToolItem {
    protected readonly def: ToolItemDef;
    protected readonly onAct: OnAct;
    constructor(def: ToolItemDef, onAct: OnAct) {
        super();
        this.def = def;
        this.onAct = onAct;
    }

    Render(): JSX.Element {
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
    return function (onAct: ItemOnAct, disabled?: boolean, hidden?: boolean): ToolItem {
        return new ToolButton(def, onAct, disabled, hidden);
    }
}
export function toolIconDef(def: ToolItemDef) {
    return function (onAct: ItemOnAct): ToolIcon {
        return new ToolIcon(def, onAct);
    }
}

export function ToolGroup({ group }: { group: ToolItem[] | JSX.Element; }) {
    if (group === undefined) return null;
    if (Array.isArray(group) === false) return group;
    let first = true;
    return <>{group.map((v, index) => {
        if (!v) return null;
        if (first === true) {
            first = false;
            return <React.Fragment key={index}>{v.Render()}</React.Fragment>;
        }
        return <React.Fragment key={index}>
            <span className="d-inline-block me-3" />
            {v.Render()}
        </React.Fragment>;
    })}</>;
}

export function Toolbar({ groups }: { groups: (ToolItem[] | JSX.Element)[] }) {
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
        else if (Array.isArray(g) === false) {
            vGroups.push(<React.Fragment key={i}>{g}</React.Fragment>);
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
