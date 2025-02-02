import { AtomData } from "../../Store";

export function ViewAtom({ value }: { value: AtomData; }) {
    let { no, ex } = value;
    return <div>
        {ex}
        <span className='ms-3 small text-secondary'>{no}</span>
    </div>;
}
