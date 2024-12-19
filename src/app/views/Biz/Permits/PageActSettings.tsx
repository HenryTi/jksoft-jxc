import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { PagePermits } from "./PagePermits";
import { FA, List, Sep } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { EntityPermit, EntityRole, PermitItem } from "app/Biz/EntityPermit";
import { centers } from "app/views/center";

const pathPermits = 'permits';

function PageActSettings() {
    const { biz } = useUqApp();

    function ViewItemRole({ value }: { value: EntityRole; }) {
        const { name, type } = value;
        return <div className="px-3 py-2 d-flex">
            <div className="me-3 w-8c">{type}</div>
            <div>{name}</div>
        </div>
    }

    function ViewItemPermit({ value }: { value: EntityPermit; }) {
        const { name, type, permits, items } = value;
        function ViewPiece({ className, value, icon }: { className?: string; icon?: any; value: EntityPermit | PermitItem }) {
            let { caption, name, type } = value as any;
            if (type === undefined) type = 'item';
            return <div className={'px-3 py-2 border rounded mx-2 my-2 w-min-10c ' + (className ?? '')} >
                {icon} {caption ?? name}
            </div>
        }
        function ViewPermit({ value }: { value: EntityPermit; }) {
            const icon = <FA name="id-card-o" className="me-2 text-success" />;
            return <ViewPiece value={value} className="" icon={icon} />;
        }
        function ViewItem({ value }: { value: PermitItem; }) {
            const icon = <FA name="calendar-check-o" className="me-2 text-info" />;
            return <ViewPiece value={value} className="text-primary" icon={icon} />;
        }
        return <div className="mx-2 border">
            <div className="d-flex tonwa-bg-gray-2 px-3 py-2">
                <div className="me-3 w-8c">{type}</div>
                <div>{name}</div>
            </div>
            <div className="d-flex flex-wrap px-1">
                {items.map(v => <ViewItem key={v.name} value={v} />)}
            </div>
            <div className="d-flex flex-wrap px-1">
                {permits.map(v => <ViewPermit key={v.name} value={v} />)}
            </div>
        </div>
    }

    return <Page header={centers.setting.caption}>
        <div className="p-3">
            <div>操作员设置</div>
            {biz.entityWithUser.map(v => {
                return <div key={v.id} className="mb-3">
                    <div>{v.caption ?? v.name}</div>
                    <div className="ms-3">
                        {v.userBuds.map(v => {
                            return <div key={v.id}>{v.caption ?? v.name}</div>
                        })}
                    </div>
                </div>
            })}
        </div>
        <Link to={'../' + pathPermits}>
            <div className="p-3">
                权限演示
            </div>
        </Link>
        <Sep />
        <div className="">
            <List items={biz.roles} ViewItem={ViewItemRole} />
        </div>
    </Page>;
    /*
            <div className="py-2" />
            <List items={biz.permits} ViewItem={ViewItemPermit} sep={<div className="py-2" />} />
    */
}

export const routePermits = <>
    <Route path={centers.setting.path} element={<PageActSettings />} />
    <Route path={pathPermits} element={<PagePermits />} />
</>;
