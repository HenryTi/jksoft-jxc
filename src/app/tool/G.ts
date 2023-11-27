import { Atom } from "uqs/UqDefault";
import { EntityAtom, EntitySheet } from "app/Biz";

export interface PropsAtomSelect {
    atom: EntityAtom;
    buds?: number[];
    loadOnOpen?: boolean;
    caption?: string;
    placeholder?: string;
    onSelected?: (atomId: number) => Promise<void>;
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
