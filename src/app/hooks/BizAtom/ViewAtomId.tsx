import { useUqApp } from "app/UqApp";
import { ViewAtom } from "./ViewAtom";
import { IDView } from "tonwa-app";

export function ViewAtomId({ id }: { id: number; }) {
    const { uq } = useUqApp();
    if (id === undefined) return <>/</>;
    return <IDView uq={uq} id={id} Template={ViewAtom} />;
}
