import { useUqApp } from "app/UqApp";
import { EnumAtom } from "uqs/UqDefault";

export function CaptionAtom({ atom }: { atom: EnumAtom; }) {
    const { biz } = useUqApp();
    return <>
        {biz.entities[atom].caption}
    </>;
}