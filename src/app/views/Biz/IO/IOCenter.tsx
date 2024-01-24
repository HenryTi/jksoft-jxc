import { useUqApp } from "app";
import { EntityAtom, EntityIOSite } from "app/Biz";
import { centers } from "app/views/center";
import { Link, Route } from "react-router-dom";
import { FA, LMR, List } from "tonwa-com";
import { PageIOOuterNew, PageIOOuterView, pathIOOuter } from "./IOOuter";
import { ViewAtom, useBizAtomList, useSelectAtom } from "app/hooks";
import { ButtonRightAdd, PageQueryMore } from "app/coms";
import { PageIODef, PageIOList, pathDef } from "./IODef";
import { Page, useModal } from "tonwa-app";
import { PageSiteAtoms } from "./PageSiteAtoms";

const pathList = `${centers.io.path}/list`;
const cn = ' d-flex px-4 py-3 border-bottom align-items-center ';
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

function PageIOCenter1() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const modal = useModal();
    const selectAtom = useSelectAtom();
    const folders: FolderLinkProps[] = [
        /*
        {
            caption: '接口机构',
            icon: 'bank',
            iconColor: 'text-primary',
            path: `../${pathIOOuter.list(ioOuter.id)}`,
        },
        {
            caption: '接口App',
            icon: 'database',
            iconColor: 'text-info',
            path: `../${pathIOApp.list(ioApp.id)}`,
        },
        */
        {
            caption: '接口定义',
            icon: 'sign-in',
            iconColor: 'text-success',
            path: `../${pathList}`,
        },
    ];
    const none = <div className='m-3 small text-muted'>[无]</div>;
    function ViewItem({ value: { id, no, ex } }: { value: { id: number; no: string; ex: string; } }) {
        return <div className="px-3 py-2">
            <div>{ex}</div>
            <div className="text-secondary small">{no}</div>
        </div>;
    }
    async function onAdd() {
        function ModalSelectIOSite() {
            function ViewIOSite({ value: { caption, name } }: { value: EntityIOSite; }) {
                return <div className="px-3 py-2">
                    {caption ?? name}
                </div>;
            }
            function onSelect(item: EntityIOSite, isSelected: boolean) {
                modal.close(item);
            }
            return <Page header="选择接口类型">
                <List items={biz.ioSites} ViewItem={ViewIOSite} onItemSelect={onSelect} />
            </Page>;
        }
        let ioSite = await modal.open<EntityIOSite>(< ModalSelectIOSite />);
        if (ioSite === undefined) return;
        let atom = await selectAtom(ioSite.tie);
        if (atom === undefined) return;
        alert(`ioSite:${ioSite.name}, atom: ${atom.ex}`);
    }
    const right = <ButtonRightAdd onClick={onAdd} />;
    return <PageQueryMore header={centers.io.caption}
        query={uq.GetIOAtomApps}
        param={{} as any}
        sortField={'id'}
        ViewItem={ViewItem}
        none={none}
    >
        {folders.map((v, index) => {
            return <FolderLink key={index} {...v} className={cn} onClick={undefined} />;
        })}
        <div className="d-flex mt-3 tonwa-bg-gray-1 ps-3 py-1 small text-secondary align-items-end border-bottom">
            <span>接口机构</span>
            <div className="flex-fill" />
            {right}
        </div>
    </PageQueryMore>;
}
export function routeIOCenter() {
    const n = ':io';
    const atom = ':atom';
    return <>
        <Route path={centers.io.path} element={<PageIOCenter />} />
        <Route path={pathList} element={<PageIOList />} />
        <Route path={pathDef(n)} element={<PageIODef />} />
        <Route path={pathIOOuter.new(atom)} element={<PageIOOuterNew />} />
        <Route path={pathIOOuter.view(atom)} element={<PageIOOuterView />} />
    </>;
}
