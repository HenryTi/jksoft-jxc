import { BizBud, EntitySpec } from "app/Biz";
import { useGetSpec } from "../Uq";
import { useUqApp } from "app/UqApp";

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

export function ViewSpecProps({ phrase, props: propValues, className }: { phrase: number; props: (string | number)[]; className?: string; }) {
    const { biz } = useUqApp();
    let entity = biz.entityIds[phrase] as EntitySpec;
    let { keys, props } = entity;
    let keysLen = keys.length;
    let len = propValues.length;
    let ret: any[] = [];
    for (let i = 0; i < len; i++) {
        if (i < keysLen) {
            ret.push(buildProp(keys[i], propValues[i]));
        }
        else {
            ret.push(buildProp(props[i - keysLen], propValues[i]));
        }
    }

    function buildProp(bud: BizBud, value: string | number) {
        return <span key={bud.id} className="d-inline-block me-3">
            <span className="small text-secondary w-min-3c me-1">{bud.caption}:</span>
            {value}
        </span>;
    }

    return <div className={className}>{ret}</div>;
}