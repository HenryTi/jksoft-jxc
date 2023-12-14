import { Atom } from "uqs/UqDefault";

export function ViewAtom({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <div title={'编号: ' + no}>
        {ex}
    </div>;
}
