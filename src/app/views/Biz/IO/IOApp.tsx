import { useUqApp } from "app";
import { Entity } from "app/Biz";
import { OptionsUseBizAtom, ViewAtom, buildPathAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { UseQueryOptions } from "app/tool";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { IDView, Page, useModal } from "tonwa-app";
import { CheckAsync, FA, from62 } from "tonwa-com";
import { BizPhraseType, ReturnGetDuosRet } from "uqs/UqDefault";

const ioApp = 'ioapp';
export const pathIOApp = buildPathAtom(ioApp);

const options: OptionsUseBizAtom = {
    atomName: 'atom' as any,
    NOLabel: undefined,
    exLabel: undefined,
}

export function PageIOAppList() {
    let optionsList = {
        ...options,
        ViewItemAtom: ViewAtom,
        pathAtomNew: pathIOApp.new,
        pathAtomView: pathIOApp.view,
        top: undefined as any,
    };
    let { page } = useBizAtomList(optionsList);
    return page;
}

export function PageIOAppNew() {
    let { page: Page } = useBizAtomNew(options);
    return Page;
}

export function PageIOAppView() {
    let { page: Page } = useBizAtomView({ ...options, bottom: <ViewAppIOs /> });
    return Page;
}

const cnCommon = '  ';
const cnItem = cnCommon + ' p-3 cursor-pointer border rounded-2 bg-white ';
function ViewAppIOs() {
    const { uq, biz } = useUqApp();
    const { entities } = biz;
    const modal = useModal();
    const { id } = useParams();
    const appId = from62(id);
    async function getDuos() {
        let ret = await uq.GetDuos.query({ i: appId });
        return ret.ret;
    }
    const { data: initDuos } = useQuery([id], async () => {
        return await getDuos();
    }, UseQueryOptions);
    const [duos, setDuos] = useState(initDuos);
    function ViewDuoItem({ value }: { value: ReturnGetDuosRet; }) {
        const { id, x, props } = value;
        const { caption, name, bizPhraseType } = biz.entityFromId(x);
        let icon: string, color: string;
        switch (bizPhraseType) {
            case BizPhraseType.in: icon = 'sign-in'; color = 'text-success'; break;
            case BizPhraseType.out: icon = 'sign-out'; color = 'text-warning'; break;
        }
        return <div className={cnItem}>
            <FA name={icon} className={color + ' me-2'} size="lg" />
            {caption ?? name}
        </div>;
    }
    async function onAdd() {
        let ids: Set<number> = new Set(duos.map(v => v.x));
        await modal.open(<PageSelectIOs appId={appId} ids={ids} />);
        let ret = await getDuos();
        setDuos(ret);
    }
    return <div className="tonwa-bg-gray-1 mt-3">
        <div className="small text-secondary px-3 pt-2 pb-1 border-bottom">
            接口定义
        </div>
        <div className="container my-3">
            <div className={cnRowCols}>
                {duos.map(v => <div className="col" key={v.id}>
                    <ViewDuoItem value={v} />
                </div>)}
                <div className="col d-flex align-items-center">
                    <button className="btn btn-outline-primary" onClick={onAdd}><FA name="plus" className="me-2" />增删</button>
                </div>
            </div>
        </div>
    </div>;
}

const cnRowCols = ' row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 ';
function PageSelectIOs({ appId, ids }: { appId: number, ids: Set<number>; }) {
    console.log('PageSelectApps ids', Array.from(ids).join(','));
    const { uq, biz } = useUqApp();
    const modal = useModal();
    const { ins, outs } = biz;
    function ViewAppItem({ value }: { value: Entity; }) {
        const { id, caption, name } = value;
        async function onCheckChanged(name: string, checked: boolean) {
            let io: number;
            if (checked === true) {
                await uq.SaveDuo.submit({ i: appId, x: id });
                io = id;
            }
            else {
                await uq.DelDuo.submit({ id: undefined, i: appId, x: id });
                io = -id;
            }
            await uq.BuildIOEndPoint.submit({ outer: 0, app: appId, io });
        }
        console.log('ids', Array.from(ids).join(','));
        return <CheckAsync className="border p-3 w-100" onCheckChanged={onCheckChanged} defaultChecked={ids.has(id)}>
            {caption ?? name}
        </CheckAsync>;
    }
    function onClose() {
        modal.close();
    }
    function ViewEntities({ caption, entities }: { caption: string; entities: Entity[] }) {
        return <>
            <div className="tonwa-bg-gray-1 px-3 pt-2 pb-1">{caption}</div>
            <div className={cnRowCols}>
                {entities.map(v => <div className="col" key={v.id}>
                    <ViewAppItem value={v} />
                </div>)}
            </div>
        </>;
    }
    return <Page header="增删IO">
        <div className="container my-3">
            <ViewEntities caption="入口" entities={ins} />
            <ViewEntities caption="出口" entities={outs} />
        </div>
        <div className="p-3">
            <button className="btn btn-outline-primary" onClick={onClose}>完成</button>
        </div>
    </Page>;
}
