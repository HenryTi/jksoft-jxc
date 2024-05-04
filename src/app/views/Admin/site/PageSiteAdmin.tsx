import { useUqApp } from "app/UqApp";
import { IDView, Page, useModal } from "tonwa-app";
import { LMR, Sep } from "tonwa-com";
import { PageSiteInit, captionSiteInit } from "./siteInit";
import { EnumSysRole } from "tonwa-uq";
import { PageSiteRole } from "./PageSiteRole";
import { Link, Route, useParams } from "react-router-dom";
import { ViewSite } from "app/views/Site";
import { BI } from "app/coms";
import { centers } from "app/views/center";

function PageSiteAdmin() {
    const { uq, uqSites } = useUqApp();
    const { openModal } = useModal();
    const { site } = useParams();
    const { users, achieve, compile } = centers;
    function Cmd({ onClick, content, icon, iconColor }: { onClick?: () => void; content: any; icon?: string; iconColor?: string }) {
        return <LMR className="px-3 py-2 align-items-center" onClick={onClick}>
            <BI name={icon ?? 'cog'} className={' fs-x-large me-3 my-1 ' + (iconColor ?? ' text-primary ')} />
            {content}
            <BI name="chevron-right" />
        </LMR>;
    }
    function SiteInit() {
        let { userSite0 } = uqSites;
        if (userSite0 === undefined) return null;
        async function onSitesAdmin() {
            openModal(<PageSiteInit />);
        }
        return <>
            <Cmd onClick={onSitesAdmin} content={captionSiteInit} icon="laptop" iconColor="text-warning" />
            <Sep />
        </>;
    }
    function SiteRoleAdmin() {
        async function onAdminChanged() {

        }
        async function onRoleAdmin() {
            openModal(
                <PageSiteRole
                    admin={EnumSysRole.owner}
                    viewTop={<></>}
                />
            );
        }
        return <>
            <Cmd onClick={onRoleAdmin} content="机构角色" icon="person-fill-gear" />
            <Sep />
        </>;
    }
    const cmds = [
        { label: achieve.caption, path: achieve.path },
        { label: users.caption, path: users.path },
        { label: compile.caption, path: compile.path },
    ];
    //{ label: <CaptionAtom atom={EnumAtom.UomI} />, path: pathAtomList(gUomI.name) },
    return <Page header={<IDView uq={uq} id={Number(site)} Template={ViewSite} />}>
        <SiteRoleAdmin />
        {cmds.map((v, index) => {
            const { label, path } = v;
            return <Link key={index} to={`../${path}`} className="border-bottom">
                <Cmd icon="caret-right-fill" content={label} iconColor="text-info" />
            </Link>
        })}
        <SiteInit />
    </Page >;
}

export const pathSiteAdmin = "site-admin";
export const routeSiteAdmin = <Route path={`${pathSiteAdmin}/:site`} element={<PageSiteAdmin />}></Route>;