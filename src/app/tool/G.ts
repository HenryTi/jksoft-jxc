import { Atom } from "uqs/UqDefault";
import { EntityAtom, EntitySheet } from "app/Biz";

export interface PropsAtomSelect {
    atomName: string;
    buds?: string[];
    loadOnOpen?: boolean;
    caption?: string;
    placeholder?: string;
}

export interface GAtom {
    name: string;
    caption?: string;
    entity?: EntityAtom;
    pageNew: JSX.Element;
    pageEdit: JSX.Element;
    pageList: JSX.Element;
    pageView: JSX.Element;
    ViewItem: ({ value }: { value: Atom; }) => JSX.Element;
}
