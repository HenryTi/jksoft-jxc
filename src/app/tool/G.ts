import { Atom } from "uqs/UqDefault";
import { EntityAtom } from "app/Biz";

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
