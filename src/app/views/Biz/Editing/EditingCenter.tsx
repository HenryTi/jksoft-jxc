import { useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Page, PageSpinner } from "tonwa-app";
import { EntitySheet } from "tonwa";
import { FA, List, SearchBox, to62 } from "tonwa-com";
import { useState } from "react";
import { ViewNotifyCount } from "app/tool";
import { centers } from "app/views/center";
import { PageSearch } from "./PageSearch";
import { ViewCurSiteHeader } from "app/views/Site";

// 操作中心
function PageEditingCenter() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { editing } = centers;
    const { caption: pageCaption } = editing;
    const [visible] = useState(true);
    const [searchKey, setSearchKey] = useState(undefined);
    const sheetEntities: EntitySheet[] = [];
    for (let sheet of biz.sheets) {
        let { caption, name } = sheet;
        if (searchKey !== undefined && (
            name.includes(searchKey) === false
            || caption.includes(searchKey) === false
        )) {
            continue;
        }
        sheetEntities.push(sheet);
    }
    function ViewSheetType({ value }: { value: EntitySheet; }) {
        let { caption, name, id: entityId, coreDetail } = value;
        if (searchKey !== undefined && (
            name.includes(searchKey) === false
            || caption.includes(searchKey) === false
        )) {
            return null;
        }
        let pendEntityId: number;
        let vNotifyCount: any;
        if (coreDetail !== undefined) {
            pendEntityId = coreDetail.pend?.id;
            if (pendEntityId !== undefined) {
                vNotifyCount = <div className="position-absolute" style={{ right: "-0.3rem", top: "-0.5rem" }}>
                    <div className="ms-3">
                        <ViewNotifyCount phrase={pendEntityId} />
                    </div>
                </div>;
            }
        }
        return <Link
            to={`/test-mvc-sheet/${to62(entityId)}`}
        >
            <div className="px-1 py-2 align-items-center d-flex border border-info rounded-3 my-2">
                <div className="position-relative">
                    <FA name="file-text" className="my-2 mx-2 text-info" size="lg" />
                    {vNotifyCount}
                </div>
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>
    }
    async function onInputChange(key: string) {
        setSearchKey(key);
    }
    const cnList = ' my-1 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 ';
    return visible === false ?
        <PageSpinner />
        :
        <Page header={<ViewCurSiteHeader caption={pageCaption} />}>
            <SearchBox className="px-3 py-1" placeholder="名称" onSearch={undefined} onChange={onInputChange} />
            <List items={sheetEntities} ViewItem={ViewSheetType} className={cnList} sep={null} />
        </Page>;
}

export function routeEditingCenter() {
    return <>
        <Route path={centers.editing.path} element={<PageEditingCenter />} />
        <Route path={'sheet/search'} element={<PageSearch />} />
    </>;
}
