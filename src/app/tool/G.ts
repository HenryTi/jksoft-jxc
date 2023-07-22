import { Atom, EnumAtom, EnumSheet, EnumSubject } from "uqs/UqDefault";
import { Spec } from "./Model";
import { EntityAtom } from "app/Biz";
import { EntitySpec } from "app/Biz/EntityAtom";

export interface PropsAtomSelect {
    atomName: string;
    assigns?: string[];
    loadOnOpen?: boolean;
    caption?: string;
    placeholder?: string;
}

export interface GAtom {
    name: EnumAtom;
    caption?: string;
    entity?: EntityAtom;
    pageNew: JSX.Element;
    pageEdit: JSX.Element;
    pageList: JSX.Element;
    pageView: JSX.Element;
    ViewItem: ({ value }: { value: Atom; }) => JSX.Element;
}

export interface GSpec<T extends Spec = any> {
    name: string;
    caption?: string;
    entity?: EntitySpec;
    Edit: ({ className, spec, submitCaption, submitClassName, onSubmit }: PropsSpecEdit<T>) => JSX.Element;
    View: (props: { className?: string; value: T; }) => JSX.Element;
}

export interface GSheet {
    sheet: EnumSheet;
    caption?: string;
    pageEdit: JSX.Element,
}

export interface PropsSpecEdit<T extends Spec> {
    className?: string;
    spec: T;
    submitCaption?: string;
    submitClassName?: string;
    onSubmit?: (spec: T) => Promise<void>;
}

export interface GSubject {
    name: EnumSubject;
    caption?: string;
    Report: JSX.Element;
    History: JSX.Element;
}
