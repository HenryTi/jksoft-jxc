import { useUqApp } from "app";
import { EntityIOApp, EntityIOSite } from "app/Biz";
import { ButtonRightAdd, PageQueryMore } from "app/coms";
import { LabelRowEdit, ViewAtom, useSelectAtom } from "app/hooks";
import { AtomPhrase, UseQueryOptions } from "app/tool";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";
import { CheckAsync, FA, Sep, wait } from "tonwa-com";

interface IOApp {
    ioApp: number;
    appUrl: string;
    appKey: string;
}

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
            let ret = await modal.open(<PageEditApp ioSite={ioSite} atom={atom} appEntity={appEntity} appVal={appVal} />);
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
    return <Page header="设置接口App">
        <div className="tonwa-bg-gray-1">
            <TopItem label="外联类型"><span>{caption ?? name}</span></TopItem>
            <TopItem label={tie.caption ?? tie.name}><ViewAtom value={atom} /></TopItem>
        </div>
        <div className="">
            {apps.map(v => <ViewApp key={v.id} appEntity={v} appVal={data[v.id]} />)}
        </div>
    </Page>;
}

function PageEditApp({ atom, ioSite, appEntity, appVal }: { atom: AtomPhrase; ioSite: EntityIOSite; appEntity: EntityIOApp; appVal: IOApp; }) {
    const { caption, name, tie } = ioSite;
    const { ins, outs } = appEntity;
    const labelSize = 1;
    async function onEditClick() {
    }
    return <Page header="编辑App">
        <div className="tonwa-bg-gray-1">
            <TopItem label="外连类型"><span>{caption ?? name}</span></TopItem>
            <TopItem label={tie.caption ?? tie.name}><ViewAtom value={atom} /></TopItem>
            <TopItem label="外连App"><span>{appEntity.caption ?? appEntity.name}</span></TopItem>
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
        <div className="mt-4">
            <div className="small text-secondary px-3 pb-1 pt-2 border-bottom tonwa-bg-gray-1">入口</div>
            {ins.map((v, index) => <div key={index} className="px-3 py-2 border-bottom">{JSON.stringify(v)}</div>)}
        </div>
        <div className="mt-4">
            <div className="small text-secondary px-3 pb-1 pt-2 px-3 border-bottom tonwa-bg-gray-1">出口</div>
            {outs.map((v, index) => <div key={index} className="px-3 py-2 border-bottom">{JSON.stringify(v)}</div>)}
        </div>
    </Page>;
}
