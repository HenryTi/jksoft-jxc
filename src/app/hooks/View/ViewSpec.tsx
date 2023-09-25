import { BizBud } from "app/Biz";
import { useGetSpec } from "../Uq";

export function ViewSpec({ id }: { id: number; }) {
    const { atom: { value: atomValue }, specs } = useGetSpec(id);
    function ViewAtom() {
        if (atomValue === undefined) return null;
        const { no, ex } = atomValue;
        return <div>
            <div className="small text-secondary">{no}</div>
            <div><b>{ex}</b></div>
        </div>;
    }
    function ViewSpecs() {
        if (specs.length === 0) return null;
        return <>
            {specs.map(v => {
                const { id, keys, props, entity } = v;
                let bands: any[] = [];
                let keyId = 1;
                function buildBands(buds: BizBud[], values: (string | number)[]) {
                    let len = buds.length;
                    for (let i = 0; i < len; i++) {
                        let bud = buds[i];
                        let band = <div key={keyId++}>
                            <span className="d-inline-block me-3 small text-secondary w-min-3c">{bud.caption}</span> {values[i]}
                        </div>;
                        bands.push(band);
                    }
                }
                buildBands(entity.keys, keys);
                buildBands(entity.props, props);
                return <div key={id}>
                    {bands}
                </div>
            })}
        </>;
    }
    return <div>
        <ViewAtom />
        <ViewSpecs />
    </div>
}
