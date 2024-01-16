import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Page } from "tonwa-app";
import { List, Sep } from "tonwa-com";
import {
    OptionsUseBizAtom, pathAtom //, pathAtomEdit, pathAtomList, pathAtomNew, pathAtomView
    , useBizAtomList, useBizAtomNew, useBizAtomView
} from "app/hooks";
import { UqApp, useUqApp } from "app/UqApp";
import { Entity } from "app/Biz";
import { ViewAtom } from "app/hooks";
import { BI } from "app/coms";
import { centers } from "app/views/center";

function PageAtomCenter() {
    const { biz } = useUqApp();
    const atomEntities = biz.atomRoots;
    function ViewItem({ value }: { value: Entity; }) {
        const { id, name, caption } = value;
        return <Link to={`../${pathAtom.list(id)}`}>
            <div className="px-3 py-2 align-items-center d-flex">
                <BI name="credit-card-2-front" className="fs-larger me-3 text-info" />
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>;
    }
    return <Page header={centers.atom.caption}>
        <Sep />
        <List items={atomEntities} ViewItem={ViewItem} />
    </Page>;
}

const options: OptionsUseBizAtom = {
    atomName: 'atom' as any,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageNew() {
    let { page: Page } = useBizAtomNew(options);
    return Page;
}

function PageView() {
    let { page } = useBizAtomView(options);
    return page;
}

function PageList() {
    let optionsList = Object.assign({}, options, {
        ViewItemAtom: ViewAtom,
        pathAtomNew: pathAtom.new,
        pathAtomView: pathAtom.view,
        top: undefined,
    })
    let { page } = useBizAtomList(optionsList);
    return page;
}

export function routeAtomCenter() {
    const n = ':atom';
    return <>
        <Route path={centers.atom.path} element={<PageAtomCenter />} />
        <Route path={pathAtom.new(n)} element={<PageNew />} />
        <Route path={pathAtom.list(n)} element={<PageList />} />
        <Route path={pathAtom.edit(n)} element={<PageView />} />
        <Route path={pathAtom.view(n)} element={<PageView />} />
        <Route path={pathAtom.index(n)} element={<PageView />} />
    </>;
}
