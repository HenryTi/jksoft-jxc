import { useUqApp } from "app";
import { EntityIOSite } from "app/Biz";
import { ButtonRightAdd, PageQueryMore } from "app/coms";
import { ViewAtom, useIDSelect } from "app/hooks";
import { AtomData } from "app/tool";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, FA } from "tonwa-com";
import { ReturnGetIOAtomAppsRet } from "uqs/UqDefault";
import { IOApp, PageApp, TopItem } from "./PageApp";

export function PageSiteAtoms({ ioSite }: { ioSite: EntityIOSite; }) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { caption, name, tie } = ioSite;
    const selectAtom = useIDSelect();
    const none = <div className='m-3 small text-muted'>[无]</div>;
    function ViewItem({ value: { id, no, ex, errorCount } }: { value: { id: number; no: string; ex: string; errorCount: number; } }) {
        return <div className="px-3 py-2">
            <div>
                {errorCount > 0 && <FA name="exclamation-circle" className="me-3 text-danger" />}
                {ex}
            </div>
            <div className="text-secondary small">{no}</div>
        </div>;
    }
    async function onAdd() {
        let atom = await selectAtom(tie);
        if (atom === undefined) return;
        await modal.open(<PageSetApp atom={atom} ioSite={ioSite} />);
    }
    async function onItemClick(item: any) {
        modal.open(<PageSetApp atom={item} ioSite={ioSite} />);
    }
    const right = <ButtonRightAdd onClick={onAdd} />;
    return <PageQueryMore header={caption ?? name}
        query={uq.GetIOSiteAtoms}
        param={{ ioSite: ioSite.id }}
        sortField="id"
        ViewItem={ViewItem}
        none={none}
        right={right}
        onItemClick={onItemClick}
    />;
}

function PageSetApp({ atom, ioSite }: { atom: AtomData; ioSite: EntityIOSite; }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const modal = useModal();
    const { caption, name, tie, apps } = ioSite;
    const { data } = useQuery({
        queryKey: ['GetIOAtomApps'],
        queryFn: async () => {
            let { ret } = await uq.GetIOAtomApps.query({ ioSite: ioSite.id, atom: atom.id });
            const coll: { [app: number]: ReturnGetIOAtomAppsRet } = {};
            for (let r of ret) coll[r.ioApp] = r;
            const appsChecked: IOApp[] = [], appsUnchecked: IOApp[] = [];
            for (let app of apps) {
                let appVal = coll[app.id];
                if (appVal !== undefined && appVal.valid === 1) {
                    appsChecked.push({
                        entity: app,
                        val: appVal,
                    });
                }
                else appsUnchecked.push({
                    entity: app,
                    val: undefined
                });
            }
            return { appsChecked, appsUnchecked };
        },
        refetchOnWindowFocus: false
    });

    const { appsChecked: initChecked, appsUnchecked: initUnchecked } = data;
    const [appsChecked, setAppsChecked] = useState(initChecked);
    const [appsUnchecked, setAppsUnchecked] = useState(initUnchecked);
    function ViewAppChecked({ value }: { value: IOApp; }) {
        const { entity: appEntity, val: appVal } = value;
        async function onEdit() {
            let ret = await modal.open(<PageApp ioSite={ioSite} atom={atom} ioApp={value} />);
            if (ret !== false) return;
            const { uqMan } = uqApp;
            let { uqApi } = uqMan;
            await uqApi.appKey(ioSite.id, atom.id, appEntity.id, 0);
            value.val = undefined;
            let index = appsChecked.findIndex(v => v === value);
            if (index >= 0) {
                appsChecked.splice(index, 1);
                setAppsUnchecked([...appsChecked]);
            }
            setAppsUnchecked([value, ...appsUnchecked]);
        }
        const { id, caption, name } = appEntity;
        return <div key={id} className="border-bottom d-flex px-3 py-2 cursor-pointer">
            <div className={'flex-fill '} onClick={onEdit}>
                <div>{caption ?? name}</div>
                <div className="pt-2 small text-secondary">appKey:{appVal.inKey}</div>
            </div>
            <FA name="angle-right" className="px-3 py-2 text-info" />
        </div>;
    }
    function ViewAppUnchecked({ value }: { value: IOApp; }) {
        const { entity: appEntity } = value;
        async function onConnect() {
            const { uqMan } = uqApp;
            let { uqApi } = uqMan;
            let { siteAtomApp, appKey, appPassword } = await uqApi.appKey(ioSite.id, atom.id, appEntity.id, 1);
            value.val = {
                siteAtomApp,
                ioApp: appEntity.id,
                inKey: appKey,
                inPassword: appPassword,
                outUrl: undefined,
                outKey: undefined,
                outPassword: undefined,
            };
            setAppsChecked([value, ...appsChecked]);
            let index = appsUnchecked.findIndex(v => v === value);
            if (index >= 0) {
                appsUnchecked.splice(index, 1);
                setAppsUnchecked([...appsUnchecked]);
            }
        }
        const { id, caption, name } = appEntity;
        return <div key={id} className="border-bottom d-flex px-3 py-2">
            <div className="flex-fill">
                <div>{caption ?? name}</div>
            </div>
            <div>
                <ButtonAsync className="btn btn-sm btn-link" onClick={onConnect}>连接</ButtonAsync>
            </div>
        </div>;
    }
    return <Page header="外连接口">
        <div className="tonwa-bg-gray-1">
            <TopItem label="外连类型"><span>{caption ?? name}</span></TopItem>
            <TopItem label={tie.caption ?? tie.name}><ViewAtom value={atom} /></TopItem>
        </div>
        <div className="mt-3">
            <div className="tonwa-bg-gray-1 small px-3 pt-2 pb-1 text-secondary border-bottom">已连App</div>
            {
                appsChecked.length > 0 ?
                    appsChecked.map(v => <ViewAppChecked key={v.entity.id} value={v} />)
                    :
                    < div className="small px-3 py-2 text-warning">[无连接]</div>
            }
        </div>
        {
            appsUnchecked.length > 0 &&
            <div className="mt-3">
                <div className="tonwa-bg-gray-1 small px-3 pt-2 pb-1 text-secondary border-bottom">待连App</div>
                {appsUnchecked.map(v => <ViewAppUnchecked key={v.entity.id} value={v} />)}
            </div>
        }
    </Page >;
}
