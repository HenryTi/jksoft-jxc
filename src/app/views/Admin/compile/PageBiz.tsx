import { useRef, useState } from "react";
import { Route } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { PageUpload } from './PageUpload';
import { useUqApp } from "app/UqApp";
import { Entity } from "app/Biz";
import { PageEntity } from "./PageEntity";
import { FA } from "tonwa-com";
import { useAtomValue } from "jotai";

function PageBiz() {
    const { right, view } = buildViewBiz();
    return <Page header={captionCompile} right={right}>
        {view}
    </Page>;
}

export function buildViewBiz() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { openModal } = useModal();
    const refresh = useAtomValue(biz._refresh);

    const fileInput = useRef<HTMLInputElement>();
    function onUploaded(content: string) {
        openModal(<PageUpload content={content} />);
    }
    function onSelectFiles() {
        fileInput.current.click();
    }
    async function onFilesChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let { files } = evt.target;
        await load(files[0]);
        fileInput.current.value = '';
    }
    async function load(file: File) {
        return new Promise<void>((resolve) => {
            // textAreaRef.current.textContent = '';
            let fr = new FileReader();
            fr.readAsText(file);
            fr.onloadend = async function (evt: ProgressEvent<FileReader>) {
                resolve();
                //setText(evt.target.result as string);
                // textAreaRef.current.textContent = evt.target.result as string;
                onUploaded(evt.target.result as string);
            }
        });
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
            className="px-2 py-2 border border-secondary shadow-sm mx-2 my-2 rounded h-min-5c w-16c w-max-16c cursor-pointer link-primary bg-white d-flex"
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
        return <div className="d-flex flex-wrap p-2">
            {content}
        </div>;
    }
    return {
        right: <button className="btn btn-primary btn-sm me-1" onClick={onSelectFiles}>上传业务</button>,
        view: <div className="">
            <div className="tonwa-bg-gray-1">
                {biz.all.map((v, index) => {
                    const [entitys, caption, icon] = v;
                    if (caption === undefined) return null;
                    return <div key={index} className="mx-2 my-3 border border-dark-subtle">
                        <div className="px-3 pt-1 pb-1 border-bottom tonwa-bg-gray-2 text-secondary">{caption}</div>
                        <ViewEntitys entitys={entitys} icon={icon} />
                    </div>
                })}
            </div>
            <div>
                <input ref={fileInput}
                    type="file"
                    className="w-100 form-control-file d-none"
                    name="files" multiple={false}
                    onChange={onFilesChange} />
            </div>
        </div>,
    };
}

export const pathCompile = "compile";
export const captionCompile = '业务设计';
export const routeCompile = <Route path={`${pathCompile}`} element={<PageBiz />}></Route>;
