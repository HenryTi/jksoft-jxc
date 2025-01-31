import { AtomData } from "tonwa";

export function ViewAtom({ value }: { value: AtomData; }) {
    let { no, ex } = value;
    return <div title={ex + ' ' + no}>
        {ex}
    </div>;
}
