import { Link } from "react-router-dom";
import { IDView, Page } from "tonwa-app";
import { pathAtomCenter } from "./Atom/AtomCenter";
import { pathReportCenter } from "./Report/ReportCenter";
import { pathPrice } from "./AssignPrice";
import { useUqApp } from "app/UqApp";
import { pathMy } from "./My";
import { pathSheetCenter } from "./Sheet";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewNotifyCount } from "app/tool";
import { pathActSetting } from "./Permits";
import { FA } from "tonwa-com";
import { ViewSite } from "../Site";

const arr: { label: string; icon?: string; iconColor?: string; path: string; phrase?: BizPhraseType }[] = [
    { label: '单据中心', icon: 'file-o', path: pathSheetCenter, phrase: BizPhraseType.sheet },
    { label: '档案中心', path: pathAtomCenter },
    { label: '报表中心', path: pathReportCenter },
    { label: '设置价格', path: pathPrice },
    { label: '我的', icon: 'user-o', path: pathMy },
    { label: '操作设置', icon: 'cog', iconColor: 'text-info', path: pathActSetting },
];

export function TabJXC() {
    const uqApp = useUqApp();
    const { uq, uqSites } = uqApp;
    let { mySites, userSite } = uqSites;
    const cn = ' px-4 py-3 border-bottom align-items-center';
    return <Page header="同花" back="none">
        <div className="px-3 py-2 border-bottom small tonwa-bg-gray-1 text-center">
            <IDView uq={uq} id={userSite.site} Template={ViewSite} />
        </div>
        {arr.map((v, index) => {
            const { label, icon, iconColor, path, phrase } = v;
            function onClick() {
                uqApp.clearNotifyCount(phrase);
            }
            return <Link key={index} to={path} className={cn} onClick={onClick}>
                <FA name={icon ?? 'file'} className={(iconColor ?? 'text-primary') + " me-4"} fixWidth={true} size="lg" />
                {label}
                <ViewNotifyCount phrase={phrase} />
            </Link>
        })}
    </Page>;
}
