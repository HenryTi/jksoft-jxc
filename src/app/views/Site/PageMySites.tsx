import { useUqApp } from "app/UqApp";
import { IDView, Page, useModal } from "tonwa-app";
import { FA, LMR, Sep } from "tonwa-com";
import { Permit, ViewSite, isPermitted } from ".";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { pathSiteAdmin } from "../Admin/site";
import { UserSite } from "tonwa-uq";
import { Atom } from "uqs/UqDefault";

export function PageMySites() {
    return <Page header="我的机构">
        <ViewMySites />
    </Page>;
}

function ViewMySites() {
    const uqApp = useUqApp();
    const { uq, uqSites } = uqApp;
    const navigate = useNavigate();

    let { mySites, userSite } = uqSites;

    let curSite: UserSite<any>;
    let sites: UserSite<any>[] = [];
    for (let site of mySites) {
        let { siteId } = site;
        if (userSite?.siteId === siteId) {
            curSite = site;
        }
        else {
            sites.push(site);
        }
    }
    function CurSite() {
        if (!curSite) return null;
        const { siteId } = curSite;
        let icon: string, iconColor: string, color: string;
        icon = 'check-circle-o';
        color = '';
        iconColor = ' text-success ';

        function ViewSite({ value }: { value: Atom; }) {
            let { no, ex } = value;
            return <div>
                <div className=""><b>{ex ?? '(无名机构)'}</b></div>
                <div className="small text-secondary">{no}</div>
            </div>;
        }
        return <div className="px-5 py-3">
            <div className="small text-secondary">当前机构</div>
            <div className="my-2">
                <IDView uq={uq} id={siteId} Template={ViewSite} />
            </div>
            <Permit permit={[]}>
                <Link to={`/${pathSiteAdmin}/${siteId}`}>
                    管理
                </Link>
            </Permit>
        </div>;
    }

    return <>
        <CurSite />
        <Sep />
        {sites.map((v, index) => {
            let { siteId } = v;
            async function onSiteSelect() {
                await uqApp.uqSites.setSite(siteId);
                navigate('../');
                document.location.reload();
            }
            let content = <LMR className={'p-3 align-items-center  tonwa-bg-gray-1  text-primary '} onClick={onSiteSelect}>
                <FA name="building-o" fixWidth={true} className={' me-3 text-warning '} size="lg" />
                <IDView uq={uq} id={siteId} Template={ViewSite} />
                <div />
            </LMR>;
            /*
            <Permit permit={[]}>
            <div>
                管理 <i className="bi-chevron-right" />
            </div>
            </Permit>
    if (isPermitted(uqApp, []) === true) {
                content = <Link to={`/${pathSiteAdmin}/${siteId}`}>
                    {content}
                </Link>
            }
            */
            return <React.Fragment key={index}>
                {content}
                <Sep />
            </React.Fragment>
        })}
    </>
}
