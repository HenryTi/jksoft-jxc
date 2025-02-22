import { ViewNotifyCount } from "app/tool";
import { useUqApp } from "app/UqApp";
import { centers } from "app/views/center";
import { ViewCurSiteHeader } from "app/views/Site";
import { Link, Route } from "react-router-dom";
import { EntityFlow, EntitySheet } from "tonwa";
import { Page } from "tonwa-app";
import { FA, List, to62 } from "tonwa-com";

function PageFlowCenter() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { flows } = biz;
    const { flow } = centers;
    const { caption: pageCaption } = flow;

    function ViewSheetType({ value, index }: { value: EntitySheet; index?: number; }) {
        let { caption, name, id: entityId, coreDetail } = value;
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
        let vArrow: any;
        if (index > 0) {
            vArrow = <div className="mx-2 text-body-tertiary small">
                <FA name="arrow-right" fixWidth={true} />
            </div>;
        }
        return <div className="d-flex align-items-center">
            {vArrow}
            <Link
                to={`/test-mvc-sheet/${to62(entityId)}`} className="flex-fill"
            >
                <div className="px-1 py-2 align-items-center d-flex border border-info rounded-3 my-2">
                    <div className="position-relative">
                        <FA name="file-text" className="my-2 mx-2 text-info" size="lg" />
                        {vNotifyCount}
                    </div>
                    <span className="text-body">{caption ?? name}</span>
                </div>
            </Link>
        </div>
    }

    function ViewItemFlow({ value }: { value: EntityFlow; }) {
        const { caption, sheets, memo } = value;
        return <div>
            <div className="px-3 pt-1 py-1 border-bottom tonwa-bg-gray-2">{caption}</div>
            <div>{memo}</div>
            <div className="mb-3">
                <List items={sheets} ViewItem={ViewSheetType} className={cnList} sep={null} />
            </div>
        </div>;
    }

    const cnList = ' mx-3 my-1 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 g-0 ';
    return <Page header={<ViewCurSiteHeader caption={pageCaption} />}>
        <List items={flows} ViewItem={ViewItemFlow} className={undefined} sep={null} />
    </Page>;
}

export function routeFlowCenter() {
    return <>
        <Route path={centers.flow.path} element={<PageFlowCenter />} />
    </>;
}
