import { useState, JSX } from "react";
import { useParams } from "react-router-dom";
import { Page, PageSpinner, ViewSpinner, useModal } from "tonwa-app";
import { FA, Sep, from62, useEffectOnce } from "tonwa-com";
import { OptionsUseBizAtom, useBizAtom } from "./useBizAtom";
import { EditBudLabelRow, EditAtomField } from "../Bud";
import { ViewBudRowProps } from "../Bud";
import { BizBud, EntityAtom, EntityID } from "tonwa";
import { Tabs, Tab } from "react-bootstrap";
import { ViewForkListAutoLoad } from "./fork";
import { AtomIDValue } from "./AtomIDValue";
// import { FormBudsStore, ValuesBudsEditing } from "../../Store/BudsEditing";
import { ViewIDLabel } from "../tool";
import { AtomStore } from "./AtomStore";
import { FormBudsStore, ValuesBudsEditing } from "app/Store";

export function useBizAtomView(options: OptionsUseBizAtom & { id?: number; bottom?: any; }) {
    const { id: pageId } = useParams();
    return useBizAtomViewFromId({ ...options, id: options.id ?? from62(pageId) });
}

const cnColumns2 = 'gx-0 row row-cols-1 row-cols-md-2 row-cols-lg-3';

function useBizAtomViewFromId(options: OptionsUseBizAtom & { id: number; } & { bottom?: any; }) {
    const { NOLabel, exLabel, id, bottom, readOnly } = options;
    const { getAtom, saveField, saveBudValue, entity: entityAtom } = useBizAtom(options)
    const [state, setState] = useState<AtomIDValue>(undefined);
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
    let { name, caption } = entityAtom;
    const fieldRows: ViewBudRowProps[] = [
        { name: 'ex', label: exLabel ?? '名称', type: 'string', bold: true, },
        { name: 'no', label: NOLabel ?? '编号', readonly: true, type: 'string', },
        { name: 'id', label: <ViewIDLabel />, readonly: true, type: 'number', },
    ];
    const vFieldRows = <div className={cnColumns2}>
        {
            fieldRows.map((v, index) => <div key={index} className="col">
                <EditAtomField key={index} {...v} id={id} value={main[v.name]} saveField={saveField} saveBud={saveBudValue} labelSize={0} />
                <Sep />
            </div>)
        }
    </div>;

    return {
        caption,
        view: <View />,
        page: <PageView />,
        obj: main,
    };
    function View() {
        return <>
            {vFieldRows}
            <ViewIDBuds entity={entityAtom} value={state} readOnly={readOnly} />
            {bottom}
        </>;
    }
    function PageView() {
        const modal = useModal();
        let right: any;
        if (entityAtom.fork) {
            right = <button className="btn btn-sm btn-success me-2" onClick={() => modal.open(<PageEdit />)}>
                <FA name="pencil" />
            </button>;
        }
        return <Page header={caption} right={right}>
            <View />
        </Page>;
    }
    function PageEdit() {
        return <Page header={caption + ' - 详情'}>
            {vFieldRows}
            <ViewIDEdit entity={entityAtom} value={state} readOnly={readOnly} />
        </Page>;
    }
}
function useAtomBase(props: OptionsUseBizAtom & { id: number; }) {
    const modal = useModal();
    const [state, setState] = useState<AtomIDValue>(undefined);
    const { entityAtom, id, NOLabel, exLabel } = props;
    const atomStore = new AtomStore(modal, entityAtom);
    useEffectOnce(() => {
        (async () => {
            let ret = await atomStore.getAtom(id);
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
    let { name, caption } = entityAtom;
    const fieldRows: ViewBudRowProps[] = [
        { name: 'ex', label: exLabel ?? '名称', type: 'string', bold: true, },
        { name: 'no', label: NOLabel ?? '编号', readonly: true, type: 'string', },
        { name: 'id', label: <ViewIDLabel />, readonly: true, type: 'number', },
    ];
    const vFieldRows = <div className={cnColumns2}>
        {
            fieldRows.map((v, index) => <div key={index} className="col">
                <EditAtomField key={index} {...v} id={id} value={main[v.name]}
                    saveField={atomStore.saveField} saveBud={atomStore.saveBudValue} labelSize={0} />
                <Sep />
            </div>)
        }
    </div>;
    return { state, vFieldRows }
}
/*
export function ViewAtom(props: OptionsUseBizAtom & { id: number; } & { bottom?: any; }) {
    const modal = useModal();
    const { NOLabel, exLabel, id, bottom, readOnly, entityAtom } = props;
    const [state, setState] = useState<AtomIDValue>(undefined);
    const atomStore = new AtomStore(modal, entityAtom);
    useEffectOnce(() => {
        (async () => {
            let ret = await atomStore.getAtom(id);
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
    let { name, caption } = entityAtom;
    const fieldRows: ViewBudRowProps[] = [
        { name: 'ex', label: exLabel ?? '名称', type: 'string', bold: true, },
        { name: 'no', label: NOLabel ?? '编号', readonly: true, type: 'string', },
        { name: 'id', label: <ViewIDLabel />, readonly: true, type: 'number', },
    ];
    const vFieldRows = <div className={cnColumns2}>
        {
            fieldRows.map((v, index) => <div key={index} className="col">
                <EditAtomField key={index} {...v} id={id} value={main[v.name]}
                    saveField={atomStore.saveField} saveBud={atomStore.saveBudValue} labelSize={0} />
                <Sep />
            </div>)
        }
    </div>;
    return <>
        {vFieldRows}
        <ViewIDBuds entity={entityAtom} value={state} readOnly={readOnly} />
        {bottom}
    </>;
}
*/
export function PageAtomView(props: OptionsUseBizAtom & { id: number; } & { bottom?: any; }) {
    const modal = useModal();
    const { entityAtom, readOnly, bottom } = props;
    const { caption } = entityAtom;
    const { state, vFieldRows } = useAtomBase(props);
    if (state === undefined) return <PageSpinner />;
    let right: any;
    if (entityAtom.fork) {
        function onRight() {
            modal.open(<PageAtomEdit {...props} />);
        }
        right = <button className="btn btn-sm btn-success me-2" onClick={onRight}>
            <FA name="pencil" />
        </button>;
    }
    return <Page header={caption} right={right}>
        {vFieldRows}
        <ViewIDBuds entity={entityAtom} value={state} readOnly={readOnly} />
        {bottom}
    </Page>;
}

export function PageAtomEdit(props: OptionsUseBizAtom & { id: number; } & { bottom?: any; }) {
    const { entityAtom, readOnly, bottom } = props;
    const { caption } = entityAtom;
    const { state, vFieldRows } = useAtomBase(props);
    if (state === undefined) return <PageSpinner />;
    return <Page header={caption + ' - 详情'}>
        {vFieldRows}
        <ViewIDEdit entity={entityAtom} value={state} readOnly={readOnly} />
        {bottom}
    </Page>;
}

export function ViewIDEdit({ entity, value, readOnly }: { entity: EntityID; value: AtomIDValue; readOnly: boolean; }) {
    const modal = useModal();
    let { buds: atomProps, budGroups } = entity;
    const { id, buds } = value;
    function buildVPropRows(props: BizBud[], flag: JSX.Element = undefined) {
        const valuesBudsEditing = new ValuesBudsEditing(entity.biz, props);
        const budEditings = valuesBudsEditing.createBudEditings();
        const formBudsStore = new FormBudsStore(modal, valuesBudsEditing);
        return budEditings.map(v => {
            if (v === undefined) debugger;
            let budEditing = v; // valuesBudsEditing.createBudEditing(v); // new BudEditing(v);
            const { bizBud } = budEditing;
            let { id: budId } = bizBud;
            let prop = buds[budId];
            if (prop === undefined) {
                prop = valuesBudsEditing.getBudValue(bizBud);
            }
            return <div key={budId} className="col">
                <EditBudLabelRow
                    id={id}
                    flag={flag}
                    labelSize={2}
                    formBudsStore={formBudsStore}
                    budEditing={budEditing} value={prop as any}
                    readOnly={readOnly}
                />
                <Sep />
            </div>;
        });
    }
    if (budGroups === undefined) {
        return <div className={cnColumns2}>{buildVPropRows(atomProps)}</div>;
    }

    const { home, must, arr } = budGroups;
    const vAtomId = String(entity.id);
    const baseTitle = <span>
        <span className="text-danger">*</span>基本
    </span>;
    return <Tabs className="mt-3 ps-3 mb-1" id={vAtomId} defaultActiveKey={'+'}>
        <Tab eventKey={'+'} title={baseTitle}>
            <div className={cnColumns2}>
                {must !== undefined && buildVPropRows(must.buds, <span className="text-danger">*</span>)}
                {home !== undefined && buildVPropRows(home.buds)}
            </div>
        </Tab>
        {arr.map((v, index) => {
            const { id, name, caption, buds } = v;
            if (id === undefined) debugger;
            if (typeof id !== 'number') debugger;
            const vId = String(id);
            return <Tab key={id} eventKey={vId} title={caption ?? name}>
                <div className={cnColumns2}>
                    {buildVPropRows(buds)}
                </div>
            </Tab>;
        })}
    </Tabs>;
}

export function ViewIDBuds({ entity, value, readOnly }: { entity: EntityID; value: AtomIDValue; readOnly: boolean; }) {
    let { fork } = entity;
    if (fork !== undefined) {
        return <ViewForkListAutoLoad fork={fork} value={value} />;
    }
    return <ViewIDEdit entity={entity} value={value} readOnly={readOnly} />;
}
