import { useUqApp } from "app";
import { BizBud, BudArr, Entity, EnumBudType } from "tonwa";
import { EntityIn, EntityOut } from "tonwa";
import { centers } from "app/views/center";
import { Link, useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { FA, List, from62, to62 } from "tonwa-com";

const cnHeader = 'tonwa-bg-gray-2 pt-2 small pb-1 px-3';

export function PageIODef() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { io } = useParams();
    let ioPhraseId = from62(io);
    const entity = biz.entityFromId<EntityIn | EntityOut>(ioPhraseId);
    const { name, caption, buds } = entity;
    function VBuds({ buds }: { buds: BizBud[] }) {
        return <div>
            {buds.map(v => {
                const { id, caption, name, budDataType } = v;
                if (budDataType.type === EnumBudType.arr) {
                    return <div key={name} className="border-bottom px-3 py-2">
                        <div>{caption ?? name} []</div>
                        <div className="ps-4">
                            <VBuds buds={(budDataType as BudArr).buds} />
                        </div>
                    </div>;
                }
                else {
                    return <div key={id ?? name} className="border-bottom px-3 py-2">
                        <span className="d-inline-block w-min-8c">{caption ?? name}</span> {EnumBudType[budDataType.type].toUpperCase()}
                    </div>;
                }
            })}
        </div>;
    }
    return <Page header={caption ?? name}>
        <VBuds buds={buds} />
    </Page>;
}

export function PageIOList() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
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
        return <ViewItem value={value} icon="sign-in" color="text-success" />
    }
    function ViewItemOut({ value }: { value: Entity; }) {
        return <ViewItem value={value} icon="sign-out" color="text-warning" />
    }

    return <Page header="接口定义">
        <div className={cnHeader}>入口</div>
        <List items={ins} ViewItem={ViewItemOut} />
        <div className="mt-3" />
        <div className={cnHeader}>出口</div>
        <List items={outs} ViewItem={ViewItemIn} />
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
