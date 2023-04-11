import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { Sep } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { GenProps } from "app/tool";
import { GenAtom } from "./GenAtom";
import { ViewPropEx, ViewPropMain } from "./ViewProp";

export function PageAtomView({ Gen }: GenProps<GenAtom>) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { genAtomView } = gen;
    const { caption, viewRows, bizAtom } = genAtomView;
    const { id: idString } = useParams();
    const id = Number(idString);
    const { UqDefault } = uqApp.uqs;
    const { data: { main, props } } = useQuery('PageProductView', async () => {
        if (idString === undefined) {
            return { main: {} as any, props: {} as any };
        }
        let { main: [main], buds } = await UqDefault.GetAtom.query({ id });
        let props: { [prop: string]: { bud: number; phrase: string; value: string; } } = {};
        for (let bud of buds) {
            props[bud.phrase] = bud;
        }
        return { main, props }
    }, {
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });
    return <Page header={caption}>
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
    </Page>;
}
