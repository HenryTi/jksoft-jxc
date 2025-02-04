import React, { JSX } from "react";
import { BizBud, EntityID, EntityFork } from "../../Biz";
// import { useGetSpec } from "../Uq";
import { useUqApp } from "app/UqApp";
import { ViewBudUIType } from "../Bud";
import { LabelBox } from "../../View";

export function ViewForkBase({ id, ViewAtom, uiType, noLabel, bold }: {
    id: number;
    ViewAtom: (props: { no: string; ex: string; entity?: EntityID; bold: boolean; noLabel: boolean; }) => JSX.Element;
    uiType?: ViewBudUIType;
    noLabel?: boolean;
    bold?: boolean;
}) {
    // const { atom, specs } = useGetSpec(id);
    // if (atom === undefined) return null;
    return <span>FORK:{id}</span>;
    let atom: any, specs: any;
    const { value: atomValue, entity } = atom;
    let viewAtom: any;
    if (atomValue !== undefined) {
        if (ViewAtom !== undefined) {
            const { no, ex } = atomValue;
            viewAtom = <ViewAtom no={no} ex={ex} entity={entity} bold={bold} noLabel={noLabel} />;
        }
    }
    function ViewForks() {
        if (specs.length === 0) return null;
        return <>
            {specs.map((v: any) => {
                const { id, keys, props, entity } = v;
                let bands: any[] = [];
                function buildBands(buds: BizBud[], values: (string | number)[]) {
                    let { length: len } = buds;
                    for (let i = 0; i < len; i++) {
                        let bud = buds[i];
                        let { id, caption } = bud
                        let content: any = bud.getUIValue(values[i]);
                        let band: any;
                        band = <LabelBox key={id} label={caption}>
                            {content}
                        </LabelBox>;
                        bands.push(band);
                    }
                }
                buildBands(entity.keys, keys);
                buildBands(entity.buds, props);
                if (uiType === ViewBudUIType.inDiv) {
                    return <React.Fragment key={id}>
                        {bands}
                    </React.Fragment>;
                }
                return <React.Fragment key={id}>
                    {bands}
                </React.Fragment >
            })}
        </>;
    }
    let content = <>
        {viewAtom}
        <ViewForks />
    </>;
    if (uiType === ViewBudUIType.inDiv) {
        return content;
    }
    return content;
}

function ViewAtom({ no, ex, entity, bold, noLabel }: { no: string; ex: string; entity?: EntityID; bold: boolean; noLabel: boolean; }) {
    let title = '编号: ' + no;
    let vContent = <>{bold === true ? <b>{ex}</b> : ex}<span className="mx-3">{no}</span></>
    if (noLabel === true) {
        return <span title={title}>{vContent}</span>;
    }
    let label: any;
    if (entity !== undefined) {
        const { caption } = entity;
        label = caption;
    }
    return <LabelBox label={label} title={'编号: ' + no} className="mb-1">
        {vContent}
    </LabelBox>;
}

export function ViewFork({ id, uiType, noLabel, bold }: { id: number; uiType?: ViewBudUIType; noLabel?: boolean; bold?: boolean; }) {
    return <ViewForkBase id={id} ViewAtom={ViewAtom} uiType={uiType} noLabel={noLabel} bold={bold} />
}

export function ViewBudFork({ id, bud, noLabel }: { id: number; bud: BizBud; noLabel?: boolean; }) {
    function ViewAtom({ no, ex, entity }: { no: string; ex: string; entity?: EntityID; }) {
        let title = `${ex} ${no}`;
        if (noLabel === true) {
            return <span title={title}>{ex}</span>;
        }
        // let label: any;
        // if (entity !== undefined) {
        //    const { caption } = bud;
        //    label = caption; // <small className="text-secondary me-2">{caption ?? name}</small>;
        //}
        return <>{ex}</>;
        /*
         <LabelBox title={title} label={label}>
            {ex}
        </LabelBox>;
        */
    }
    return <ViewForkBase id={id} ViewAtom={ViewAtom} uiType={ViewBudUIType.inDiv} noLabel={noLabel} />
}

export function ViewForkNoAtom({ id, uiType, noLabel }: { id: number; uiType?: ViewBudUIType; noLabel?: boolean; }) {
    return <ViewForkBase id={id} ViewAtom={undefined} uiType={uiType} noLabel={noLabel} />
}

export function ViewForkBaseOnly({ id, noVisible, bold }: { id: number; noVisible?: boolean; bold?: boolean }) {
    // const { atom, } = useGetSpec(id);
    const atom: any = undefined;
    if (atom === undefined) return null;
    const { value } = atom;
    if (value === undefined) return null;
    if (ViewAtom !== undefined) {
        const { no, ex } = value;
        return <ViewAtom no={no} ex={ex} bold={bold} noLabel={!noVisible} />;
    }
}

export function ViewForkR({ id }: { id: number; }) {
    function ViewAtom({ no, ex }: { no: string; ex: string; }) {
        return <div title={ex + ' ' + no}>
            {ex}
        </div>;
    }
    return <ViewForkBase id={id} ViewAtom={ViewAtom} />
}

interface VPProps {
    phrase: number;
    props: (string | number)[];
}

interface VPPropsMore extends VPProps {
    className: string;
    buildProp: (bud: BizBud, value: string | number) => JSX.Element;
}

function ViewForkProps({ phrase, props: propValues, className, buildProp }: VPPropsMore) {
    const { biz } = useUqApp();
    let entity = biz.entityFromId<EntityFork>(phrase);
    let { keys, buds: props } = entity;
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

export function ViewForkPropsH({ phrase, props: propValues }: VPProps) {
    function buildProp(bud: BizBud, value: string | number) {
        const { caption, id } = bud;
        return <div key={id} className="w-min-6c me-2">
            <div className="small text-secondary w-min-3c me-1">{caption}:</div>
            <div>{bud.getUIValue(value)}</div>
        </div>;
    }
    return <ViewForkProps phrase={phrase} props={propValues} className="d-flex" buildProp={buildProp} />;
}

export function ViewForkPropsV({ phrase, props: propValues }: VPProps) {
    function buildProp(bud: BizBud, value: string | number) {
        const { caption, id } = bud;
        return <span key={id} className="d-inline-block me-3">
            <span className="small text-secondary w-min-3c me-1">{caption}:</span>
            {bud.getUIValue(value)}
        </span>;
    }
    return <ViewForkProps phrase={phrase} props={propValues} className="d-block" buildProp={buildProp} />;
}
