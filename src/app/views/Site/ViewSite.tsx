import { Atom } from "uqs/UqDefault";

export function ViewSite({ value }: { value: Atom }) {
    let { no, ex } = value;
    return <>{ex ?? '(无名机构)'} &nbsp; <small className="text-light">{no}</small></>;
}
