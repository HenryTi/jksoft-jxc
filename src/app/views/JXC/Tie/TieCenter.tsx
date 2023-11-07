import { Entity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { BI } from "app/coms";
import { captionTieCenter, pathTieCenter } from "../../pathes";
import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { List, Sep } from "tonwa-com";
import { PageTie } from "./PageTie";
import { pathTie } from "app/hooks";

export function PageTieCenter() {
    const { biz } = useUqApp();
    const ties = biz.ties;
    function ViewItem({ value }: { value: Entity; }) {
        const { id, name, caption } = value;
        return <Link to={`../${pathTie(id)}`}>
            <div className="px-3 py-2 align-items-center d-flex">
                <BI name="credit-card-2-front" className="fs-larger me-3 text-info" />
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>;
    }
    return <Page header={captionTieCenter}>
        <Sep />
        <List items={ties} ViewItem={ViewItem} />
    </Page>;
}

export function routeTieCenter() {
    return <>
        <Route path={pathTieCenter} element={<PageTieCenter />} />
        <Route path={pathTie(':tie')} element={<PageTie />} />
    </>;
}
