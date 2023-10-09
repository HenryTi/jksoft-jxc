import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai/react";
import { Link } from "react-router-dom";
import { FA, LMR, Sep, useT } from "tonwa-com";
import { IDView, Image, Page, useModal } from "tonwa-app";
import { appT, ResApp } from "../../res";
import { pathEditMe } from "./routeMe";
import { PageSys, Permit, ViewSite, isPermitted } from "../Site";
import React from "react";
import { pathSiteAdmin } from "../Admin/site";
import { useQuery } from "react-query";
import { UseQueryOptions } from "app/tool";

const pathAbout = 'about';

export function TabMe() {
    const t = useT(appT);
    const uqApp = useUqApp();
    const { openModal } = useModal();
    const { uq, user: atomUser, uqSites } = uqApp;
    const user = useAtomValue(atomUser);

    function MeInfo() {
        if (!user) return null;
        let { id, name, nick, icon } = user;
        return <Link to={pathEditMe}>
            <LMR className="py-3 px-3 w-100">
                <Image className="w-3c h-3c me-3" src={icon || '.user-o'} />
                <div>
                    <div>{userSpan(name, nick)}</div>
                    <div className="small"><span className="text-muted">ID:</span> {id > 10000 ? id : String(id + 10000).substring(1)}</div>
                </div>
                <FA className="align-self-end" name="angle-right" />
            </LMR>
        </Link>;
    }
    function Cmd({ onClick, content, icon, iconColor }: { onClick: () => void; content: any; icon?: string; iconColor?: string }) {
        return <LMR className="p-3 cursor-pointer align-items-center" onClick={onClick}>
            <FA name={icon ?? 'cog'} fixWidth={true} className={' me-3 ' + (iconColor ?? ' text-primary ')} size="lg" />
            {content}
            <FA name="angle-right" />
        </LMR>;
    }
    function SysAdmin() {
        const { uq } = useUqApp();
        const { data: adminIsMe } = useQuery(['adminIsMe'], async () => await uq.AdminIsMe(), UseQueryOptions);
        if (adminIsMe === false) return null;
        let { userSite0 } = uqSites;
        if (userSite0 === undefined) return null;
        async function onSitesAdmin() {
            openModal(<PageSys />);
        }
        return <>
            <Cmd onClick={onSitesAdmin} content="系统管理" icon="database" iconColor="text-warning" />
            <Sep />
        </>;
    }
    function SelectSite() {
        let { mySites, userSite } = uqSites;
        return <>
            {mySites.map((v, index) => {
                let { siteId } = v;
                let isCurrent = (userSite?.siteId === siteId);
                let icon: string, iconColor: string, color: string, onClick: () => void;
                if (isCurrent === true) {
                    icon = 'check-circle-o';
                    color = '';
                    iconColor = ' text-success ';
                }
                else {
                    icon = 'angle-right';
                    color = ' text-primary ';
                    iconColor = '';
                    onClick = onSiteSelect;
                }
                let content = <LMR className={'p-3 align-items-center ' + color} onClick={onClick}>
                    <FA name={icon} fixWidth={true} className={' me-3 ' + iconColor} size="lg" />
                    <IDView uq={uq} id={siteId} Template={ViewSite} />
                    <Permit permit={[]}>
                        <div>
                            管理 <i className="bi-chevron-right" />
                        </div>
                    </Permit>
                </LMR>;
                async function onSiteSelect() {
                    if (isCurrent === true) return;
                    await uqApp.uqSites.setSite(siteId);
                    document.location.reload();
                }
                /*
                function onSiteAdmin() {
                    // nav
                    openModal(<PageSiteAdmin site={siteId} />);
                }
                */
                if (isPermitted(uqApp, []) === true) {
                    content = <Link to={`/${pathSiteAdmin}/${siteId}`}>
                        {content}
                    </Link>
                }
                return <React.Fragment key={index}>
                    {content}
                    <Sep />
                </React.Fragment>
            })}
        </>
    }

    function AboutLink() {
        return <Link to={pathAbout}>
            <LMR className="w-100 py-3 px-3 align-items-center">
                <FA className="text-info me-3" name="smile-o" fixWidth={true} size="lg" />
                <b className="">{t(ResApp.aboutTheApp)} <small>{t(ResApp.version)} {uqApp.version}</small></b>
                <FA className="align-self-center" name="angle-right" />
            </LMR>
        </Link>;
    }
    const pageMe = <Page header={t(ResApp.me)} back="none">
        <div>
            <MeInfo />
            <Sep />
            <SysAdmin />
            <SelectSite />
            <AboutLink />
            <Sep />
        </div>
    </Page>;
    return pageMe;
}

function userSpan(name: string, nick: string): JSX.Element {
    return nick ?
        <><b>{nick} &nbsp; <small className="muted">{name}</small></b></>
        : <b>{name}</b>
}
