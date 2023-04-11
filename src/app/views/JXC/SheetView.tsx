import { UqApp, useUqApp } from "app/UqApp";
import { useState } from "react";
import { Link, Route, useParams } from "react-router-dom";
import { IDView, Page, PageSpinner } from "tonwa-app";
import { List, useEffectOnce } from "tonwa-com";
import { EnumID, Sheet } from "uqs/UqDefault";

export const pathSheetView = 'sheet';
export const pathDetailView = 'sheet-detail';

function PageDetailView() {
    const uqApp = useUqApp();
    const uq = uqApp.uqs.UqDefault;
    const { id } = useParams();
    function ViewDetail({ value }: { value: any }) {
        return <div>
            Detail: {JSON.stringify(value)}
        </div>
    }
    function DetailTemplate({ value }: { value: any }) {
        let sheet = value.base;
        return <div>
            <Link to={`../${pathSheetView}/${sheet}`}>
                <div className="px-3 my-3">整单：{sheet}</div>
            </Link>
            <div className="px-3 my-3"><ViewDetail value={value} /></div>
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
    const [sheetMain, setSheetMain] = useState(undefined);
    const [sheetDetails, setSheetDetails] = useState<any[]>(undefined);
    useEffectOnce(() => {
        (async function () {
            let { main: [retSheetMain], details: retDetails } = await uq.GetSheet.query({ id: Number(id), assigns: undefined });
            setSheetMain(retSheetMain);
            setSheetDetails(retDetails);
        })();
    });
    function ViewItem({ value }: { value: any }) {
        return <div className="px-3 my-2">
            {JSON.stringify(value)}
        </div>;
    }
    let content: any;
    if (!sheetMain || !sheetDetails) {
        content = <PageSpinner />;
    }
    else {
        content = <>
            <div className="px-3 my-2">
                main: {JSON.stringify(sheetMain)}
            </div>
            <List items={sheetDetails} ViewItem={ViewItem} />
        </>;
    }

    return <Page header="整单内容">
        {content}
    </Page>
}

export function DetailRef({ value }: { value: any }) {
    let uqApp = useUqApp();
    let { uq } = uqApp;
    return <>
        <IDView uq={uq} id={value.sheet} Template={SheetRef} />
        &nbsp;
        <small>{value.id}</small>
    </>;
}

export function SheetRef({ value }: { value: any }) {
    const { $entity, no } = value;
    let Template = dirMap[$entity as EnumID];
    return <Template value={value} />;
}

function DirStoreIn({ value }: { value: Sheet; }) {
    return <>
        <span className="text-danger">入库单</span> &nbsp;
        <b>{value.no}</b> &nbsp;
        <small className="text-muted">{value.id}</small> &nbsp;
    </>;
}

function DirStoreOut({ value }: { value: Sheet; }) {
    return <>
        <span className="text-success">出库单</span> &nbsp;
        <b>{value.no}</b> &nbsp;
        <small className="text-muted">{value.id}</small> &nbsp;
    </>;
}

enum SheetType {
    StoreIn,
    StoreOut,
}

const dirMap: { [sheet: string]: (props: { value: any; }) => JSX.Element } = {
    [SheetType.StoreIn]: DirStoreIn,
    [SheetType.StoreOut]: DirStoreOut,
}

function DetailStoreIn({ value }: { value: Sheet; }) {
    return <>入库单 Detail {value.no}</>
}

function DetailStoreOut({ value }: { value: Sheet; }) {
    return <>出库单 Detail {value.no}</>
}

const detailMap: { [entity in SheetType]?: (props: { value: any; }) => JSX.Element } = {
    [SheetType.StoreIn]: DetailStoreIn,
    [SheetType.StoreOut]: DetailStoreOut,
}

function SheetStoreIn({ value }: { value: Sheet; }) {
    return <>入库单 Sheet {value.no}</>
}

function SheetStoreOut({ value }: { value: Sheet; }) {
    return <>出库单 Sheet {value.no}</>
}

const sheetMap: { [entity in SheetType]?: (props: { value: any; }) => JSX.Element } = {
    [SheetType.StoreIn]: SheetStoreIn,
    [SheetType.StoreOut]: SheetStoreOut,
}

export function routeSheetView(uqApp: UqApp) {
    return <>
        <Route path={`${pathDetailView}/:id`} element={<PageDetailView />} />
        <Route path={`${pathSheetView}/:id`} element={<PageSheetView />} />
    </>;
}
