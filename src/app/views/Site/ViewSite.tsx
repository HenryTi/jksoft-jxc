import { Atom } from "uqs/UqDefault";

export function ViewSite({ value }: { value: Atom }) {
    let { no, ex } = value;
    return <>{ex ?? '默认机构'} &nbsp; {no}</>;
}