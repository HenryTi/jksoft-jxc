import { useUqApp } from "app";
import { EntityIOSite } from "app/Biz";
import { centers } from "app/views/center";
import { Link, Route } from "react-router-dom";
import { FA, LMR, List } from "tonwa-com";
import { PageIODef, PageIOList, pathDef } from "./IODef";
import { Page, useModal } from "tonwa-app";
import { PageSiteAtoms } from "./PageSiteAtoms";

const pathList = `${centers.io.path}/list`;
const fs = ' ';
const iconSize = '';
interface FolderLinkProps {
    icon: string;
    iconColor: string;
    caption: string;
    path: string;
    className?: string;
    onClick?: () => void;
}
function FolderLink({ path, className, icon, iconColor, onClick, caption }: FolderLinkProps) {
    return <Link to={path} className={className} onClick={onClick}>
        <FA name={icon ?? 'file'} className={(iconColor ?? 'text-primary') + " me-4"} fixWidth={true} size={iconSize} />
        <span className={fs}>{caption}</span>
        <div className="flex-grow-1"></div>
        <FA name="angle-right" className="text-secondary" />
    </Link>
}

function PageIOCenter() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const modal = useModal();
    function ViewIOSite({ value: { caption, name } }: { value: EntityIOSite; }) {
        return <LMR className="py-2 align-items-center">
            <FA name="exchange" className="mx-4 text-primary" />
            <span>{caption ?? name}</span>
            <FA name="angle-right" className="mx-4" />
        </LMR>;
    }
    function onItemClick(item: EntityIOSite) {
        modal.open(<PageSiteAtoms ioSite={item} />);
    }
    return <Page header={centers.io.caption}>
        <List items={biz.ioSites} ViewItem={ViewIOSite} onItemClick={onItemClick} />
    </Page>;
}

export function routeIOCenter() {
    const n = ':io';
    return <>
        <Route path={centers.io.path} element={<PageIOCenter />} />
        <Route path={pathList} element={<PageIOList />} />
        <Route path={pathDef(n)} element={<PageIODef />} />
    </>;
}
