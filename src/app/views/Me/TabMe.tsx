import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai/react";
import { Link } from "react-router-dom";
import { FA, LMR, Sep, useT } from "tonwa-com";
import { IDView, Image, Page, PageLoader, PageSpinner, useModal } from "tonwa-app";
import { appT, ResApp } from "../../res";
import { pathEditMe } from "./routeMe";
import { PageRoleAdmin, PageSys } from "app/Site";
import { EnumSysRole } from "tonwa-uq";
import { Permit } from "app/Site";
import React from "react";

const pathAbout = 'about';

export function TabMe() {
    const t = useT(appT);
    const uqApp = useUqApp();
    const { openModal, closeModal } = useModal();
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
    function RoleAdmin() {
        async function onAdminChanged() {

        }
        async function onRoleAdmin() {
            //let siteRole = new GenSiteRole(uqApp, uqSites, uqSites.userSite);
            // openModal(<PageSpinner />);
            //await siteRole.init();
            // closeModal();
            openModal(
                <PageRoleAdmin
                    admin={EnumSysRole.owner}
                    // onAdminChanged={onAdminChanged}
                    viewTop={<></>}
                // siteRole={siteRole}
                />
            );
        }
        return <Permit permit={[]}>
            <Cmd onClick={onRoleAdmin} content="角色管理" />
            <Sep />
        </Permit>;
    }
    function SysAdmin() {
        let { userSite0 } = uqSites;
        if (userSite0 === undefined) return null;
        async function onSitesAdmin() {
            // let siteRole = new GenSiteRole(uqApp, uqSites, userSite0);
            // openModal(<PageSpinner />);
            // await siteRole.init();
            // closeModal();
            openModal(<PageSys
            // siteRole={siteRole} 
            />);
        }
        return <>
            <Cmd onClick={onSitesAdmin} content="系统管理" icon="database" iconColor="text-warning" />
            <Sep />
        </>;
    }
    function SelectSite() {
        let { mySites, userSite } = uqSites;
        function ViewSite({ value }: { value: any; }) {
            let { ex, no } = value;
            return <>{ex ?? '默认机构'} <small className="text-muted">{no}</small></>;
        }
        return <>
            {mySites.map((v, index) => {
                let { siteId: unitId } = v;
                let isCurrent = (userSite?.siteId === unitId);
                let cn = '', icon: string, iconColor: string, color: string;
                if (isCurrent === true) {
                    icon = 'check-circle-o';
                    color = '';
                    iconColor = ' text-success ';
                }
                else {
                    cn = ' cursor-pointer ';
                    icon = 'angle-right';
                    color = ' text-primary ';
                    iconColor = '';
                }
                async function onSiteSelect() {
                    if (isCurrent === true) return;
                    await uqApp.uqSites.setSite(unitId);
                    document.location.reload();
                }
                return <React.Fragment key={index}>
                    <div className={'p-3 ' + cn + color} onClick={onSiteSelect}>
                        <FA name={icon} fixWidth={true} className={' me-3 ' + iconColor} size="lg" />
                        <IDView uq={uq} id={unitId} Template={ViewSite} />
                    </div>
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
            <RoleAdmin />
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
