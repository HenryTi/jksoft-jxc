import { UqApp, useUqApp } from "app/UqApp";
import { BI } from "app/coms";
import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { EntitySheet } from "app/Biz";
import { List, to62 } from "tonwa-com";
import { PageSheetEdit } from "app/hooks";
// import { PageSheetEdit } from "./PageSheetEdit";

function PageSheetCenter() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const sheetEntities = biz.sheetEntities();
    function ViewSheetItem({ value }: { value: EntitySheet; }) {
        let { caption, name, entityId } = value;
        return <Link
            to={`/sheet/${to62(entityId)}`}
        >
            <div className="px-3 py-2 align-items-center d-flex">
                <BI name="card-list" className="fs-larger me-3 text-primary" />
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>
    }
    return <Page header="单据中心">
        <List items={sheetEntities} ViewItem={ViewSheetItem} />
    </Page>;
}


export const pathSheetCenter = 'sheet-center';
export function routeSheetCenter(uqApp: UqApp) {
    return <>
        <Route path={pathSheetCenter} element={<PageSheetCenter />} />
        <Route path={'sheet/:sheet/:id'} element={<PageSheetEdit />} />
        <Route path={'sheet/:sheet'} element={<PageSheetEdit />} />
    </>;
}
