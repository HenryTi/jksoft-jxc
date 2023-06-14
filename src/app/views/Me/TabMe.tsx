import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai/react";
import { Link } from "react-router-dom";
import { FA, LMR, Sep, useT } from "tonwa-com";
import { IDView, Image, Page, useModal } from "tonwa-app";
import { appT, ResApp } from "../../res";
import { pathEditMe } from "./routeMe";
import { PageRoleAdmin, PageSitesAdmin } from "app/Site";
import { EnumSysRole } from "tonwa-uq";
import { Permit } from "app/Site";
import React from "react";

const pathAbout = 'about';

export function TabMe() {
    const t = useT(appT);
    const uqApp = useUqApp();
    const { openModal } = useModal();
    const { uq, user: atomUser, uqUnit } = uqApp;
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
    function Cmd({ onClick, content }: { onClick: () => void, content: any }) {
        return <LMR className="p-3 cursor-pointer align-items-center" onClick={onClick}>
            <FA name="cog" fixWidth={true} className="me-3 text-primary" size="lg" />
            {content}
            <FA name="angle-right" />
        </LMR>;
    }
    function RoleAdmin() {
        async function onAdminChanged() {

        }
        function onRoleAdmin() {
            openModal(<PageRoleAdmin admin={EnumSysRole.owner} onAdminChanged={onAdminChanged} viewTop={<></>} />)
        }
        return <Permit>
            <Cmd onClick={onRoleAdmin} content="角色管理" />
            <Sep />
        </Permit>;
    }
    function SitesAdmin() {
        let { userUnit0 } = uqUnit;
        if (userUnit0 === undefined) return null;
        function onSitesAdmin() {
            openModal(<PageSitesAdmin />);
        }
        return <>
            <Cmd onClick={onSitesAdmin} content="机构管理" />
            <Sep />
        </>;
    }
    function SelectSite() {
        let { mySites, userUnit } = uqUnit;
        function ViewSite({ value }: { value: any; }) {
            let { ex, no } = value;
            return <>{ex ?? '默认机构'} <small className="text-muted">{no}</small></>;
        }
        return <>
            {mySites.map((v, index) => {
                let { unitId } = v;
                let isCurrent = (userUnit?.unitId === unitId);
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
                    await uqApp.uqUnit.setSite(unitId);
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
            <SelectSite />
            <RoleAdmin />
            <SitesAdmin />
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
