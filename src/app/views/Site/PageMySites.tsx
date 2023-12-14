import { useUqApp } from "app/UqApp";
import { IDView, Page } from "tonwa-app";
import { FA, LMR, Sep } from "tonwa-com";
import { Permit } from "./Permit";
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

        function ViewCurSite({ value }: { value: Atom; }) {
            let { no, ex } = value;
            return <div className="d-flex align-items-end">
                <b className="fs-larger me-3">{ex ?? '(无名机构)'}</b>
                <div className="text-secondary">{no}</div>
            </div>;
        }
        return <div className="px-3 py-3 d-flex align-items-end">
            <FA name="university" size="lg" className="text-primary me-3 mb-1" />
            <div className="flex-grow-1">
                <div className="small text-secondary">
                    当前机构
                </div>
                <IDView uq={uq} id={siteId} Template={ViewCurSite} />
            </div>
            <Permit permit={[]}>
                <Link to={`/${pathSiteAdmin}/${siteId}`}>
                    管理
                </Link>
            </Permit>
        </div>;
    }

    function ViewSite({ value }: { value: Atom }) {
        let { no, ex } = value;
        return <div className="d-flex align-items-center">
            <FA name="university" fixWidth={true} className={' me-3 text-info '} />
            <span className="me-3">{ex ?? '(无名机构)'}</span>
            <small className="text-secondary">{no}</small>
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
            let content = <LMR className={'p-3 align-items-center  tonwa-bg-gray-1 text-primary '} onClick={onSiteSelect}>
                <FA name="hand-o-right" className="me-3 text-warning" />
                <IDView uq={uq} id={siteId} Template={ViewSite} />
                <div />
            </LMR>;
            return <React.Fragment key={index}>
                {content}
                <Sep />
            </React.Fragment>
        })}
    </>
}
