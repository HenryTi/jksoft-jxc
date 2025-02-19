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

    function ViewSheetType({ value }: { value: EntitySheet; }) {
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
        return <Link
            to={`/sheet/${to62(entityId)}`}
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

    function ViewItemFlow({ value }: { value: EntityFlow; }) {
        const { caption, sheets } = value;
        return <div>
            <div>{caption}</div>
            <div className="">
                <List items={sheets} ViewItem={ViewSheetType} className={undefined} sep={null} />
            </div>
        </div>;
    }

    const cnList = ' my-1 row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 ';
    return <Page header={<ViewCurSiteHeader caption={centers.editing.caption} />}>
        <List items={flows} ViewItem={ViewItemFlow} className={cnList} sep={null} />
    </Page>;
}

export function routeFlowCenter() {
    return <>
        <Route path={centers.flow.path} element={<PageFlowCenter />} />
    </>;
}
