import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BudValue, Page, PageSpinner } from "tonwa-app";
import { FA, Sep, Spinner, from62, useEffectOnce } from "tonwa-com";
import { OptionsUseBizAtom, useBizAtom } from "./useBizAtom";
import { EditBudLabelRow, EditAtomField, BudEditing } from "../Bud";
import { ViewBudRowProps } from "../Bud";
import { BizBud } from "app/Biz";
import { Tabs, Tab } from "react-bootstrap";

export function useBizAtomView(options: OptionsUseBizAtom) {
    const { id } = useParams();
    return useBizAtomViewFromId({ ...options, id: from62(id) });
}

function useBizAtomViewFromId(options: OptionsUseBizAtom & { id: number; }) {
    const { NOLabel, exLabel, id } = options;
    const { getAtom, saveField, saveBud, entity: entityAtom } = useBizAtom(options)
    const [state, setState] = useState<{
        main: any,
        buds: { [prop: number]: BudValue; };
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
    const { main, buds } = state;
    let { name, caption, buds: atomProps, budGroups } = entityAtom;
    let lbId = <span className="text-primary fw-normal">
        <FA name="compass" className="text-danger me-1" /> ID
    </span>;
    const fieldRows: ViewBudRowProps[] = [
        { name: 'id', label: lbId, readonly: true, type: 'number', },
        { name: 'no', label: NOLabel ?? '编号', readonly: true, type: 'string', },
        { name: 'ex', label: exLabel ?? '名称', type: 'string', },
    ];
    const vFieldRows = fieldRows.map((v, index) => <React.Fragment key={index}>
        <EditAtomField key={index} {...v} id={id} value={main[v.name]} saveField={saveField} saveBud={saveBud} />
        <Sep />
    </React.Fragment>);
    function buildVPropRows(props: BizBud[], plus: boolean = false) {
        return props.map(v => {
            if (v === undefined) debugger;
            let budEditing = new BudEditing(v);
            let { id: budId } = v;
            let prop = buds[budId];
            return <React.Fragment key={budId}>
                <EditBudLabelRow
                    id={id}
                    plus={plus}
                    budEditing={budEditing} value={prop as any}
                />
                <Sep />
            </React.Fragment>;
        });
    }
    let vPropRows: any;
    if (budGroups === undefined) {
        vPropRows = buildVPropRows(atomProps);
    }
    else {
        const { home, must, arr } = budGroups;
        const vAtomId = String(entityAtom.id);
        vPropRows = <Tabs className="mt-3 ps-3 border-bottom border-primary-subtle" id={vAtomId} defaultActiveKey={'+'}>
            <Tab eventKey={'+'} title={<FA name="star-o" className="text-danger" />}>
                {buildVPropRows(must.buds, true)}
                {buildVPropRows(home.buds)}
            </Tab>
            {arr.map(v => {
                const { id, name, caption, buds } = v;
                if (id === undefined) debugger;
                const vId = String(id);
                return <Tab key={id} eventKey={vId} title={caption ?? name}>
                    {buildVPropRows(buds)}
                </Tab>;
            })}
        </Tabs>;
    }
    return {
        caption,
        view: <View />,
        page: <PageView />,
        obj: main,
    };
    function View() {
        return <>
            {vFieldRows}
            {vPropRows}
        </>;
    }
    function PageView() {
        return <Page header={caption ?? name}>
            <View />
        </Page>;
    }
}
