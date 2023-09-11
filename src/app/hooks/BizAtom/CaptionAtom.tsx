import { useUqApp } from "app/UqApp";
import { EnumAtom } from "uqs/UqDefault";

export function CaptionAtom({ atom }: { atom: EnumAtom; }) {
    const { biz } = useUqApp();
    const entity = biz.entities[atom];
    return <>
        {entity ? entity.caption : atom}
    </>;
}