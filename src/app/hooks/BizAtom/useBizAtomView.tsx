import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, PageSpinner } from "tonwa-app";
import { FA, Sep, Spinner, from62, useEffectOnce } from "tonwa-com";
import { OptionsUseBizAtom, useBizAtom } from "./useBizAtom";
import { EditBud, EditAtomField } from "../BudEdit";
import { LabelAtomUomEdit } from "../AtomUom";
import { BudValue, ViewBudRowProps } from "../model";

export function useBizAtomView(options: OptionsUseBizAtom) {
    const { id } = useParams();
    return useBizAtomViewFromId({ ...options, id: from62(id) });
}

export function useBizAtomViewFromId(options: OptionsUseBizAtom & { id: number; }) {
    const { NOLabel, exLabel, id } = options;
    const { uom, getAtom, saveField, saveBud, entity: entityAtom } = useBizAtom(options)
    const [state, setState] = useState<{
        main: any,
        buds: { [prop: number]: BudValue; };
        // uoms: AtomUomProps[];
        // entityAtom: EntityAtom;
    }>(undefined);
    useEffectOnce(() => {
        (async () => {
            let ret = await getAtom(id);
            setState(ret);
        })();
    });
    if (state === undefined/* || state.entityAtom === undefined*/) {
        return {
            view: <Spinner />,
            page: <PageSpinner />,
        };
    }
    const { main, buds/*, entityAtom, uoms*/ } = state;
    let uoms = [] as any;
    let { name, caption, props: atomProps } = entityAtom;
    let lbId = <span className="text-primary fw-normal">
        <FA name="compass" className="text-danger me-1" /> ID
    </span>;
    const viewRows: ViewBudRowProps[] = [
        { name: 'id', label: lbId, readonly: true, type: 'number', },
        { name: 'no', label: NOLabel ?? '编号', readonly: true, type: 'string', },
        { name: 'ex', label: exLabel ?? '名称', type: 'string', },
    ];
    let viewUom: any;
    if (uom === true) {
        viewUom = <LabelAtomUomEdit atomId={id} uoms={uoms} />;
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
            {viewUom}
            {
                atomProps.map(v => {
                    let { id: budId } = v;
                    let prop = buds[budId];
                    return <React.Fragment key={budId}>
                        <EditBud
                            id={id}
                            bizBud={v} value={prop as any}
                        />
                        <Sep />
                    </React.Fragment>;
                })
            }
        </>;
    }
    function PageView() {
        return <Page header={caption ?? name}>
            <View />
        </Page>;
    }
}
