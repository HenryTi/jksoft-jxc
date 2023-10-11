import { BizBud, EntitySpec } from "app/Biz";
import { useGetSpec } from "../Uq";
import { useUqApp } from "app/UqApp";

export function ViewSpecBase({ id, ViewAtom }: { id: number; ViewAtom: (props: { no: string; ex: string; }) => JSX.Element; }) {
    const { atom: { value: atomValue }, specs } = useGetSpec(id);
    let viewAtom: any;
    if (atomValue !== undefined) {
        const { no, ex } = atomValue;
        viewAtom = <ViewAtom no={no} ex={ex} />;
    }
    function ViewSpecs() {
        if (specs.length === 0) return null;
        return <>
            {specs.map(v => {
                const { id, keys, props, entity } = v;
                let bands: any[] = [];
                function buildBands(buds: BizBud[], values: (string | number)[]) {
                    let { length: len } = buds;
                    for (let i = 0; i < len; i++) {
                        let { id, caption, name, budDataType } = buds[i];
                        let band = <div key={id}>
                            <span className="d-inline-block me-2 small text-secondary w-min-4c">
                                {caption ?? name}
                            </span>
                            {budDataType.valueToContent(values[i])}
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
        {viewAtom}
        <ViewSpecs />
    </div>
}

export function ViewSpec({ id }: { id: number; }) {
    function ViewAtom({ no, ex }: { no: string; ex: string; }) {
        return <div>
            <div className="small text-secondary">{no}</div>
            <div><b>{ex}</b></div>
        </div>;
    }
    return <ViewSpecBase id={id} ViewAtom={ViewAtom} />
}

export function ViewSpecR({ id }: { id: number; }) {
    function ViewAtom({ no, ex }: { no: string; ex: string; }) {
        return <div>
            <div><b>{ex}</b></div>
            <div className="small text-secondary">{no}</div>
        </div>;
    }
    return <ViewSpecBase id={id} ViewAtom={ViewAtom} />
}

interface VPProps {
    phrase: number;
    props: (string | number)[];
}

interface VPPropsMore extends VPProps {
    className: string;
    buildProp: (bud: BizBud, value: string | number) => JSX.Element;
}

function ViewSpecProps({ phrase, props: propValues, className, buildProp }: VPPropsMore) {
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

    return <div className={className}>{ret}</div>;
}

export function ViewSpecPropsH({ phrase, props: propValues }: VPProps) {
    function buildProp(bud: BizBud, value: string | number) {
        const { caption, name, id } = bud;
        return <div key={id} className="w-min-6c me-2">
            <div className="small text-secondary w-min-3c me-1">{caption ?? name}:</div>
            <div>{bud.budDataType.valueToContent(value)}</div>
        </div>;
    }
    return <ViewSpecProps phrase={phrase} props={propValues} className="d-flex" buildProp={buildProp} />;
}

export function ViewSpecPropsV({ phrase, props: propValues }: VPProps) {
    function buildProp(bud: BizBud, value: string | number) {
        const { caption, name, id } = bud;
        return <span key={id} className="d-inline-block me-3">
            <span className="small text-secondary w-min-3c me-1">{caption ?? name}:</span>
            {bud.budDataType.valueToContent(value)}
        </span>;
    }
    return <ViewSpecProps phrase={phrase} props={propValues} className="d-block" buildProp={buildProp} />;
}