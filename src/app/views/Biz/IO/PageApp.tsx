import { useUqApp } from "app";
import { EntityIOApp, EntityIOSite, IOAppID } from "tonwa";
import { LabelRowEdit, PagePickValue, ViewAtom } from "app/hooks";
import { AtomData } from "app/tool";
import React, { useState } from "react";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { FA, Sep } from "tonwa-com";
import { PageAtomMap } from "./PageAtomMap";
import md5 from "md5";
import { PageIOError } from "./PageIOError";
import { useQuery } from "@tanstack/react-query";

export interface AppVal {
    siteAtomApp: number;
    ioApp: number;
    inKey: string;
    inPassword: string;
    outUrl: string;
    outKey: string;
    outPassword: string;
}
export interface IOApp {
    entity: EntityIOApp;
    val: AppVal;
}

const cnRowCols = ' row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 ';
const cnItem = ' p-3 cursor-pointer border rounded-2 bg-white ';
export function PageApp({ atom, ioSite, ioApp }: { atom: AtomData; ioSite: EntityIOSite; ioApp: IOApp }) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { caption, name, tie } = ioSite;
    let { entity: appEntity, val: appValInit } = ioApp;
    const [appVal, setAppVal] = useState(appValInit);
    // const [hasError, setHasError] = useState(false);
    const { siteAtomApp } = appVal;
    const { IDs, ins, outs } = appEntity;
    const labelSize = 1;

    let { data: hasError } = useQuery({
        queryKey: ['GetIOError'],
        queryFn: async () => {
            const { $page } = await uq.GetIOError.page({ siteAtomApp }, undefined, 1);
            // setHasError($page.length > 0);
            if ($page.length > 0) {
                console.error($page);
            }
            return $page.length > 0;
        }, refetchOnWindowFocus: false
    });

    async function onSetOutValue(label: string, name: string, maxLength: number) {
        let ret = await modal.open(<PagePickValue label={label} type="text" value={(appVal as any)[name]} options={{ maxLength, }} />);
        if (ret === undefined) return;
        let newVal = { ...appVal };
        (newVal as any)[name] = ret;
        await uq.SetIOSiteAtomAppOut.submit({ ...newVal, ioSiteAtomApp: siteAtomApp });
        (ioApp.val as any)[name] = ret;
        setAppVal(newVal);
    }
    async function onSetOutUrl() {
        await onSetOutValue('appUrl', 'outUrl', 200);
    }
    async function onSetOutKey() {
        await onSetOutValue('appKey', 'outKey', 400);
    }
    async function onSetOutPassword() {
        await onSetOutValue('appPassword', 'outPassword', 30);
    }

    function HeaderIO({ label }: { label: string }) {
        return <>
            <div className="mt-2 mb-1 ps-3 text-secondary small">{label}</div>
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
                const str = stamp + JSON.stringify(inData) + appVal.inPassword;
                const token = md5(str);
                let body = {
                    act: 'intest',
                    stamp,
                    appKey: appVal.inKey,
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
        const label = <span>{value.name}</span>;
        return <>
            <LabelRowEdit label={label} labelSize={labelSize}
                onEditClick={null} required={false} error={undefined}>
                <button className="btn btn-sm btn-link" onClick={inTest}>测试</button>
                <small className="ms-3 text-secondary">发送intest给服务器</small>
            </LabelRowEdit>
            <Sep />
        </>;
    }
    function ViewOut({ value }: { value: any }) {
        // const [config, setConfig] = useState(data[value.id]?.config);
        async function onOutClick() {
            alert('nothing to do');
        }
        const label = <span>{value.name}</span>;
        return <>
            <LabelRowEdit label={label} labelSize={labelSize}
                onEditClick={onOutClick} required={false} error={undefined}>
                vConfig = nothing
            </LabelRowEdit>
            <Sep />
        </>;
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
    function onShowError() {
        modal.open(<PageIOError siteAtomApp={siteAtomApp} />);
    }
    let errorLink = hasError !== true ?
        null
        :
        <div className="px-3 py-2 border-top border-bottom mt-3 d-flex align-items-center cursor-pointer" onClick={onShowError}>
            <div className="flex-fill">
                <FA name="exclamation-circle" className="me-3 text-danger" size="lg" />
                连接错误
            </div>
            <FA name="angle-right" />
        </div>;

    return <Page header="IOApp">
        <div className="tonwa-bg-gray-1">
            <TopItem label="外连类型"><span>{caption ?? name}</span></TopItem>
            <TopItem label="外连App"><span>{appEntity.caption ?? appEntity.name}</span></TopItem>
            <TopItem label={tie.caption ?? tie.name}><ViewAtom value={atom} /></TopItem>
        </div>
        <div className="mb-3" />
        <Sep />
        <div>
            <HeaderIO label="入口" />
            <LabelRowEdit label="appKey" labelSize={labelSize} onEditClick={null}
                required={false} error={undefined}>
                {appVal.inKey}  password:{appVal.inPassword}
            </LabelRowEdit>
            <Sep className="border-dark-subtle border-2" />
            <div className="d-none">
                {ins.map((v, index) => <ViewIn key={index} value={v} />)}
            </div>
        </div>
        <div>
            <HeaderIO label="出口" />
            <LabelRowEdit label="url" labelSize={labelSize} onEditClick={onSetOutUrl}
                required={false} error={undefined}>
                {appVal.outUrl}
            </LabelRowEdit>
            <Sep />
            <LabelRowEdit label="appKey" labelSize={labelSize} onEditClick={onSetOutKey}
                required={false} error={undefined}>
                {appVal.outKey}
            </LabelRowEdit>
            <Sep />
            <LabelRowEdit label="appPassword" labelSize={labelSize} onEditClick={onSetOutPassword}
                required={false} error={undefined}>
                {appVal.outPassword}
            </LabelRowEdit>
            <Sep className="border-dark-subtle border-2" />
            {outs.map((v, index) => <ViewOut key={index} value={v} />)}
        </div>
        <div className="tonwa-bg-gray-1 small text-secondary px-3 pt-2 pb-1 border-bottom mt-3">
            对照表
        </div>
        <div className={theme.bootstrapContainer + ' py-3 '}>
            <div className={cnRowCols}>
                {IDs.map(v => <div className="col" key={v.id}>
                    <ViewIOAppID value={v} />
                </div>)}
            </div>
        </div>
        {errorLink}
        <div className="p-3 d-flex">
            <div className="flex-fill" />
            <button className="btn btn-link" onClick={onStopConnect}>删除连接</button>
        </div>
    </Page>;
}

export function TopItem({ label, children }: { label: string; children: React.ReactNode; }) {
    return <div className="p-3 border-bottom d-flex align-items-center">
        <small className="text-secondary me-3">{label}:</small>
        {children}
    </div>
}
