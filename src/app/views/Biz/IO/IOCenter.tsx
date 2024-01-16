import { useUqApp } from "app";
import { BudDataType, Entity, EnumBudType } from "app/Biz";
import { EntityIn, EntityOut } from "app/Biz/EntityInOut";
import { BI } from "app/coms";
import { centers } from "app/views/center";
import { Link, Route, useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { FA, LMR, List, Sep, from62, to62 } from "tonwa-com";

const cnHeader = 'tonwa-bg-gray-2 pt-2 small pb-1 px-3';
function PageIOCenter() {
    const { biz } = useUqApp();
    const { ins, outs } = biz;

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
        <LMR className={cnHeader + ' align-items-end '}>
            <div>机构</div>
            <button className="btn btn-sm btn-outline-primary" onClick={onAddOuter}><FA name="plus" /></button>
        </LMR>
        <List items={outers} ViewItem={ViewItemIn} none={<div className="p-3 small text-secondary">暂无</div>} />

        <Sep className="mt-3" />
        <div className={cnHeader}>入口</div>
        <List items={ins} ViewItem={ViewItemIn} />
        <Sep className="mt-3" />
        <div className={cnHeader}>出口</div>
        <List items={outs} ViewItem={ViewItemOut} />
    </Page>;
}

function PageIODef() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { io } = useParams();
    let ioPhraseId = from62(io);
    const entity = biz.entityFromId<EntityIn | EntityOut>(ioPhraseId);
    const { name, caption, buds } = entity;
    return <Page header={caption ?? name}>
        <div>
            {buds.map(v => {
                const { id, caption, name, budDataType } = v;
                return <div key={id} className="border-bottom px-3 py-2">
                    {caption ?? name} {EnumBudType[budDataType.type]}
                </div>;
            })}
        </div>
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
    const n = ':io';
    return <>
        <Route path={centers.io.path} element={<PageIOCenter />} />
        <Route path={pathDef(n)} element={<PageIODef />} />
    </>;
}
