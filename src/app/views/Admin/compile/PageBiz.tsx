import React, { MouseEvent, MouseEventHandler, useRef, useState } from "react";
import { Route } from "react-router-dom";
import { IDView, Page, useModal } from "tonwa-app";
import { PageCode } from './PageCode';
import { useUqApp } from "app/UqApp";
import { BizGroup, Entity, EntityQuery } from "app/Biz";
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
    const modal = useModal();
    const { compile } = centers;
    const { uq, uqSites } = uqApp;
    let { userSite } = uqSites;
    useAtomValue(biz.atomSchemasChanged);

    function onCode() {
        modal.open(<PageCode />);
    }
    function onEntity(entity: Entity) {
        modal.open(<PageEntity entity={entity} />);
    }
    function ViewEntityItem({ value, icon, onEntity }: { value: Entity; icon: string; onEntity: (entity: Entity) => void; }) {
        let { id, caption, name } = value;
        let vCaption: any;
        if (caption === undefined || caption === name) {
            vCaption = <>&nbsp;</>;
        }
        else {
            vCaption = caption;
        }
        // <FA name={icon} className="mt-1 me-2 text-success" />
        // className="px-2 py-2 border border-secondary-subtle shadow-sm mx-2 my-1 rounded cursor-pointer link-primary bg-white d-flex"
        const cnLink = 'link-offset-2 link-offset-3-hover link-underline link-underline-opacity-75-hover';

        function onClick(evt: MouseEvent) {
            onEntity(value);
            evt.preventDefault();
        }
        return <div key={id} className="col my-1">
            <a
                className={cnLink}
                href="#"
                onClick={onClick}>
                <div className="py-1 rounded-3 px-2 bg-white">
                    <div>{name}</div>
                    <div className="small text-secondary">{vCaption}</div>
                </div>
            </a>
        </div>
    }
    function ViewEntitys({ entitys, icon, onEntity }: { entitys: Entity[]; icon: string; onEntity: (entity: Entity) => void }) {
        let content: any;
        if (entitys.length === 0) {
            content = <div className="m-1 text-secondary small">无</div>
        }
        else {
            content = entitys.flatMap((v, index) => {
                const { name, id } = v;
                if (name[0] === '$') {
                    if (name !== '$console') return null
                }
                return <ViewEntityItem key={id} value={v} icon={icon} onEntity={onEntity} />;
            })
        }
        return <div className={' ps-3 py-1 ' + theme.bootstrapContainer}>
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
            await uqApi.source('/' + name);
        }
        return <div className="">
            {
                hasEntity === true &&
                <div className="tonwa-bg-gray-3 px-3 pb-2 pt-2 d-flex border-top">
                    <b className="flex-grow-1">{groupCaption}</b>
                    <a className="" href="#" onClick={onDownload}><FA name="download" /></a>
                </div>
            }
            <ViewEntitiesGroup entities={entities} />
        </div>;
    }
    function ViewEntitiesGroup({ entities }: { entities: [Entity[], string?, string?, string?][] }) {
        return <div className="">{entities.map((v, index) => {
            let [arr, caption, icon] = v;
            if (caption === undefined) return null;
            if (arr.length === 0) return null;
            let top: any;
            if (entities.length > 1) {
                top = <div className="pe-3 py-1 tonwa-bg-gray-1 border-bottom">
                    <FA name={icon} className="mx-2 text-success" />
                    {caption}
                </div>;
            }
            return <div key={index} className="border-top">
                {top}
                <ViewEntitys entitys={arr} icon={icon} onEntity={onEntity} />
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
            <div className="">{
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
