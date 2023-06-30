import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { Sep } from "tonwa-com";
import { OptionsUseBizAtom, ViewPropRowProps, useBizAtom } from "./useBizAtom";
import { ViewPropEx, ViewPropMain } from "./ViewProp";
import { ViewMetric } from "../Metric";

export function useBizAtomView(options: OptionsUseBizAtom) {
    const { NOLabel, exLabel } = options;
    const gen = useBizAtom(options)
    const { uqApp, biz, metric, savePropMain, savePropEx } = gen;
    const { id: idString } = useParams();
    const id = Number(idString);
    const { UqDefault } = uqApp.uqs;
    const { data: { main, props, entityAtom } } = useQuery('PageProductView', async () => {
        if (idString === undefined) {
            return { main: {} as any, props: {} as any };
        }
        let { main: [main], buds } = await UqDefault.GetAtom.query({ id });
        let props: { [prop: string]: { bud: number; phrase: string; value: string; } } = {};
        for (let bud of buds) {
            props[bud.phrase] = bud;
        }
        let { phrase } = main;
        let entityAtom = biz.entities[phrase];
        return { main, props, entityAtom }
    }, {
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });
    const viewRows: ViewPropRowProps[] = [
        { name: 'id', label: 'id', readonly: true, },
        { name: 'no', label: NOLabel ?? 'NO', readonly: true, },
        { name: 'ex', label: exLabel ?? 'EX', },
    ];
    let viewMetric: any;
    if (metric !== undefined) {
        viewMetric = <ViewMetric id={id} metric={metric} className="mt-3" />;
    }
    let { caption, props: atomProps } = entityAtom;
    return <Page header={caption}>
        {
            viewRows.map((v, index) => <React.Fragment key={index}>
                <ViewPropMain key={index} {...v} id={id} value={main[v.name]} savePropMain={savePropMain} savePropEx={savePropEx} />
                <Sep />
            </React.Fragment>)
        }
        {
            atomProps.map(v => {
                let { name, phrase, caption } = v;
                let prop = props[phrase];
                return <React.Fragment key={name}>
                    <ViewPropEx id={id} name={name} label={caption ?? name} bizBud={v} value={prop?.value} savePropMain={savePropMain} savePropEx={savePropEx} />
                    <Sep />
                </React.Fragment>;
            })
        }
        {viewMetric}
    </Page>;
}
/*
export function PageAtomView(props: GenProps<GenAtom>) {
    let view = useBizAtomView(props);
    return view;
}
*/