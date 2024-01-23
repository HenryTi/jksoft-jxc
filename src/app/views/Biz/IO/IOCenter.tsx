import { useUqApp } from "app";
import { EntityAtom } from "app/Biz";
import { centers } from "app/views/center";
import { Link, Route } from "react-router-dom";
import { FA } from "tonwa-com";
import { PageIOOuterNew, PageIOOuterView, pathIOOuter } from "./IOOuter";
import { ViewAtom, useBizAtomList } from "app/hooks";
import { PageQueryMore } from "app/coms";
import { PageIODef, PageIOList, pathDef } from "./IODef";

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
    const { biz } = uqApp;
    const { entities } = biz;
    let ioOuter = entities['$ioouter'];
    // obsolete
    let ioApp = entities['$ioapp'];
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
    // const uqApp = useUqApp();
    // const { biz } = uqApp;
    // const { entities } = biz;
    // let ioOuter = entities['$ioouter'] as EntityAtom;
    let optionsList = {
        atomName: 'atom' as any,
        NOLabel: undefined as any,
        exLabel: undefined as any,
        ViewItemAtom: ViewAtom,
        pathAtomNew: pathIOOuter.new,
        pathAtomView: pathIOOuter.view,
        entityAtom: ioOuter as EntityAtom,
        // top,
        header: centers.io.caption,
    };
    const none = <div className='m-3 small text-muted'>[无{ioOuter.caption ?? ioOuter.name}]</div>;
    let { query, right, param, sortField, ViewItem, } = useBizAtomList(optionsList);
    return <PageQueryMore header={centers.io.caption}
        query={query}
        param={param}
        sortField={sortField}
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
    //let { page } = useBizAtomList(optionsList);
    //  return page;
    // return <PageIOOuterList top={top} header={centers.io.caption} />;
    /*
    return <Page header={centers.io.caption}>
        {folders.map((v, index) => {
            return <FolderLink key={index} {...v} className={cn} onClick={undefined} />;
        })}
    </Page>;
    */
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
    // <Route path={pathIOOuter.list(atom)} element={<PageIOOuterList />} />
    // <Route path={pathIOApp.list(atom)} element={<PageIOAppList />} />
    // <Route path={pathIOApp.new(atom)} element={<PageIOAppNew />} />
    // <Route path={pathIOApp.view(atom)} element={<PageIOAppView />} />
}
