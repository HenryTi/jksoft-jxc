import { Atom } from "uqs/UqDefault";

export function ViewSite({ value }: { value: Atom }) {
    let { no, ex } = value;
    return <><b>{ex ?? '(无名机构)'}</b> &nbsp; <small className="text-secondary">{no}</small></>;
}