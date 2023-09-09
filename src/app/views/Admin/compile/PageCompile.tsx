import * as jsonpack from 'jsonpack';
import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { ButtonAsync, wait } from "tonwa-com";

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
    const [source, setSource] = useState<object>();
    async function test() {
        setSource({});
        let { uqApi } = uqApp.uqMan;

        let { schemas, logs } = await uqApi.compileOverride(biz1);
        // let ret = await uqApi.compileAppend(biz1);

        setSource({
            logs,
            schemas: jsonpack.unpack(schemas),
        });
    }

    return <Page header="Compile">
        <div className="p-3">
            <pre>{JSON.stringify(source, null, 4)}</pre>
            <ButtonAsync className="btn btn-primary" onClick={test}>test</ButtonAsync>
        </div>
    </Page>;
}

export const pathCompile = "compile";
export const captionCompile = 'Compile';
export const routeCompile = <Route path={`${pathCompile}`} element={<PageCompile />}></Route>;
