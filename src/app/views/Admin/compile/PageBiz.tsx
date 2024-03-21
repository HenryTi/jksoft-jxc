import React, { MouseEvent, useRef, useState } from "react";
import { Route } from "react-router-dom";
import { IDView, Page, useModal } from "tonwa-app";
import { PageCode } from './PageCode';
import { useUqApp } from "app/UqApp";
import { BizGroup, Entity } from "app/Biz";
import { PageEntity } from "./PageEntity";
import { FA, theme } from "tonwa-com";
import { useAtomValue } from "jotai";
import { centers } from "app/views/center";
import { ViewSite } from "app/views/Site";

function PageBiz() {
    const { header, right, view } = useBuildViewBiz();
    return <Page header={header} right={right}>
        {view}
    </Page>;
}

const rowCols = ' gx-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 ';
export function useBuildViewBiz() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { openModal } = useModal();
    const refresh = useAtomValue(biz._refresh);
    const { compile } = centers;
    const { uq, uqSites } = uqApp;
    let { userSite } = uqSites;

    function onCode() {
        openModal(<PageCode />);
    }
    function ViewEntityItem({ value, icon }: { value: Entity; icon: string; }) {
        const { id, caption, name } = value;
        function onEntity() {
            openModal(<PageEntity entity={value} />);
        }
        let content: any;
        if (caption === undefined || caption === name) {
            content = <div>{name}</div>;
        }
        else {
            content = <div>
                <div className="small text-secondary">{name}</div>
                <div>{caption}</div>
            </div>
        }
        return <div key={id} className="col">
            <div
                className="px-2 py-2 border border-secondary-subtle shadow-sm mx-2 my-1 rounded cursor-pointer link-primary bg-white d-flex"
                onClick={onEntity}>
                <FA name={icon} className="mt-1 me-2 text-success" />
                {content}
            </div>
        </div>
    }
    function ViewEntitys({ entitys, icon }: { entitys: Entity[]; icon: string; }) {
        let content: any;
        if (entitys.length === 0) {
            content = <div className="m-1 text-secondary small">无</div>
        }
        else {
            content = entitys.flatMap((v, index) => {
                const { name, id } = v;
                if (name[0] === '$') return [];
                return [<ViewEntityItem key={id} value={v} icon={icon} />];
            })
        }
        return <div className={' bg-white py-2 ' + theme.bootstrapContainer}>
            <div className={rowCols}>
                {content}
            </div>
        </div>;
    }
    function ViewGroup({ group }: { group: BizGroup }) {
        let { name, caption: groupCaption, entities, hasEntity } = group;
        async function onDownload(evt: MouseEvent<HTMLAnchorElement>) {
            evt.preventDefault();
            const { uqMan } = uqApp;
            let { uqApi } = uqMan;
            await uqApi.source(name);
        }
        return <div className="mb-4">
            {
                hasEntity === true &&
                <div className="tonwa-bg-gray-2 px-3 pb-2 pt-2 small d-flex">
                    <b className="flex-grow-1">{groupCaption}</b>
                    <a className="" href="#" onClick={onDownload}><FA name="download" /></a>
                </div>
            }
            <ViewEntitiesGroup entities={entities} />
        </div>;
    }
    function ViewEntitiesGroup({ entities }: { entities: [Entity[], string?, string?, string?][] }) {
        return <div>{entities.map((v, index) => {
            let [arr, caption, icon] = v;
            if (caption === undefined) return null;
            if (arr.length === 0) return null;
            let top: any;
            if (entities.length > 1) {
                top = <div className="px-3 pt-1 pb-1 border-bottom small">{caption}</div>;
            }
            return <div key={index}>
                {top}
                <ViewEntitys entitys={arr} icon={icon} />
            </div>
        })}
        </div>;
    }
    return {
        header: <>
            {compile.caption} -
            <IDView uq={uq} id={userSite.site} Template={ViewSite} />
        </>,
        right: <button className="btn btn-primary btn-sm me-1" onClick={onCode}>
            <FA name="bars" />
        </button>,
        view: <div className="">
            <div className="tonwa-bg-gray-1">{
                biz.hasEntity === false ?
                    <div className="small text-secondary p-3">
                        <FA name="hand-paper-o" className="me-3 text-info" />暂无代码
                    </div>
                    :
                    biz.groups.map((group, index) => <ViewGroup key={index} group={group} />)
            }</div>
        </div>,
    };
}

export const routeCompile = <Route path={`${centers.compile.path}`} element={<PageBiz />}></Route>;
