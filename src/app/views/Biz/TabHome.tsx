import { Link } from "react-router-dom";
import { IDView, Page, useModal } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { Permit, ViewSite } from "../Site";
import { Center, centers } from "../center";
import { ViewConsole } from "./ViewConsole";
import { PageMoreTest } from "app/coms/PageMore";
import { useRef, useState } from "react";
import { atom, useAtomValue } from "jotai";

export function TabHome() {
    const uqApp = useUqApp();
    const modal = useModal();
    const { uq, uqSites } = uqApp;
    let { userSite, mySites } = uqSites;
    const { sheet, atom, report, assign, tie, me, setting } = centers;
    const arr: Center[] = [sheet, atom, report, assign, tie, me, setting,];
    const cn = 'd-flex px-4 py-3 border-bottom align-items-center';
    let siteRight: any;
    if (mySites.length > 1 || userSite.isAdmin === true) {
        siteRight = <Link to={'../sites'} className="px-4 py-2">
            <FA name="angle-right" className="text-secondary" />
        </Link>;
    }
    function onTest() {
        modal.open(<PageMoreTest />);
    }
    // <button onClick={onTest}>test</button>
    return <Page header="同花" back="none">
        <div className="d-flex border-bottom tonwa-bg-gray-1">
            <div className="ps-5 py-2 flex-grow-1 text-center">
                <FA name="university" className="me-3 text-info" />
                <IDView uq={uq} id={userSite.site} Template={ViewSite} />
                <Permit>
                    <Link to="/biz" className="ms-4">设计</Link>
                </Permit>
            </div>
            {siteRight}
        </div>
        <ViewConsole />
    </Page>;
}
/*
jotai atom test
function Test() {
    const { current: arrAtom } = useRef(atom([1]));
    const [state, setState] = useState(false);
    let arrValue = useAtomValue(arrAtom);
    function onInc() {
        let arr = getAtomValue(arrAtom);
        arr.push(arr[arr.length - 1] + 1);
    }
    function onRedraw() {
        setState(!state);
    }
    function onIncRedraw() {
        let last = arrValue[arrValue.length - 1] + 1;
        setAtomValue(arrAtom, [...arrValue, last]);
    }

    return <div>
        <div>arr: {getAtomValue(arrAtom).join(',')}</div>
        <div>
            <button className="btn btn-primary me-3" onClick={onInc}>inc</button>
            <button className="btn btn-primary me-3" onClick={onRedraw}>redraw</button>
            <button className="btn btn-primary me-3" onClick={onIncRedraw}>inc & redraw</button>
        </div>
    </div>
}
*/