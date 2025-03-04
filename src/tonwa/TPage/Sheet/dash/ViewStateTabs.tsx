import { MouseEvent, useMemo } from "react";
import { atom, useAtomValue } from "jotai";
import { useModal } from "tonwa-app";
import { FA, List, setAtomValue, useEffectOnce } from "tonwa-com";
import { EntitySheet, SheetState } from "../../../Biz";
import { BinData, SheetData } from "../../../Store";
import { ControlSheetDash } from "../../../Control";
import { ViewItemMain } from "../../../View";
import { TControlSheetDash } from "../TControlSheetDash";
import { TControlBiz } from "../TControlBiz";
import { ViewStateStart } from "./ViewStateStart";

export function ViewStateTabs({ entitySheet }: { entitySheet: EntitySheet; }) {
    const { states, stateStart } = entitySheet;
    const modal = useModal();
    const controlBiz = useMemo(() => new TControlBiz(modal, entitySheet.biz), []);
    const controlSheetDash = useMemo(() => new TControlSheetDash(controlBiz, entitySheet), []);
    const { storeSheetState } = controlSheetDash;
    const atomState = useMemo(() => atom(stateStart), []);
    const { counts } = useAtomValue(storeSheetState.atomStateList);
    function onStart(evt: MouseEvent<any>) {
        setAtomValue(atomState, stateStart);
        evt.preventDefault();
    }
    const cnBase = 'nav-link ';
    const cnActive = cnBase + 'active';
    const cnTab = cnBase;
    const state = useAtomValue(atomState);
    useEffectOnce(() => {
        storeSheetState.loadStateList(state.id, undefined, 50);
    });
    const cnStart = state === stateStart ? cnActive : cnTab;
    return <>
        <ul className="nav nav-tabs px-3 pt-1">
            <li className="nav-item">
                <a className={cnStart} aria-current="page" href="#" onClick={onStart}>开始</a>
            </li>
            {
                states.map(v => {
                    let { id, name, ui } = v;
                    let caption = name;
                    if (ui !== undefined) {
                        let { caption: c } = ui;
                        if (c !== undefined) caption = c;
                    }
                    const cnState = state === v ? cnActive : cnTab;
                    async function onState(evt: MouseEvent<any>) {
                        setAtomValue(atomState, v);
                        // setViewContent(<ViewState entitySheet={entitySheet} state={v} />);
                        evt.preventDefault();
                        await storeSheetState.loadStateList(id, undefined, 50);
                    }
                    let vBadge: any;
                    if (counts !== undefined) {
                        vBadge = <span className="badge rounded-pill bg-warning">
                            {counts[id]}
                        </span>;
                    }
                    return <li className="nav-item">
                        <a className={cnState} href="#" onClick={onState}>{caption} {vBadge}</a>
                    </li>;
                })
            }
        </ul>
        <div className="tab-content" id="myTabContent">
            {
                state === stateStart ?
                    <ViewStateStart entitySheet={entitySheet} />
                    :
                    <ViewState controlSheetDash={controlSheetDash} state={state} />
            }
        </div>
    </>;
}

function ViewState({ controlSheetDash, state }: { controlSheetDash: ControlSheetDash; state: SheetState; }) {
    const { storeSheetState } = controlSheetDash;
    const { list } = useAtomValue(storeSheetState.atomStateList);
    function ViewSheetItem({ value }: { value: (SheetData & BinData & { rowCount: number; }) }) {
        async function onPageSheetEdit() {
            await controlSheetDash.onPageSheetEdit(value.id);
            await storeSheetState.loadStateList(state.id, undefined, 50);
        }
        return <div className="d-flex cursor-pointer" onClick={onPageSheetEdit}>
            <FA name="file" className="ps-4 pt-3 pe-2 text-info" size="lg" />
            <div className="flex-fill">
                <ViewItemMain value={value} isMy={true} store={storeSheetState} />
            </div>
        </div>;
    }

    return <div>
        <List
            ViewItem={ViewSheetItem}
            items={list as any[]}
            none={<div className="small text-secondary p-3">[无]</div>}
        />
    </div>;
}
