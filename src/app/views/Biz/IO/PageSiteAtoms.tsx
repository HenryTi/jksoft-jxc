import { useUqApp } from "app";
import { EntityIOApp, EntityIOSite, IOAppID } from "app/Biz";
import { ButtonRightAdd, PageQueryMore } from "app/coms";
import { LabelRowEdit, ViewAtom, useSelectAtom } from "app/hooks";
import { AtomPhrase, UseQueryOptions } from "app/tool";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { ButtonAsync, FA, Sep } from "tonwa-com";
import { PageAtomMap } from "./PageAtomMap";
import { ReturnGetIOAtomAppsRet, ReturnGetIOEndPointConfigsRet } from "uqs/UqDefault";
import md5 from "md5";

interface AppVal {
    siteAtomApp: number;
    ioApp: number;
    appUrl: string;
    appKey: string;
    appPassword: string;
}
interface IOApp {
    entity: EntityIOApp;
    val: AppVal;
}

const cnRowCols = ' row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 ';
const cnItem = ' p-3 cursor-pointer border rounded-2 bg-white ';
export function PageSiteAtoms({ ioSite }: { ioSite: EntityIOSite; }) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { caption, name, tie } = ioSite;
    const selectAtom = useSelectAtom();
    const none = <div className='m-3 small text-muted'>[无]</div>;
    function ViewItem({ value: { id, no, ex } }: { value: { id: number; no: string; ex: string; } }) {
        return <div className="px-3 py-2">
            <div>{ex}</div>
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

function TopItem({ label, children }: { label: string; children: React.ReactNode; }) {
    return <div className="p-3 border-bottom d-flex align-items-center">
        <small className="text-secondary me-3">{label}:</small>
        {children}
    </div>
}

function PageSetApp({ atom, ioSite }: { atom: AtomPhrase; ioSite: EntityIOSite; }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const modal = useModal();
    const { caption, name, tie, apps } = ioSite;
    const { data } = useQuery(['GetIOAtomApps'], async () => {
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
    }, UseQueryOptions);

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
                <div className="pt-2 small text-secondary">appKey:{appVal.appKey}</div>
            </div>
            <FA name="angle-right" className="px-3 py-2 text-info" />
        </div>;
    }
    function ViewAppUnchecked({ value }: { value: IOApp; }) {
        const { entity: appEntity } = value;
        async function onConnect() {
            const { uqMan } = uqApp;
            let { uqApi } = uqMan;
            let { siteAtomApp } = await uqApi.appKey(ioSite.id, atom.id, appEntity.id, 1);
            value.val = {
                siteAtomApp,
                ioApp: appEntity.id,
                appUrl: undefined,
                appKey: undefined,
                appPassword: undefined,
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

function PageApp({ atom, ioSite, ioApp }: { atom: AtomPhrase; ioSite: EntityIOSite; ioApp: IOApp }) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { caption, name, tie } = ioSite;
    let { entity: appEntity, val: appVal } = ioApp;
    const { siteAtomApp } = appVal;
    const { IDs, ins, outs } = appEntity;
    const { data } = useQuery(['GetIOEndPointConfigs'], async () => {
        const coll: { [appIO: number]: ReturnGetIOEndPointConfigsRet } = {};
        let ret = await uq.GetIOEndPointConfigs.query({ siteAtomApp });
        for (let row of ret.ret) {
            coll[row.appIO] = row;
        }
        return coll;
    }, UseQueryOptions);
    const labelSize = 1;
    async function onEditClick() {
    }
    function HeaderIO({ label }: { label: string }) {
        return <>
            <div className="mt-2 mb-1 ps-3 text-secondary small">{label}</div>
            <Sep />
        </>;
    }
    function ViewIO({ value, inTest }: { value: any; inTest?: () => Promise<void> }) {
        const [config, setConfig] = useState(data[value.id]?.config);
        async function onOutClick() {
            let newConfig = { "a": 1 }
            await uq.SetIOEndPointConfig.submit({ siteAtomApp, appIO: value.id, config: JSON.stringify(newConfig) });
            setConfig(newConfig);
        }
        const label = <span>{value.name}</span>;
        let vConfig: any;
        if (config === undefined) {
            vConfig = <>无设置</>;
        }
        else {
            vConfig = <>{JSON.stringify(config)}</>;
        }
        return <>
            <LabelRowEdit label={label} labelSize={labelSize}
                onEditClick={onOutClick} required={false} error={undefined}>
                <div>{JSON.stringify(value)}</div>
                <div>
                    {vConfig}
                    <button className="btn btn-sm btn-link" onClick={inTest}>测试</button>
                </div>
            </LabelRowEdit>
            <Sep />
        </>;
    }
    function ViewIn({ value }: { value: any }) {
        async function inTest() {
            try {
                const inData = {
                    a: 1,
                    b: 2.0,
                    c: '2024-1-30',
                    d: 'ddd',
                    arr: [
                        {
                            d1: 1,
                            d2: 2.3,
                            d3: '2024-1-28',
                            d4: 'b8b8',
                        }
                    ]
                };
                const stamp = Date.now();
                const str = stamp + JSON.stringify(inData) + appVal.appPassword;
                const token = md5(str);
                let body = {
                    act: 'intest',
                    stamp,
                    appKey: appVal.appKey,
                    uiq: undefined as any,
                    token,
                    data: inData,
                };
                let url = 'http://localhost:3015/api';
                // let url = 'https://jiekeapp.cn/api';
                let ret = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
                let retText = await ret.json();
                alert(JSON.stringify(retText));
            }
            catch (err) {
                console.error(err);
                debugger;
            }
        }
        return <ViewIO value={value} inTest={inTest} />;
    }
    function ViewOut({ value }: { value: any }) {
        return <ViewIO value={value} />;
    }
    function ViewIOAppID({ value }: { value: IOAppID }) {
        const { name, caption, atoms } = value;
        const header = <>{atoms.map(v => <span key={v.id}>{v.caption ?? v.name}</span>)} :: {caption ?? name}</>;
        function onAtom() {
            modal.open(<PageAtomMap header={header} ioSite={ioSite} ioApp={appEntity} atom={atom} ioAppID={value} />);
        }
        return <div className={cnItem} onClick={onAtom}>
            {header}
        </div>
    }

    async function onStopConnect() {
        let ret = await modal.open(<PageConfirm header="确认" message={'删除连接会导致数据接口停止工作'} yes="确认删除" no="不删除" />);
        if (ret === true) {
            modal.close(false);
        }
    }
    return <Page header="App">
        <div className="tonwa-bg-gray-1">
            <TopItem label="外连类型"><span>{caption ?? name}</span></TopItem>
            <TopItem label="外连App"><span>{appEntity.caption ?? appEntity.name}</span></TopItem>
            <TopItem label={tie.caption ?? tie.name}><ViewAtom value={atom} /></TopItem>
        </div>
        <div className="mb-3" />
        <Sep />
        <LabelRowEdit label="appUrl" labelSize={labelSize} onEditClick={onEditClick}
            required={false} error={undefined}>
            {appVal.appUrl}
        </LabelRowEdit>
        <Sep />
        <LabelRowEdit label="appKey" labelSize={labelSize} onEditClick={onEditClick}
            required={false} error={undefined}>
            {appVal.appKey}  password:{appVal.appPassword}
        </LabelRowEdit>
        <Sep />
        <div>
            <HeaderIO label="入口" />
            {ins.map((v, index) => <ViewIn key={index} value={v} />)}
        </div>
        <div>
            <HeaderIO label="出口" />
            {outs.map((v, index) => <ViewOut key={index} value={v} />)}
        </div>
        <div className="tonwa-bg-gray-1 small text-secondary px-3 pt-2 pb-1 border-bottom mt-3">
            对照表
        </div>
        <div className="container py-3">
            <div className={cnRowCols}>
                {IDs.map(v => <div className="col" key={v.id}>
                    <ViewIOAppID value={v} />
                </div>)}
            </div>
        </div>
        <div className="p-3 d-flex">
            <div className="flex-fill" />
            <button className="btn btn-link" onClick={onStopConnect}>取消连接</button>
        </div>
    </Page>;
}
