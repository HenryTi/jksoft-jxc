import { useUqApp } from "app";
import {
    BudEditing, EditBudLabelRow, OptionsUseBizAtom, ViewAtom
    , buildPathAtom, useBizAtomList, useBizAtomNew, useBizAtomView
} from "app/hooks";
import { UseQueryOptions } from "app/tool";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { IDView, Page, useModal } from "tonwa-app";
import { CheckAsync, FA, LabelRow, Sep, from62 } from "tonwa-com";
import { BizPhraseType } from "uqs/UqDefault";
import { BudColl, DuoOuterApp, budArrToColl } from "./model";
import { EntityAtom, EntityIOApp, IOAppID } from "app/Biz";
import { PageAtomMap } from "./PageAtomMap";

const ioOuter = 'ioouter';
export const pathIOOuter = buildPathAtom(ioOuter);

const options: OptionsUseBizAtom = {
    atomName: 'atom' as any,
    NOLabel: undefined,
    exLabel: undefined,
}

export function PageIOOuterList({ top, header }: { top: JSX.Element; header: string; }) {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { entities } = biz;
    let ioOuter = entities['$ioouter'] as EntityAtom;
    let optionsList = {
        ...options,
        ViewItemAtom: ViewAtom,
        pathAtomNew: pathIOOuter.new,
        pathAtomView: pathIOOuter.view,
        entityAtom: ioOuter,
        top,
        header,
    };
    let { page } = useBizAtomList(optionsList);
    return page;
}

export function PageIOOuterNew() {
    let { page: Page } = useBizAtomNew(options);
    return Page;
}

export function PageIOOuterView() {
    let { caption, view } = useBizAtomView({ ...options, bottom: <ViewOuterApps /> });
    return <Page header={caption ?? '...'}>
        {view}
    </Page>;
}


const cnRowCols = ' row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 ';
const cnCommon = '  ';
const cnItem = cnCommon + ' p-3 cursor-pointer border rounded-2 bg-white ';
function ViewOuterApps() {
    const { uq, biz } = useUqApp();
    const modal = useModal();
    const { id } = useParams();
    const outerId = from62(id);
    async function getAppDuos() {
        let { ret } = await uq.GetDuos.query({ i: outerId });
        let apps: DuoOuterApp[] = [];
        for (let v of ret) {
            let { id, x, props } = v;
            let ioApp = biz.entityFromId<EntityIOApp>(x);
            if (ioApp === undefined) continue;
            if (ioApp.bizPhraseType !== BizPhraseType.ioApp) continue;
            apps.push({
                id,
                // x,
                i: outerId,
                ioApp,
                buds: budArrToColl(props),
            } as DuoOuterApp);
        }
        return apps;
    }
    const { data: initApps } = useQuery([id], async () => {
        return await getAppDuos();
    }, UseQueryOptions);
    const [apps, setApps] = useState(initApps);

    function ViewDuoItem({ value }: { value: DuoOuterApp; }) {
        const { id, ioApp, buds } = value;
        function onApp() {
            modal.open(<PageOuterApp duo={id} outer={outerId} ioApp={ioApp} buds={buds} />);
        }
        const { name, caption } = ioApp;
        return <div className={cnItem} onClick={onApp}>
            {caption ?? name}
        </div>;
    }
    async function onAddApp() {
        let ids: Set<number> = new Set(apps.map(v => v.ioApp.id));
        await modal.open(<PageSelectApps outerId={outerId} ids={ids} />);
        let appsArr = await getAppDuos();
        setApps(appsArr);
    }
    return <div className="">
        <div className="tonwa-bg-gray-1 mt-4">
            <div className="tonwa-bg-gray-2 small text-secondary px-3 pt-2 pb-1 border-bottom">
                接口App
            </div>
            <div className="container py-3">
                <div className={cnRowCols}>
                    {apps.map(v => <div className="col" key={v.id}>
                        <ViewDuoItem value={v} />
                    </div>)}
                    <div className="col d-flex align-items-center">
                        <button className="btn btn-outline-primary" onClick={onAddApp}><FA name="plus" className="me-2" />增删</button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

function PageSelectApps({ outerId, ids }: { outerId: number, ids: Set<number>; }) {
    console.log('PageSelectApps ids', Array.from(ids).join(','));
    const { uq, biz } = useUqApp();
    const { ioApps } = biz;
    const modal = useModal();
    function ViewAppItem({ value }: { value: EntityIOApp; }) {
        const { id, name, caption } = value;
        async function onCheckChanged(name: string, checked: boolean) {
            let app: number;
            if (checked === true) {
                await uq.SaveDuoOuterApp.submit({ i: outerId, x: id });
                app = id;
            }
            else {
                await uq.DelDuoOuterApp.submit({ id: undefined, i: outerId, x: id });
                app = - id;
            }
            //await uq.BuildIOEndPoint.submit({ outer: outerId, app, io: 0 });
        }
        console.log('ids', Array.from(ids).join(','));
        return <CheckAsync className="border p-3 w-100" onCheckChanged={onCheckChanged} defaultChecked={ids.has(id)}>
            {caption ?? name}
        </CheckAsync>;
    }
    function onClose() {
        modal.close();
    }
    return <Page header="增删接口App">
        <div className="container my-3">
            <div className={cnRowCols}>
                {ioApps.map(v => <div className="col" key={v.id}>
                    <ViewAppItem value={v} />
                </div>)}
            </div>
        </div>
        <div className="p-3">
            <button className="btn btn-outline-primary" onClick={onClose}>完成</button>
        </div>
    </Page>;
}

function PageOuterApp({ duo, outer, ioApp, buds }: { duo: number; outer: number; ioApp: EntityIOApp; buds: BudColl; }) {
    const { uq, biz } = useUqApp();
    const modal = useModal();
    const duoApp = biz.entities['$ioouterapp'];
    const vFieldRows = <div>
        {
            duoApp.buds.map((v, index) => {
                let budEditing = new BudEditing(v);
                return <div key={index} className="col">
                    <EditBudLabelRow key={index} {...v} id={duo} value={buds[v.id]} labelSize={1} budEditing={budEditing} />
                    <Sep />
                </div>;
            })
        }
    </div>;
    const { caption, name } = ioApp;
    function ViewIOAppID({ value }: { value: IOAppID }) {
        const { name, caption, atoms } = value;
        function onAtom() {
            modal.open(<PageAtomMap outerId={outer} ioAppID={value} />);
        }
        return <div className={cnItem} onClick={onAtom}>
            {caption ?? name} :: {atoms.map(v => <span key={v.id}>{v.caption ?? v.name}</span>)}
        </div>
    }
    return <Page header="接口设置">
        <LabelRow labelSize={1}>
            <div>接口机构</div>
            <div className="p-3">
                <IDView uq={uq} id={outer} Template={ViewAtom} />
            </div>
        </LabelRow>
        <Sep />
        <LabelRow labelSize={1}>
            <div>接口App</div>
            <div className="p-3">
                {caption ?? name}
            </div>
        </LabelRow>
        <Sep />

        <Sep className="mt-2" />
        {vFieldRows}

        <div className="tonwa-bg-gray-1 mt-4">
            <div className="tonwa-bg-gray-2 small text-secondary px-3 pt-2 pb-1 border-bottom mt-3">
                基础数据对照表
            </div>
            <div className="container py-3">
                <div className={cnRowCols}>
                    {ioApp.IDs.map(v => <div className="col" key={v.id}>
                        <ViewIOAppID value={v} />
                    </div>)}
                </div>
            </div>
        </div>
    </Page>;
}
