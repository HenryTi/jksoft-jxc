import { MouseEvent, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";
import { Page, PageSpinner, useModal } from "tonwa-app";
import { FA, from62, List, useEffectOnce } from "tonwa-com";
import { EntitySheet, SheetState } from "../../../Biz";
import { BinData, getUserBudValue, SheetData } from "../../../Store";
import { ControlBiz } from "../../../Control";
import { useSiteRole } from "../../../Site";
import { useBiz } from "../../../Hooks";
import { ViewBud, ViewReaction, ViewNotifyCount, ViewItemMain } from "../../../View";
import { TControlSheetDash } from "../TControlSheetDash";
import { TControlBiz } from "../TControlBiz";
import { ViewStateStart } from "./ViewStateStart";

export function ViewStateTabs({ entitySheet }: { entitySheet: EntitySheet; }) {
    const { states, stateStart } = entitySheet;
    const [state, setState] = useState(stateStart);
    const [viewContent, setViewContent] = useState(<ViewStateStart entitySheet={entitySheet} />);
    function onStart(evt: MouseEvent<any>) {
        setState(stateStart);
        setViewContent(<ViewStateStart entitySheet={entitySheet} />);
        evt.preventDefault();
    }
    const cnActive = 'nav-link active';
    const cnTab = 'nav-link';
    const cnStart = state === stateStart ? cnActive : cnTab;
    return <>
        <ul className="nav nav-tabs px-3 pt-1">
            <li className="nav-item">
                <a className={cnStart} aria-current="page" href="#" onClick={onStart}>开始</a>
            </li>
            {
                states.map(v => {
                    let { name, ui } = v;
                    let caption = name;
                    if (ui !== undefined) {
                        let { caption: c } = ui;
                        if (c !== undefined) caption = c;
                    }
                    const cnState = state === v ? cnActive : cnTab;
                    function onState(evt: MouseEvent<any>) {
                        setState(v);
                        setViewContent(<ViewState entitySheet={entitySheet} state={v} />);
                        evt.preventDefault();
                    }
                    return <li className="nav-item">
                        <a className={cnState} href="#" onClick={onState}>{caption}</a>
                    </li>;
                })
            }
        </ul>
        <div className="tab-content" id="myTabContent">
            {viewContent}
        </div>
    </>;
}

function ViewState({ entitySheet, state }: { entitySheet: EntitySheet; state: SheetState; }) {
    const modal = useModal();
    const controlBiz = useMemo(() => new TControlBiz(modal, entitySheet.biz), []);
    const controlSheetDash = useMemo(() => new TControlSheetDash(controlBiz, entitySheet), []);
    const { storeSheetState } = controlSheetDash;
    const stateList = useAtomValue(storeSheetState.atomStateList);
    useEffectOnce(() => { storeSheetState.loadStateList(state.id, undefined, 50); });
    function ViewSheetItem({ value }: { value: (SheetData & BinData & { rowCount: number; }) }) {
        const { id, no, base, i } = value;
        return <div className="d-flex cursor-pointer" onClick={undefined}>
            <FA name="file" className="ps-4 pt-3 pe-2 text-info" size="lg" />
            <div className="flex-fill">
                <ViewItemMain value={value} isMy={true} store={storeSheetState} />
            </div>
        </div>;
    }

    return <div>
        <List
            ViewItem={ViewSheetItem}
            items={stateList as any[]}
            none={<div className="small text-secondary p-3">[无]</div>}
        />
    </div>;
}
