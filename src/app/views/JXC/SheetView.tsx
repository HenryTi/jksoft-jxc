import { UqApp, useUqApp } from "app/UqApp";
import { Band } from "app/coms";
import { useState } from "react";
import { Link, Route, useParams } from "react-router-dom";
import { IDView, Page, PageSpinner } from "tonwa-app";
import { LMR, List, useEffectOnce } from "tonwa-com";
import { Bin, Sheet } from "uqs/UqDefault";
import { ViewAtom } from "app/hooks";

export const pathSheetView = 'sheet';
export const pathDetailView = 'sheet-detail';

function PageDetailView() {
    const uqApp = useUqApp();
    const uq = uqApp.uqs.UqDefault;
    const { id } = useParams();
    function ViewDetail({ value: row }: { value: Bin }) {
        let { i, value } = row;
        return <LMR className="px-3 py-2">
            <IDView uq={uq} id={i} Template={ViewAtom} />
            <div>{value}</div>
        </LMR>
    }
    function DetailTemplate({ value }: { value: any }) {
        let sheet = value.base;
        return <div>
            <Link to={`../${pathSheetView}/${sheet}`}>
                <div className="px-3 py-3 tonwa-bg-gray-3">整单：{sheet}</div>
            </Link>
            <div className=""><ViewDetail value={value} /></div>
        </div>;
    }
    return <Page header="单据明细">
        <IDView uq={uq} id={Number(id)} Template={DetailTemplate} />
    </Page>
}

function PageSheetView() {
    const uqApp = useUqApp();
    const uq = uqApp.uqs.UqDefault;
    const { id } = useParams();
    const [sheetMain, setSheetMain] = useState<Sheet & Bin>(undefined);
    const [sheetDetails, setSheetDetails] = useState<any[]>(undefined);
    useEffectOnce(() => {
        (async function () {
            let { main: [retSheetMain], details: retDetails } = await uq.GetSheet.query({ id: Number(id) });
            setSheetMain(retSheetMain);
            setSheetDetails(retDetails);
        })();
    });
    function ViewDetail({ value: row }: { value: Bin }) {
        let { i, value } = row;
        return <LMR className="px-3 py-2">
            <IDView uq={uq} id={i} Template={ViewAtom} />
            <div>{value}</div>
        </LMR>
    }
    let content: any;
    if (!sheetMain || !sheetDetails) {
        content = <PageSpinner />;
    }
    else {
        let { no, i } = sheetMain;
        content = <>
            <div className="pt-3 tonwa-bg-gray-3 container">
                <Band label={'编号'}>
                    {no}
                </Band>
                <Band label={'对象'}>
                    <IDView uq={uq} id={i} Template={ViewAtom} />
                </Band>
            </div>
            <List items={sheetDetails} ViewItem={ViewDetail} />
        </>;
    }

    return <Page header="整单内容">
        {content}
    </Page>
}

export function routeSheetView(uqApp: UqApp) {
    return <>
        <Route path={`${pathDetailView}/:id`} element={<PageDetailView />} />
        <Route path={`${pathSheetView}/:id`} element={<PageSheetView />} />
    </>;
}
