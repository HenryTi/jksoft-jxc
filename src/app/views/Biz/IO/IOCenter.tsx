import { useUqApp } from "app";
import { BizBud, BudArr, Entity, EnumBudType } from "app/Biz";
import { EntityIn, EntityOut } from "app/Biz/EntityInOut";
import { centers } from "app/views/center";
import { Link, Route, useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { FA, LMR, List, Sep, from62, to62 } from "tonwa-com";
import { PageIOOuterList, PageIOOuterNew, PageIOOuterView, pathIOOuter } from "./IOOuter";
import { PageIOAppList, PageIOAppNew, PageIOAppView, pathIOApp } from "./IOApp";

const pathIn = `${centers.io.path}/in`;
const pathOut = `${centers.io.path}/out`;
const cnHeader = 'tonwa-bg-gray-2 pt-2 small pb-1 px-3';
const cn = ' d-flex px-4 py-3 border-bottom align-items-center ';

function PageIOCenter() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { entities } = biz;
    let ioOuter = entities['$ioouter'];
    let ioApp = entities['$ioapp'];
    const folders: FolderLinkProps[] = [
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
        {
            caption: '入口定义',
            icon: 'sign-in',
            iconColor: 'text-success',
            path: `../${pathIn}`,
        },
        {
            caption: '出口定义',
            icon: 'sign-out',
            iconColor: 'text-warning',
            path: `../${pathOut}`,
        },
    ];

    function ViewItem({ value, icon, color }: { value: Entity; icon: string; color: string; }) {
        const { id, name, caption } = value;
        return <Link to={`../${pathDef(id)}`}>
            <div className="px-3 py-2 align-items-center d-flex">
                <FA name={icon} className={'me-3 ' + color} fixWidth={true} size="lg" />
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>;
    }

    function ViewItemIn({ value }: { value: Entity; }) {
        return <ViewItem value={value} icon="sign-in" color="text-success" />;
    }
    function ViewItemOut({ value }: { value: Entity; }) {
        return <ViewItem value={value} icon="sign-out" color="text-primary" />;
    }

    function onAddOuter() {
        alert('新增接口机构正在实现中...');
    }
    const outers: any[] = [];
    return <Page header={centers.io.caption}>
        {folders.map((v, index) => {
            return <FolderLink key={index} {...v} className={cn} onClick={undefined} />;
        })}
    </Page>;
}

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

function PageIODef() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { io } = useParams();
    let ioPhraseId = from62(io);
    const entity = biz.entityFromId<EntityIn | EntityOut>(ioPhraseId);
    const { name, caption, buds } = entity;
    function VBuds({ buds }: { buds: BizBud[] }) {
        return <div>
            {buds.map(v => {
                const { id, caption, name, budDataType } = v;
                if (budDataType.type === EnumBudType.arr) {
                    return <div key={id} className="border-bottom px-3 py-2">
                        <div>{caption ?? name}</div>
                        <div className="ps-4">
                            <VBuds buds={(budDataType as BudArr).buds} />
                        </div>
                    </div>;
                }
                else {
                    return <div key={id} className="border-bottom px-3 py-2">
                        {caption ?? name} {EnumBudType[budDataType.type]}
                    </div>;
                }
            })}
        </div>;
    }
    return <Page header={caption ?? name}>
        <VBuds buds={buds} />
    </Page>;
}

function PageDefs({ entities, header, icon, color }: { entities: Entity[]; header: string; icon: string; color: string; }) {
    function ViewItem({ value }: { value: Entity; }) {
        const { id, name, caption } = value;
        return <Link to={`../${pathDef(id)}`}>
            <div className="px-3 py-2 align-items-center d-flex">
                <FA name={icon} className={'me-3 ' + color} fixWidth={true} size="lg" />
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>;
    }
    return <Page header={header}>
        <List items={entities} ViewItem={ViewItem} />
    </Page>;
}

function ioPath(phraseId: number | string) {
    if (typeof phraseId === 'string') {
        if (phraseId !== ':io') debugger;
        return phraseId;
    }
    return to62(phraseId);
}
export function pathDef(phraseId: number | string) {
    return `${centers.io.path}/${ioPath(phraseId)}/def`;
}
export function routeIOCenter() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { ins, outs } = biz;
    // let ioOuter = entities['$ioouter'];
    // let ioApp = entities['$ioapp'];
    const n = ':io';
    const atom = ':atom';
    return <>
        <Route path={centers.io.path} element={<PageIOCenter />} />
        <Route path={pathIn} element={<PageDefs header="入口" entities={ins} icon="sign-in" color="text-success" />} />
        <Route path={pathOut} element={<PageDefs header="出口" entities={outs} icon="sign-out" color="text-warning" />} />
        <Route path={pathDef(n)} element={<PageIODef />} />
        <Route path={pathIOOuter.list(atom)} element={<PageIOOuterList />} />
        <Route path={pathIOOuter.new(atom)} element={<PageIOOuterNew />} />
        <Route path={pathIOOuter.view(atom)} element={<PageIOOuterView />} />
        <Route path={pathIOApp.list(atom)} element={<PageIOAppList />} />
        <Route path={pathIOApp.new(atom)} element={<PageIOAppNew />} />
        <Route path={pathIOApp.view(atom)} element={<PageIOAppView />} />
    </>;
}
