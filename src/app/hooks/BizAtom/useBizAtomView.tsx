import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, PageSpinner } from "tonwa-app";
import { Sep, Spinner, useEffectOnce } from "tonwa-com";
import { OptionsUseBizAtom, ViewPropRowProps, useBizAtom } from "./useBizAtom";
import { ViewAtomProp, ViewPropMain } from "./ViewAtomProp";
import { EntityAtom } from "app/Biz";
import { ViewUom } from "../Uom";

export function useBizAtomView(options: OptionsUseBizAtom) {
    const { id } = useParams();
    return useBizAtomViewFromId({ ...options, id: Number(id) });
}

export function useBizAtomViewFromId(options: OptionsUseBizAtom & { id: number; }) {
    const { NOLabel, exLabel, id } = options;
    const { uom, getAtom, savePropMain, savePropEx } = useBizAtom(options)
    const [state, setState] = useState<{
        main: any,
        props: { [prop: string]: { bud: number; phrase: string; value: number; } };
        propsStr: { [prop: string]: { bud: number; phrase: string; value: string; } };
        entityAtom: EntityAtom;
    }>(undefined);
    useEffectOnce(() => {
        (async () => {
            let ret = await getAtom(id);
            setState(ret);
        })();
    });
    if (state === undefined || state.entityAtom === undefined) return {
        view: <Spinner />,
        page: <PageSpinner />,
    };
    const { main, props, propsStr, entityAtom } = state;
    /*
    // useQuery在modal里面会引发错误
    const { data: { main, props, propsStr, entityAtom } } = useQuery(['PageAtomView', id], async () => {
        if (id === undefined) {
            return { main: {} as any, props: {} as any };
        }
        let { main: [main], budsInt, budsDec, budsStr } = await UqDefault.GetAtom.query({ id });
        let props: { [prop: string]: { bud: number; phrase: string; value: number; } } = {};
        for (let bud of budsInt) {
            props[bud.phrase] = bud;
        }
        for (let bud of budsDec) {
            props[bud.phrase] = bud;
        }
        let propsStr: { [prop: string]: { bud: number; phrase: string; value: string; } } = {};
        for (let bud of budsStr) {
            propsStr[bud.phrase] = bud;
        }
        let { phrase } = main;
        let entityAtom = biz.entities[phrase];
        return { main, props, propsStr, entityAtom }
    }, {
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });
    */
    let { caption, props: atomProps } = entityAtom;
    const viewRows: ViewPropRowProps[] = [
        { name: 'id', label: 'id', readonly: true, },
        { name: 'no', label: NOLabel ?? 'NO', readonly: true, },
        { name: 'ex', label: exLabel ?? 'EX', },
    ];
    let viewUom: any;
    if (uom === true) {
        viewUom = <ViewUom id={id} className="mt-3" />;
    }
    return {
        caption,
        view: <View />,
        page: <PageView />,
        obj: main,
    };

    function View() {
        return <>
            {
                viewRows.map((v, index) => <React.Fragment key={index}>
                    <ViewPropMain key={index} {...v} id={id} value={main[v.name]} savePropMain={savePropMain} savePropEx={savePropEx} />
                    <Sep />
                </React.Fragment>)
            }
            {
                atomProps.map(v => {
                    let { name, phrase, caption } = v;
                    let prop = props[phrase] ?? propsStr[phrase];
                    return <React.Fragment key={name}>
                        <ViewAtomProp id={id} name={name} label={caption ?? name} bizBud={v} value={prop?.value} savePropMain={savePropMain} savePropEx={savePropEx} />
                        <Sep />
                    </React.Fragment>;
                })
            }
            {viewUom}
        </>;
    }
    function PageView() {
        return <Page header={caption}>
            <View />
        </Page>;
    }
}
