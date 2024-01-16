import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BudValue, Page, PageSpinner, ViewSpinner } from "tonwa-app";
import { FA, Sep, from62, useEffectOnce } from "tonwa-com";
import { OptionsUseBizAtom, useBizAtom } from "./useBizAtom";
import { EditBudLabelRow, EditAtomField, BudEditing } from "../Bud";
import { ViewBudRowProps } from "../Bud";
import { BizBud } from "app/Biz";
import { Tabs, Tab } from "react-bootstrap";

export function useBizAtomView(options: OptionsUseBizAtom & { bottom?: any; }) {
    const { id } = useParams();
    return useBizAtomViewFromId({ ...options, id: from62(id) });
}

function useBizAtomViewFromId(options: OptionsUseBizAtom & { id: number; } & { bottom?: any; }) {
    const { NOLabel, exLabel, id, bottom } = options;
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
    if (state === undefined) {
        return {
            view: <ViewSpinner />,
            page: <PageSpinner />,
        };
    }
    const { main, buds } = state;
    let { name, caption, buds: atomProps, budGroups } = entityAtom;
    let lbId = <span className="text-primary fw-normal">
        <FA name="compass" className="text-danger me-1" /> ID
    </span>;
    const cnColumns2 = 'gx-0 row row-cols-1 row-cols-md-2 row-cols-lg-3';
    const fieldRows: ViewBudRowProps[] = [
        { name: 'id', label: lbId, readonly: true, type: 'number', },
        { name: 'no', label: NOLabel ?? '编号', readonly: true, type: 'string', },
        { name: 'ex', label: exLabel ?? '名称', type: 'string', },
    ];
    const vFieldRows = <div className={cnColumns2}>{
        fieldRows.map((v, index) => <div key={index} className="col">
            <EditAtomField key={index} {...v} id={id} value={main[v.name]} saveField={saveField} saveBud={saveBud} labelSize={2} />
            <Sep />
        </div>)
    }</div>;
    function buildVPropRows(props: BizBud[], flag: JSX.Element = undefined) {
        return props.map(v => {
            if (v === undefined) debugger;
            let budEditing = new BudEditing(v);
            let { id: budId } = v;
            let prop = buds[budId];
            return <div key={budId} className="col">
                <EditBudLabelRow
                    id={id}
                    flag={flag}
                    labelSize={2}
                    budEditing={budEditing} value={prop as any}
                />
                <Sep />
            </div>;
        });
    }
    let vPropRows: any;
    if (budGroups === undefined) {
        vPropRows = <div className={cnColumns2}>{buildVPropRows(atomProps)}</div>;
    }
    else {
        const { home, must, arr } = budGroups;
        const vAtomId = String(entityAtom.id);
        const baseTitle = <span>
            <span className="text-danger">*</span>基本
        </span>;
        // <FA name="star-o" className="small text-danger" />
        vPropRows = <Tabs className="mt-3 ps-3" id={vAtomId} defaultActiveKey={'+'}>
            <Tab eventKey={'+'} title={baseTitle}>
                <div className={cnColumns2}>
                    {buildVPropRows(must.buds, <span className="text-danger">*</span>)}
                    {buildVPropRows(home.buds)}
                </div>
            </Tab>
            {arr.map(v => {
                const { id, name, caption, buds } = v;
                if (id === undefined) debugger;
                const vId = String(id);
                return <Tab key={id} eventKey={vId} title={caption ?? name}>
                    <div className={cnColumns2}>
                        {buildVPropRows(buds)}
                    </div>
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
            {bottom}
        </>;
    }
    function PageView() {
        return <Page header={caption ?? name}>
            <View />
        </Page>;
    }
}
