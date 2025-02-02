import { useUqApp } from "app/UqApp";
import { IDView } from "tonwa-app";
import { ViewBudEmpty } from "../Common";
import { ViewAtom } from "./ViewAtom";

export function ViewAtomId({ id }: { id: number; }) {
    const { uq } = useUqApp();
    if (id === undefined) return <ViewBudEmpty />;
    return <IDView uq={uq} id={id} Template={ViewAtom} />;
}
