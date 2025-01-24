import { EntityAtom } from "app/Biz";
import { AtomData } from "./Store";

export interface GAtom {
    name: string;
    caption?: string;
    entity?: EntityAtom;
    pageNew: JSX.Element;
    pageEdit: JSX.Element;
    pageList: JSX.Element;
    pageView: JSX.Element;
    ViewItem: ({ value }: { value: AtomData; }) => JSX.Element;
}
