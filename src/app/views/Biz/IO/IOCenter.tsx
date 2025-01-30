import { useUqApp } from "app";
import { EntityIOSite } from "tonwa";
import { centers } from "app/views/center";
import { Link, Route } from "react-router-dom";
import { FA, LMR, List } from "tonwa-com";
import { PageIODef, PageIOList, pathDef } from "./IODef";
import { Page, useModal } from "tonwa-app";
import { PageSiteAtoms } from "./PageSiteAtoms";
import { useQuery } from "@tanstack/react-query";
import { ViewCurSiteHeader } from "app/views/Site";

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

// 数据接口
function PageIOCenter() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const modal = useModal();
    const { data } = useQuery({
        queryKey: ['GetIOErrorCounts'],
        queryFn: async () => {
            let { ret } = await uq.GetIOErrorCounts.query({});
            const coll: { [ioSite: number]: number } = {};
            for (let row of ret) {
                const { ioSite, errorCount, siteAtomApp } = row;
                coll[ioSite] = errorCount;
            }
            return coll;
        }, refetchOnWindowFocus: false
    });
    function ViewIOSite({ value: { id, caption, name } }: { value: EntityIOSite; }) {
        let errorCount = data[id];
        return <LMR className="py-2 align-items-center">
            <div className="position-relative mx-4">
                <FA name="exchange" className="text-primary" fixWidth={true} />
                {
                    errorCount > 0 ?
                        <span className="position-absolute top-0 start-100 translate-middle p-1 text-danger">
                            <FA name="exclamation-circle" />
                        </span>
                        :
                        null
                }
            </div>
            <span>{caption ?? name}</span>
            <FA name="angle-right" className="mx-4" />
        </LMR>;
    }
    function onItemClick(item: EntityIOSite) {
        modal.open(<PageSiteAtoms ioSite={item} />);
    }
    return <Page header={<ViewCurSiteHeader caption={centers.io.caption} />}>
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
