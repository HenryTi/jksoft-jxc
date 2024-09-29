import { useUqApp } from "app/UqApp";
import { BI } from "app/coms";
import { Link, Route } from "react-router-dom";
import { Page, PageSpinner, useModal } from "tonwa-app";
import { EntitySheet } from "app/Biz";
import { List, to62 } from "tonwa-com";
import { RouteSheetDash, RouteSheetEdit, RouteSheetNew } from "app/hooks";
import { useState } from "react";
import { ViewNotifyCount } from "app/tool";
import { centers } from "app/views/center";

function PageSheetCenter1() {
    console.log('PageSheetCenter');
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const sheetEntities = biz.sheets;
    const [visible, setVisible] = useState(true);
    function ViewSheetType({ value }: { value: EntitySheet; }) {
        let { caption, name, id: entityId, coreDetail } = value;
        let pendEntityId: number;
        let vNotifyCount: any;
        if (coreDetail !== undefined) {
            pendEntityId = coreDetail.pend?.id;
            if (pendEntityId !== undefined) {
                vNotifyCount = <div className="position-absolute" style={{ left: '2.5rem', top: '0rem' }}>
                    <ViewNotifyCount phrase={pendEntityId} />
                </div>;
            }
        }
        return <Link
            to={`/${sheet}/${to62(entityId)}`}
        >
            <div className="px-4 py-2 align-items-center d-flex position-relative">
                <BI name="card-list" className="fs-larger me-4 text-primary" />
                {vNotifyCount}
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>
    }
    const cnList = ' row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-6 ';
    return visible === false ?
        <PageSpinner />
        :
        <Page header={centers.sheet.caption}
        >
            <List items={sheetEntities} ViewItem={ViewSheetType} className={cnList} sep={null} />
        </Page>;
}


const sheet = 'sheet';

export function pathSheet(phrase: number | string) {
    function sheetInPath(phrase: number | string) {
        if (typeof phrase === 'string') {
            if (phrase !== ':sheet') debugger;
            return phrase;
        }
        return to62(phrase);
    }
    return `${sheet}/${sheetInPath(phrase)}`;
}

export function routeSheetCenter() {
    // <Route path={centers.sheet.path} element={<PageSheetCenter />} />
    return <>
        <Route path={`${sheet}/:sheet/:id`} element={<RouteSheetEdit />} />
        <Route path={`${sheet}/:sheet`} element={<RouteSheetDash />} />
        <Route path={`${sheet}/:sheet`} element={<RouteSheetNew />} />
    </>;
}
