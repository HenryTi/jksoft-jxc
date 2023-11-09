import { Link } from "react-router-dom";
import { IDView, Page } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewNotifyCount } from "app/tool";
import { FA } from "tonwa-com";
import { ViewSite } from "../Site";
import { Center, centers } from "../pathes";

const arr: { center: Center; phrase?: BizPhraseType }[] = [
    { center: centers.sheet, phrase: BizPhraseType.sheet },
    { center: centers.atom },
    { center: centers.report },
    { center: centers.assign },
    { center: centers.tie },
    { center: centers.me },
    { center: centers.setting },
];

export function TabHome() {
    const uqApp = useUqApp();
    const { uq, uqSites } = uqApp;
    let { userSite } = uqSites;
    const cn = 'd-flex px-4 py-3 border-bottom align-items-center';
    return <Page header="同花" back="none">
        <div className="d-flex border-bottom tonwa-bg-gray-1">
            <div className="ps-5 py-2 flex-grow-1 text-center">
                <IDView uq={uq} id={userSite.site} Template={ViewSite} />
            </div>
            <Link to={'../sites'} className="px-4 py-2">
                <FA name="angle-right" className="text-secondary" />
            </Link>
        </div>
        {arr.map((v, index) => {
            const { center: { caption, icon, iconColor, path }, phrase } = v;
            function onClick() {
                uqApp.clearNotifyCount(phrase);
            }
            return <Link key={index} to={path} className={cn} onClick={onClick}>
                <FA name={icon ?? 'file'} className={(iconColor ?? 'text-primary') + " me-4"} fixWidth={true} size="2x" />
                <span className="fs-larger">{caption}</span>
                <ViewNotifyCount phrase={phrase} />
                <div className="flex-grow-1"></div>
                <FA name="angle-right" className="text-secondary" />
            </Link>
        })}
    </Page>;
}
