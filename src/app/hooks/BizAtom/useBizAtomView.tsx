import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, PageSpinner } from "tonwa-app";
import { Sep, Spinner, useEffectOnce } from "tonwa-com";
import { OptionsUseBizAtom, useBizAtom } from "./useBizAtom";
import { EditAtomBud, EditAtomField } from "../BudEdit";
import { EntityAtom } from "app/Biz";
import { LabelAtomUomEdit } from "../AtomUom";
import { ViewBudRowProps } from "../model";

export function useBizAtomView(options: OptionsUseBizAtom) {
    const { id } = useParams();
    return useBizAtomViewFromId({ ...options, id: Number(id) });
}

export function useBizAtomViewFromId(options: OptionsUseBizAtom & { id: number; }) {
    const { NOLabel, exLabel, id } = options;
    const { uom, getAtom, saveField, saveBud } = useBizAtom(options)
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
    let { caption, props: atomProps } = entityAtom;
    const viewRows: ViewBudRowProps[] = [
        { name: 'id', label: 'id', readonly: true, type: 'number', },
        { name: 'no', label: NOLabel ?? '编号', readonly: true, type: 'string', },
        { name: 'ex', label: exLabel ?? '名称', type: 'string', },
    ];
    let viewUom: any;
    if (uom === true) {
        viewUom = <LabelAtomUomEdit atomId={id} uomId={state.props['atom.$.uom']?.value} />;
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
                    <EditAtomField key={index} {...v} id={id} value={main[v.name]} saveField={saveField} saveBud={saveBud} />
                    <Sep />
                </React.Fragment>)
            }
            {
                atomProps.map(v => {
                    let { name, phrase, caption } = v;
                    let prop = props[phrase] ?? propsStr[phrase];
                    return <React.Fragment key={name}>
                        <EditAtomBud
                            id={id} name={name} label={caption ?? name}
                            type={v.budDataType.dataType}
                            bizBud={v} value={prop?.value} saveField={saveField} saveBud={saveBud} />
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
