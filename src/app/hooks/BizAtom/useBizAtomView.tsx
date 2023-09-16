import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Page, PageSpinner } from "tonwa-app";
import { Sep, Spinner, useEffectOnce } from "tonwa-com";
import { OptionsUseBizAtom, useBizAtom } from "./useBizAtom";
import { EditBud, EditAtomField } from "../BudEdit";
import { EntityAtom } from "app/Biz";
import { LabelAtomUomEdit } from "../AtomUom";
import { BudValue, ViewBudRowProps } from "../model";
import { AtomUomProps } from "app/tool";

export function useBizAtomView(options: OptionsUseBizAtom) {
    const { id } = useParams();
    return useBizAtomViewFromId({ ...options, id: Number(id) });
}

export function useBizAtomViewFromId(options: OptionsUseBizAtom & { id: number; }) {
    const { NOLabel, exLabel, id } = options;
    const { uom, getAtom, saveField, saveBud } = useBizAtom(options)
    const [state, setState] = useState<{
        main: any,
        buds: { [prop: string]: { bud: number; phrase: string; value: BudValue; } };
        uoms: AtomUomProps[];
        entityAtom: EntityAtom;
    }>(undefined);
    useEffectOnce(() => {
        (async () => {
            let ret = await getAtom(id);
            setState(ret);
        })();
    });
    if (state === undefined || state.entityAtom === undefined) {
        return {
            view: <Spinner />,
            page: <PageSpinner />,
        };
    }
    const { main, buds, entityAtom, uoms } = state;
    let { name, caption, props: atomProps } = entityAtom;
    const viewRows: ViewBudRowProps[] = [
        { name: 'id', label: 'id', readonly: true, type: 'number', },
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
                    let { name, phrase, caption } = v;
                    let prop = buds[phrase];
                    return <React.Fragment key={name}>
                        <EditBud
                            id={id}
                            // name={name} label={caption ?? name}
                            // type={v.budDataType.dataType}
                            bizBud={v} value={prop?.value as any}
                        // saveField={saveField} saveBud={saveBud} 
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
