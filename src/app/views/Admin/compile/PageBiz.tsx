import React, { MouseEvent, useRef, useState } from "react";
import { Route } from "react-router-dom";
import { IDView, Page, useModal } from "tonwa-app";
import { PageUpload } from './PageUpload';
import { useUqApp } from "app/UqApp";
import { Entity } from "app/Biz";
import { PageEntity } from "./PageEntity";
import { FA } from "tonwa-com";
import { useAtomValue } from "jotai";
import { centers } from "app/views/pathes";
import { ViewSite } from "app/views/Site";

function PageBiz() {
    const { header, right, view } = useBuildViewBiz();
    return <Page header={header} right={right}>
        {view}
    </Page>;
}

export function useBuildViewBiz() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { openModal } = useModal();
    const refresh = useAtomValue(biz._refresh);
    const { compile } = centers;
    const { uq, uqSites } = uqApp;
    let { userSite } = uqSites;

    function onInputCode() {
        openModal(<PageUpload />);
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
        return <div key={id}
            className="px-2 py-2 border border-secondary-subtle shadow-sm mx-2 my-1 rounded h-min-3c w-16c w-max-16c cursor-pointer link-primary bg-white d-flex"
            onClick={onEntity}>
            <FA name={icon} className="mt-1 me-2 text-success" />
            {content}
        </div>

    }
    function ViewEntitys({ entitys, icon }: { entitys: Entity[]; icon: string; }) {
        let content: any;
        if (entitys.length === 0) {
            content = <div className="m-1 text-secondary small">无</div>
        }
        else {
            content = entitys.map((v, index) => {
                return <ViewEntityItem key={v.id} value={v} icon={icon} />
            })
        }
        return <div className="d-flex flex-wrap px-2 py-1">
            {content}
        </div>;
    }
    return {
        header: <>
            {compile.caption} -
            <IDView uq={uq} id={userSite.site} Template={ViewSite} />
        </>,
        right: <button className="btn btn-primary btn-sm me-1" onClick={onInputCode}>上传业务</button>,
        view: <div className="">
            <div className="tonwa-bg-gray-1">
                {
                    biz.all.map((group, index) => {
                        let { name, caption: groupCaption, entities } = group;
                        async function onDownload(evt: MouseEvent<HTMLAnchorElement>) {
                            evt.preventDefault();
                            const { uqMan } = uqApp;
                            let { uqApi } = uqMan;
                            await uqApi.source(name);
                        }
                        return <div key={index} className="mb-4">
                            <div className="bg-info-subtle bg-gradient px-3 pb-2 pt-2 small d-flex">
                                <b className="flex-grow-1">{groupCaption}</b>
                                <a className="" href="#" onClick={onDownload}>下载代码</a>
                            </div>
                            {
                                entities.map((v, index) => {
                                    let [arr, caption, icon] = v;
                                    if (caption === undefined) return null;
                                    if (arr.length === 0) return null;
                                    let top: any;
                                    if (entities.length > 1) {
                                        top = <div className="px-3 pt-1 pb-1 border-bottom small">{caption}</div>;
                                    }
                                    return <div key={index} className="">
                                        {top}
                                        <ViewEntitys entitys={arr} icon={icon} />
                                    </div>
                                })
                            }
                        </div>;
                    })
                }
            </div>
        </div>,
    };
}

export const routeCompile = <Route path={`${centers.compile.path}`} element={<PageBiz />}></Route>;
