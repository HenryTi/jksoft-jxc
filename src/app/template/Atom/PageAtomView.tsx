import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { LabelRow, Sep } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { GenProps } from "app/tool";
import { GenAtom } from "./GenAtom";
import { ViewPropEx, ViewPropMain } from "./ViewProp";
import { EntityAtom } from "app/Biz";
import { ViewMetric } from "../Metric";

export function PageAtomView({ Gen }: GenProps<GenAtom>) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { genAtomView, entity } = gen;
    const { viewRows } = genAtomView;
    const { metric } = entity;
    const { id: idString } = useParams();
    const id = Number(idString);
    const { UqDefault } = uqApp.uqs;
    const { data: { main, props, bizAtom } } = useQuery('PageProductView', async () => {
        if (idString === undefined) {
            return { main: {} as any, props: {} as any };
        }
        let { main: [main], buds } = await UqDefault.GetAtom.query({ id });
        let props: { [prop: string]: { bud: number; phrase: string; value: string; } } = {};
        for (let bud of buds) {
            props[bud.phrase] = bud;
        }
        let { phrase } = main;
        let bizAtom: EntityAtom = gen.getEntityAtom(phrase);
        return { main, props, bizAtom }
    }, {
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });
    let viewMetric: any;
    if (metric !== undefined) {
        viewMetric = <ViewMetric id={id} metric={metric} className="mt-3" />;
    }
    return <Page header={bizAtom.caption}>
        {
            viewRows.map((v, index) => <React.Fragment key={index}>
                <ViewPropMain key={index} {...v} id={id} gen={gen} value={main[v.name]} />
                <Sep />
            </React.Fragment>)
        }
        {
            Array.from(bizAtom.props, ([, v]) => {
                let { name, phrase, caption } = v;
                let prop = props[phrase];
                return <React.Fragment key={name}>
                    <ViewPropEx id={id} gen={gen} name={name} label={caption ?? name} bizBud={v} value={prop?.value} />
                    <Sep />
                </React.Fragment>;
            })
        }
        {viewMetric}
    </Page>;
}
