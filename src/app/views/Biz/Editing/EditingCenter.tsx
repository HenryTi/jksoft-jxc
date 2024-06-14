import { useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Page, PageSpinner } from "tonwa-app";
import { EntitySheet } from "app/Biz";
import { FA, List, to62 } from "tonwa-com";
import { useState } from "react";
import { ViewNotifyCount } from "app/tool";
import { centers } from "app/views/center";
import { PageSearch } from "./PageSearch";

function PageEditingCenter() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const sheetEntities = biz.sheets;
    const [visible] = useState(true);
    function ViewSheetType({ value }: { value: EntitySheet; }) {
        let { caption, name, id: entityId, coreDetail } = value;
        let pendEntityId: number;
        let vNotifyCount: any;
        if (coreDetail !== undefined) {
            pendEntityId = coreDetail.pend?.id;
            if (pendEntityId !== undefined) {
                vNotifyCount = <div className="position-absolute" style={{ right: "0.3rem", top: "-0.5rem" }}>
                    <div className="ms-3">
                        <ViewNotifyCount phrase={pendEntityId} />
                    </div>
                </div>;
            }
        }
        return <Link
            to={`/sheet/${to62(entityId)}`}
        >
            <div className="px-1 py-2 align-items-center d-flex">
                <div className="position-relative">
                    <FA name="file-text" className="my-2 mx-4 text-primary" size="lg" />
                    {vNotifyCount}
                </div>
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>
    }
    return visible === false ?
        <PageSpinner />
        :
        <Page header={centers.editing.caption}
        >
            <List items={sheetEntities} ViewItem={ViewSheetType} />
        </Page>;
}

export function routeEditingCenter() {
    return <>
        <Route path={centers.editing.path} element={<PageEditingCenter />} />
        <Route path={'sheet/search'} element={<PageSearch />} />
    </>;
}
