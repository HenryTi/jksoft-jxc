import { useUqApp } from "app";
import { EntityIOApp, EntityIOSite, IOAppID } from "app/Biz";
import { ButtonRightAdd, PageQueryMore } from "app/coms";
import { LabelRowEdit, ViewAtom, useSelectAtom } from "app/hooks";
import { AtomPhrase, UseQueryOptions } from "app/tool";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";
import { CheckAsync, FA, Sep, wait } from "tonwa-com";
import { PageAtomMap } from "./PageAtomMap";

interface IOApp {
    ioApp: number;
    appUrl: string;
    appKey: string;
}

const cnRowCols = ' row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 ';
const cnItem = ' p-3 cursor-pointer border rounded-2 bg-white ';
export function PageSiteAtoms({ ioSite }: { ioSite: EntityIOSite; }) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { caption, name, tie, apps } = ioSite;
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
    const { uq } = useUqApp();
    const modal = useModal();
    const { caption, name, tie, apps } = ioSite;
    const { data } = useQuery([], async () => {
        let { ret } = await uq.GetIOAtomApps.query({ ioSite: ioSite.id, atom: atom.id });
        const coll: { [app: number]: IOApp } = {};
        for (let r of ret) {
            coll[r.ioApp] = r;
        }
        return coll;
    }, UseQueryOptions);

    function ViewApp({ appEntity, appVal: initAppVal }: { appEntity: EntityIOApp; appVal: IOApp; }) {
        const [appVal, setAppVal] = useState(initAppVal);
        async function onCheckChanged(name: string, checked: boolean) {
            await uq.SetIOSiteAtomApp.submit({
                ioSite: ioSite.id,
                atom: atom.id,
                ioApp: appEntity.id,
                valid: checked === true ? 1 : 0,
            });
            if (checked === true) {
                setAppVal({ ioApp: appEntity.id, ...appVal });
            }
            else {
                setAppVal(undefined);
            }
        }
        async function onEdit() {
            let ret = await modal.open(<PageApp ioSite={ioSite} atom={atom} appEntity={appEntity} appVal={appVal} />);
        }
        const { id, caption, name } = appEntity;
        let vContent: any, vRight: any, cnContent: string, onContentClick: () => void;
        if (appVal !== undefined) {
            vContent = <div className="pt-2 small">url:- <br />key:-</div>;
            vRight = <FA name="pencil" className="px-3 py-2 text-info" />;
            cnContent = ' cursor-pointer ';
            onContentClick = onEdit;
        }
        const vCheck = <CheckAsync className="d-flex" onCheckChanged={onCheckChanged} defaultChecked={appVal !== undefined}> </CheckAsync>;
        return <div key={id} className="border-bottom d-flex">
            <div className="ps-3 py-2">
                {vCheck}
            </div>
            <div className={'py-2 flex-fill d-flex ' + cnContent} onClick={onContentClick}>
                <div className="flex-fill">
                    <div>{caption ?? name}</div>
                    {vContent}
                </div>
                {vRight}
            </div>
        </div>;
    }
    return <Page header="外连接口">
        <div className="tonwa-bg-gray-1">
            <TopItem label="外连类型"><span>{caption ?? name}</span></TopItem>
            <TopItem label={tie.caption ?? tie.name}><ViewAtom value={atom} /></TopItem>
        </div>
        <div className="">
            {apps.map(v => <ViewApp key={v.id} appEntity={v} appVal={data[v.id]} />)}
        </div>
    </Page>;
}

function PageApp({ atom, ioSite, appEntity, appVal }: { atom: AtomPhrase; ioSite: EntityIOSite; appEntity: EntityIOApp; appVal: IOApp; }) {
    const modal = useModal();
    const { caption, name, tie } = ioSite;
    const { IDs, ins, outs } = appEntity;
    const labelSize = 1;
    async function onEditClick() {
    }
    function HeaderIO({ label }: { label: string }) {
        return <>
            <div className="mt-2 mb-1 ps-3 text-secondary small">{label}</div>
            <Sep />
        </>;
    }
    function ViewIO({ value }: { value: any; }) {
        async function onOutClick() {
        }
        const label = <span>{value.name}</span>;
        return <>
            <LabelRowEdit label={label} labelSize={labelSize}
                onEditClick={onOutClick} required={false} error={undefined}>
                {JSON.stringify(value)}
            </LabelRowEdit>
            <Sep />
        </>;
    }
    function ViewIn({ value }: { value: any }) {
        return <ViewIO value={value} />;
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
            {appVal.appKey}
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
    </Page>;
}
