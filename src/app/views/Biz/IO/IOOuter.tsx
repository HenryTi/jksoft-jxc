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
import { ReturnSearchAtom$page } from "uqs/UqDefault";
import { BudColl, DuoObj, budArrToColl } from "./model";
import { Entity, EntityAtom } from "app/Biz";
import { PageAtomMap, PageSelectAtomEntity } from "./IOAtom";

const ioOuter = 'ioouter';
const $ioApp = '$ioapp';
export const pathIOOuter = buildPathAtom(ioOuter);

const options: OptionsUseBizAtom = {
    atomName: 'atom' as any,
    NOLabel: undefined,
    exLabel: undefined,
}

export function PageIOOuterList() {
    let optionsList = {
        ...options,
        ViewItemAtom: ViewAtom,
        pathAtomNew: pathIOOuter.new,
        pathAtomView: pathIOOuter.view,
        top: undefined as any,
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
        let apps: DuoObj[] = [];
        let atoms: Entity[] = [];
        for (let v of ret) {
            let { id, x, props } = v;
            let atomEntity = biz.entityFromId(x);
            if (atomEntity !== undefined) {
                atoms.push(atomEntity);
            }
            else {
                apps.push({
                    id,
                    x,
                    i: outerId,
                    buds: budArrToColl(props),
                } as DuoObj);
            }
        }
        return { apps, atoms };
    }
    const { data: { apps: initApps, atoms: initAtoms } } = useQuery([id], async () => {
        return await getAppDuos();
    }, UseQueryOptions);
    const [apps, setApps] = useState(initApps);
    const [atoms, setAtoms] = useState(initAtoms);

    function ViewDuoItem({ value }: { value: DuoObj; }) {
        const { id, x, buds } = value;
        function onApp() {
            modal.open(<PageOuterApp duo={id} outer={outerId} app={x} buds={buds} />);
        }
        return <div className={cnItem} onClick={onApp}>
            <IDView uq={uq} id={x} Template={ViewAtom} />
        </div>;
    }
    async function onAddApp() {
        let ids: Set<number> = new Set(apps.map(v => v.x));
        await modal.open(<PageSelectApps outerId={outerId} ids={ids} />);
        let { apps: appsArr } = await getAppDuos();
        setApps(appsArr);
    }
    function ViewAtomItem({ value }: { value: Entity }) {
        const { name, caption } = value;
        function onAtom() {
            modal.open(<PageAtomMap entity={value as EntityAtom} />);
        }
        return <div className={cnItem} onClick={onAtom}>
            {caption ?? name}
        </div>
    }
    async function onAddAtom() {
        let ids: Set<number> = new Set(atoms.map(v => v.id));
        await modal.open(<PageSelectAtomEntity outerId={outerId} ids={ids} />);
        let { atoms: atomsArr } = await getAppDuos();
        setAtoms(atomsArr);
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
        <div className="tonwa-bg-gray-1 mt-4">
            <div className="tonwa-bg-gray-2 small text-secondary px-3 pt-2 pb-1 border-bottom mt-3">
                基础数据对照表
            </div>
            <div className="container py-3">
                <div className={cnRowCols}>
                    {atoms.map(v => <div className="col" key={v.id}>
                        <ViewAtomItem value={v} />
                    </div>)}
                    <div className="col d-flex align-items-center">
                        <button className="btn btn-outline-primary" onClick={onAddAtom}><FA name="plus" className="me-2" />增删</button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

function PageSelectApps({ outerId, ids }: { outerId: number, ids: Set<number>; }) {
    console.log('PageSelectApps ids', Array.from(ids).join(','));
    const { uq, biz } = useUqApp();
    const modal = useModal();
    const appEntity = biz.entities[$ioApp];
    const { data: apps } = useQuery(['allApps', appEntity.id], async () => {
        let ret = await uq.SearchAtom.page({ atom: appEntity.id, key: undefined }, undefined, 1000);
        let { $page } = ret;
        $page.reverse();
        return $page;
    }, UseQueryOptions);
    function ViewAppItem({ value }: { value: ReturnSearchAtom$page; }) {
        const { id, no, ex } = value;
        async function onCheckChanged(name: string, checked: boolean) {
            let app: number;
            if (checked === true) {
                await uq.SaveDuo.submit({ i: outerId, x: id });
                app = id;
            }
            else {
                await uq.DelDuo.submit({ id: undefined, i: outerId, x: id });
                app = - id;
            }
            await uq.BuildIOEndPoint.submit({ outer: outerId, app, io: 0 });
        }
        console.log('ids', Array.from(ids).join(','));
        return <CheckAsync className="border p-3 w-100" onCheckChanged={onCheckChanged} defaultChecked={ids.has(id)}>
            {ex}
        </CheckAsync>;
    }
    function onClose() {
        modal.close();
    }
    return <Page header="增删接口App">
        <div className="container my-3">
            <div className={cnRowCols}>
                {apps.map(v => <div className="col" key={v.id}>
                    <ViewAppItem value={v} />
                </div>)}
            </div>
        </div>
        <div className="p-3">
            <button className="btn btn-outline-primary" onClick={onClose}>完成</button>
        </div>
    </Page>;
}

function PageOuterApp({ duo, outer, app, buds }: { duo: number; outer: number; app: number; buds: BudColl; }) {
    const { uq, biz } = useUqApp();
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
                <IDView uq={uq} id={app} Template={ViewAtom} />
            </div>
        </LabelRow>
        <Sep />

        <Sep className="mt-2" />
        {vFieldRows}
    </Page>;
}
