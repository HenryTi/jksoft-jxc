import { useGetSpec } from "../Uq";

export function ViewSpec({ id }: { id: number; }) {
    const { atom: { value: atomValue }, specs } = useGetSpec(id);
    function ViewAtom() {
        return <div>ATOM: {JSON.stringify(atomValue)}</div>;
    }
    function ViewSpecs() {
        if (specs.length === 0) return null;
        return <><div>Spec</div>
            {specs.map((v, index) => {
                const { id, keys, props } = v;
                return <div key={index}>
                    id: {id} keys: {keys.join(',')} props: {props.join(',')}
                </div>
            })}
        </>;
    }
    return <div>
        <ViewAtom />
        <ViewSpecs />
    </div>
}
