import * as jsonpack from 'jsonpack';
import { useUqApp } from "app/UqApp";
import { useRef, useState } from "react";
import { Route } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import codeTxt from '/uq-app/index.ts.txt';
import { PageUpload } from './PageUpload';

function PageCompile() {
    const uqApp = useUqApp();
    const { openModal } = useModal();
    const [source, setSource] = useState<object>();
    async function test() {
        setSource({});
        let { uqApi } = uqApp.uqMan;
        const code = await (await fetch(codeTxt)).text();
        let { schemas, logs } = await uqApi.compileOverride(code);
        // let { schemas, logs } = await uqApi.compileOverride(biz);
        // setText();
        setSource({
            logs,
            schemas: jsonpack.unpack(schemas),
        });
    }
    function onUpload() {
        openModal(<PageUpload />);
    }
    return <Page header={captionCompile}>
        <div className="p-3">
            <button className="btn btn-primary" onClick={onUpload}>上传代码</button>
        </div>
    </Page>;
}

export const pathCompile = "compile";
export const captionCompile = '业务设计';
export const routeCompile = <Route path={`${pathCompile}`} element={<PageCompile />}></Route>;
