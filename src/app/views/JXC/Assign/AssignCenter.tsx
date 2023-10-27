import { Entity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { BI } from "app/coms";
import { pathAssign } from "app/hooks/Assign";
import { pathAssignCenter } from "app/views/pathes";
import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { List, Sep } from "tonwa-com";
import { PageAssign } from "./PageAssign";

export function PageAssignCenter() {
    const { biz } = useUqApp();
    const atomEntities = biz.assigns;
    function ViewItem({ value }: { value: Entity; }) {
        const { id, name, caption } = value;
        return <Link to={`../${pathAssign(id)}`}>
            <div className="px-3 py-2 align-items-center d-flex">
                <BI name="credit-card-2-front" className="fs-larger me-3 text-info" />
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>;
    }
    return <Page header="赋值中心">
        <Sep />
        <List items={atomEntities} ViewItem={ViewItem} />
    </Page>;
}

export function routeAssignCenter() {
    const n = ':atom';
    return <>
        <Route path={pathAssignCenter} element={<PageAssignCenter />} />
        <Route path={pathAssign(':assign')} element={<PageAssign />} />
    </>;
}
