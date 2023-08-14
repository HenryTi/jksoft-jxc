import { Atom } from "uqs/UqDefault";

export function ViewAtom({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <div>
        <div><b>{ex}</b></div>
        <div className='small text-muted'>{no}</div>
    </div>;
}
