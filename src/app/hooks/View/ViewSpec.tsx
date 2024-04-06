import { BizBud, EntityAtomID, EntitySpec } from "app/Biz";
import { useGetSpec } from "../Uq";
import { useUqApp } from "app/UqApp";
import { ViewBudUIType } from "..";
import React from "react";
import { LabelBox } from "../tool";

export function ViewSpecBase({ id, ViewAtom, uiType, noLabel, bold }: {
    id: number;
    ViewAtom: (props: { no: string; ex: string; entity?: EntityAtomID; bold: boolean; noLabel: boolean; }) => JSX.Element;
    uiType?: ViewBudUIType;
    noLabel?: boolean;
    bold?: boolean;
}) {
    const { atom, specs } = useGetSpec(id);
    if (atom === undefined) return null;
    const { value: atomValue, entity } = atom;
    let viewAtom: any;
    if (atomValue !== undefined) {
        if (ViewAtom !== undefined) {
            const { no, ex } = atomValue;
            viewAtom = <ViewAtom no={no} ex={ex} entity={entity} bold={bold} noLabel={noLabel} />;
        }
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
                        let content: any = budDataType.valueToContent(values[i]);
                        let band: any;
                        //if (noLabel !== true) {
                        band = <LabelBox key={id} label={caption ?? name} /*colon={true}*/>
                            {content}
                        </LabelBox>;
                        //}
                        //else {
                        //    band = <>{content}</>;
                        //}
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
        <ViewSpecs />
    </>;
    if (uiType === ViewBudUIType.inDiv) {
        return content;
    }
    return content;
}

function ViewAtom({ no, ex, entity, bold, noLabel }: { no: string; ex: string; entity?: EntityAtomID; bold: boolean; noLabel: boolean; }) {
    let title = '编号: ' + no;
    let vContent = <>{bold === true ? <b>{ex}</b> : ex}<small className="ms-3">{no}</small></>
    if (noLabel === true) {
        return <span title={title}>{vContent}</span>;
    }
    let label: any;
    if (entity !== undefined) {
        const { caption, name } = entity;
        label = caption ?? name;
    }
    return <LabelBox label={label} title={'编号: ' + no} /*colon={true}*/>
        {vContent}
    </LabelBox>;
}

export function ViewSpec({ id, uiType, noLabel, bold }: { id: number; uiType?: ViewBudUIType; noLabel?: boolean; bold?: boolean; }) {
    return <ViewSpecBase id={id} ViewAtom={ViewAtom} uiType={uiType} noLabel={noLabel} bold={bold} />
}

export function ViewBudSpec({ id, bud, noLabel }: { id: number; bud: BizBud; noLabel?: boolean; }) {
    function ViewAtom({ no, ex, entity }: { no: string; ex: string; entity?: EntityAtomID; }) {
        let title = `${ex} ${no}`;
        if (noLabel === true) {
            return <span title={title}>{ex}</span>;
        }
        let label: any;
        if (entity !== undefined) {
            const { caption, name } = bud;
            label = caption ?? name; // <small className="text-secondary me-2">{caption ?? name}</small>;
        }
        return <LabelBox title={title} label={label} /*colon={true}*/>
            {ex}
        </LabelBox>;
    }
    return <ViewSpecBase id={id} ViewAtom={ViewAtom} uiType={ViewBudUIType.inDiv} noLabel={noLabel} />
}

export function ViewSpecNoAtom({ id, uiType, noLabel }: { id: number; uiType?: ViewBudUIType; noLabel?: boolean; }) {
    return <ViewSpecBase id={id} ViewAtom={undefined} uiType={uiType} noLabel={noLabel} />
}

export function ViewSpecBaseOnly({ id, noVisible, bold }: { id: number; noVisible?: boolean; bold?: boolean }) {
    const { atom, } = useGetSpec(id);
    if (atom === undefined) return null;
    const { value } = atom;
    if (value === undefined) return null;
    if (ViewAtom !== undefined) {
        const { no, ex } = value;
        return <ViewAtom no={no} ex={ex} bold={bold} noLabel={!noVisible} />;
    }
}

export function ViewSpecR({ id }: { id: number; }) {
    function ViewAtom({ no, ex }: { no: string; ex: string; }) {
        return <div title={ex + ' ' + no}>
            {ex}
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
    let entity = biz.entityFromId<EntitySpec>(phrase);
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