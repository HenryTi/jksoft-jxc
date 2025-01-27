import { Link } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { FA } from "tonwa-com";
import { Permit, ViewSite } from "../Site";
import { ViewConsole } from "./ViewConsole";
import { PageTest } from "../Test";

export function TabHome() {
    const uqApp = useUqApp();
    const modal = useModal();
    const { uq, uqSites, biz: { errorLogs } } = uqApp;
    let { userSite, mySites } = uqSites;
    let vSiteRight: any, vDesign: any;
    if (errorLogs === undefined) {
        vDesign = <Permit>
            <Link to="/biz" className="ms-4">业务脚本</Link>
        </Permit>;
    }
    if (mySites.length > 1 || userSite.isAdmin === true) {
        vSiteRight = <Link to={'../sites'} className="px-4 py-2">
            <FA name="angle-right" className="text-secondary" />
        </Link>;
    }

    function onTest() {
        modal.open(<PageTest />);
    }
    return <Page header="同花" back="none">
        <div className="d-flex border-bottom tonwa-bg-gray-1">
            <div className="ps-5 py-2 flex-grow-1 text-center">
                <FA name="university" className="me-3 text-info" />
                <ViewSite value={userSite} />
                {vDesign}
            </div>
            {vSiteRight}
        </div>
        <ViewConsole />
    </Page>;
}
