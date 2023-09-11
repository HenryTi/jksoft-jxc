import * as jsonpack from 'jsonpack';
import { useUqApp } from "app/UqApp";
import { useRef, useState } from "react";
import { Route } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { ButtonAsync, EasyDate, LMR, List, Sep, wait } from "tonwa-com";
import codeTxt from '/uq-app/index.ts.txt';
import { PageUpload } from './PageUpload';

const biz = `
ATOM B '试验' {
    Prop a ATOM x;
    Prop a1 int;
    Prop a2 dec;
};

ATOM X '试验x'
{
    Prop a ATOM b;
    PROP x1 int;
    PROP x2 dec;
};

`;

const biz1 = `
ATOM C '试验c' -- 试验c说明
{
    Prop a ATOM B;
    Prop a1 int;
    Prop a2 dec;
};

ATOM Y '试验y' {
    Prop a ATOM x;
    PROP x1 int; -- 试验y.x1 说明
    PROP x3 dec;
};
`;


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
    return <Page header="Compile">
        <div className="p-3">
            <button className="btn btn-primary" onClick={onUpload}>上传代码</button>
        </div>
        <div className="p-3">
            <pre>{JSON.stringify(source, null, 4)}</pre>
            <ButtonAsync className="btn btn-primary" onClick={test}>test</ButtonAsync>
        </div>
    </Page>;
}

export const pathCompile = "compile";
export const captionCompile = 'Compile';
export const routeCompile = <Route path={`${pathCompile}`} element={<PageCompile />}></Route>;
