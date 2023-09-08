import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { ButtonAsync, wait } from "tonwa-com";

const biz = `
ATOM B '试验' {
    Prop a ATOM x;
};

ATOM X '试验x' {
    Prop a ATOM b;
};

`;

function PageCompile() {
    const uqApp = useUqApp();
    const [source, setSource] = useState<object>();
    async function test() {
        setSource({});
        let { uqApi } = uqApp.uqMan;

        let ret = await uqApi.compileSource(biz);
        setSource(ret);
    }

    return <Page header="Compile">
        <div className="p-3">
            <div>{JSON.stringify(source)}</div>
            <ButtonAsync className="btn btn-primary" onClick={test}>test</ButtonAsync>
        </div>
    </Page>;
}

export const pathCompile = "compile";
export const captionCompile = 'Compile';
export const routeCompile = <Route path={`${pathCompile}`} element={<PageCompile />}></Route>;
