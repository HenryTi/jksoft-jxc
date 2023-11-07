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

export function TabJXC() {
    const uqApp = useUqApp();
    const { uq, uqSites } = uqApp;
    let { userSite } = uqSites;
    const cn = ' px-4 py-3 border-bottom align-items-center';
    return <Page header="同花" back="none">
        <div className="px-3 py-2 border-bottom small tonwa-bg-gray-1 text-center">
            <IDView uq={uq} id={userSite.site} Template={ViewSite} />
        </div>
        {arr.map((v, index) => {
            const { center: { caption, icon, iconColor, path }, phrase } = v;
            function onClick() {
                uqApp.clearNotifyCount(phrase);
            }
            return <Link key={index} to={path} className={cn} onClick={onClick}>
                <FA name={icon ?? 'file'} className={(iconColor ?? 'text-primary') + " me-4"} fixWidth={true} size="lg" />
                {caption}
                <ViewNotifyCount phrase={phrase} />
            </Link>
        })}
    </Page>;
}
