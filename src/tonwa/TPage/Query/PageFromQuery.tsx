import React, { ChangeEvent, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { List, Sep, theme } from "tonwa-com";
import { BinPick, BizBud, BizPhraseType, EntityQuery, IDColumn } from "../../Biz";
import { RearPickResultType, StoreSheet } from "../../Store";
import { LabelBox, RowCols, ViewBud } from "../../View";
import { ViewQueryParams } from "./ViewQueryParams";
import { QueryStore } from "./QueryStore";
import {
    viewAtomPrimesOfStore,
    ViewAtomTitlesOfStore, ViewForkAtomBold, viewForkBuds, ViewForkBuds
} from "../../View/Form/ViewForkOfStore";
import { FormBudsStore } from "../../Control/ControlBuds/BinEditing";
import { QueryRow, QueryRowCol } from "../../tools";

interface Parts {
    main: any;
    subs: any[];
}

export function PageFromQuery({ query, queryStore, editing, binPick, pickResultType }: {
    query: EntityQuery;
    queryStore: QueryStore;
    editing: FormBudsStore; // BudsEditing;
    binPick: BinPick;
    pickResultType: RearPickResultType;
}) {
    const modal = useModal();
    const { caption, name, ids: idCols, idFrom, value: budValue, hideCols, params } = query;
    const header = caption ?? name;
    let [list, setList] = useState(null as QueryRow[]);
    let [selectedItems, setSelectedItems] = useState<{ [id: number]: QueryRow; }>({});
    const indexLast = idCols.length - 1;
    async function onSearch(params: any) {
        let queryResults = await queryStore.query(params);
        setList(queryResults);
    }
    function closeModal(results: any) {
        editing.store.mergeStoreColl(queryStore);
        modal.close(results);
    }
    function onPick() {
        let values = Object.values(selectedItems);
        values.sort((a, b) => {
            let aRowId = a.rowId, bRowId = b.rowId;
            if (aRowId === bRowId) return 0;
            return aRowId < bRowId ? -1 : 1;
        });
        closeModal(values);
    }
    function onMultipleClick(item: QueryRow, isSelected: boolean) {
        const { rowId } = item;  // $id 是序号
        if (isSelected === true) {
            selectedItems[rowId] = item;
        }
        else {
            delete selectedItems[rowId];
        }
        setSelectedItems({ ...selectedItems });
    }
    function onSingleClick(item: QueryRow) {
        closeModal(item);
    }
    function itemBan(item: QueryRow) {
        const { ban } = item;
        if (ban > 0) {
            let { ban: banCaption } = query;
            if (banCaption === true) banCaption = '不可选';
            return banCaption;
        }
    }
    // let onItemSelect: any, 
    let onItemClick: any;
    let cnViewItem = 'd-flex flex-wrap ';
    let cnItem: string;
    let btnOk: any;
    switch (pickResultType) {
        default:
            cnViewItem += 'ps-3 ';
            cnItem = 'py-2 px-3 border-bottom ';
            break;
        case RearPickResultType.array:
            // onItemSelect = onMultipleClick;
            cnItem = ' px-3 py-2 ';
            btnOk = <button className="btn btn-primary m-3" onClick={onPick}>选入</button>;
            break;
        case RearPickResultType.scalar:
            onItemClick = onSingleClick;
            cnViewItem += 'ps-3 ';
            cnItem = 'py-2 px-3 border-bottom ';
            break;
    }

    function viewPropArr(arr: any[], propArr: QueryRowCol[]) {
        if (propArr === undefined) return;
        for (let v of propArr) {
            const [bud, value] = v;
            if (hideCols[bud.id] === true) continue;
            arr.push(<ViewBud bud={bud} value={value} store={queryStore} />);
        }
    }
    function viewIdOne(parts: Parts, id: number, col: IDColumn, cols: QueryRowCol[]) {
        const { subs } = parts;
        let colFromEntity = query.getFromEntityFromAlias(col.alias);
        const { bizPhraseType } = colFromEntity;
        switch (bizPhraseType) {
            default:
                return <>unknown bizPhraseType {bizPhraseType}</>
            case BizPhraseType.main:    // should be bin
                const sheetData = queryStore.sheetsColl[id];
                if (sheetData !== undefined) {
                    const { no, base } = sheetData;
                    const sheetEntity = queryStore.biz.entities[base];
                    subs.push(<>
                        <LabelBox label={sheetEntity.caption}>
                            <b>{no}</b>
                        </LabelBox>
                    </>);
                }
                viewPropArr(subs, cols);
                return;
            case BizPhraseType.fork:
                if (id === undefined) return;
                let forkCaption = col.ui.caption;
                viewForkBuds(subs, id, queryStore, forkCaption);
                return;
            /*
            return <RowCols>
                <ViewForkBuds id={id} store={queryStore} />
            </RowCols>;
            */
            case BizPhraseType.atom:
                parts.main = <>
                    <ViewForkAtomBold id={id} store={queryStore} />
                    <ViewAtomTitlesOfStore id={id} store={queryStore} />
                </>;
                viewAtomPrimesOfStore(subs, id, queryStore);
                viewPropArr(subs, cols);
            /*
            return <div>
                <div>
                    <ViewForkAtomBold id={id} store={queryStore} />
                    <ViewAtomTitlesOfStore id={id} store={queryStore} />
                </div>
                <RowCols contentClassName="">
                    <ViewAtomPrimesOfStore id={id} store={queryStore} />
                    <ViewPropArr propArr={cols} />
                </RowCols>
            </div>;
            */
        }
    }
    function viewParts(parts: Parts, className: string) {
        return <div className={className}>
            <div>{parts.main}</div>
            <RowCols>{parts.subs.map((v, index) => <React.Fragment key={index}>{v}</React.Fragment>)}</RowCols>
        </div>
    }
    function ViewItemMain({ value: picked }: { value: QueryRow }) {
        const { ids, cols } = picked;
        let parts: Parts = { main: undefined, subs: [] };
        let len = idCols.length;
        for (let index = 0; index < len; index++) {
            if (index >= indexLast) break;
            let col = idCols[index];
            let val = ids[index];
            viewIdOne(parts, val, col, cols);
        }
        return viewParts(parts, undefined);
    }
    function ViewItemDetail({ value: picked }: { value: QueryRow }) {
        const { ids, cols, values } = picked;
        let parts: Parts = { main: undefined, subs: [] };
        viewIdOne(parts, ids[0], idCols[indexLast], cols);
        return <div className="d-flex">
            {viewParts(parts, 'flex-fill')}
            <ViewValue values={values} />
        </div>;
    }
    function ViewValue({ values }: { values: [BizBud, number]; }) {
        if (values === undefined) return null;
        const [bud, value] = values;
        if (bud === undefined) return null;
        return <div className="w-min-8c text-end">
            <div className={theme.labelColor}>{bud.caption}</div>
            <div>{value}</div>
        </div>;
    }
    function ViewItem({ value: picked }: { value: QueryRow }) {
        const { rowId, values } = picked;
        let vHead: any;
        if (rowId > 0) {
            vHead = <div className={cnItem + ' d-flex border-bottom'}>
                <div className="flex-fill">
                    <ViewItemMain value={picked} />
                </div>
                <ViewValue values={values} />
            </div>;
        }
        function ViewItemSub({ value }: { value: QueryRow }) {
            function onCheckChange(evt: ChangeEvent<HTMLInputElement>) {
                const { checked } = evt.currentTarget;
                onMultipleClick(value, checked);
            }
            const cn = 'py-1 px-3 ';
            if (pickResultType === RearPickResultType.array) {
                let defaultChecked = (selectedItems[value.rowId] !== undefined);
                let checkDisabeld = false;
                let sheetStore = editing.store as StoreSheet;
                if (sheetStore !== undefined) {
                    const { queryRowColl, entity } = sheetStore.binStore;
                    const { pickBound } = entity;
                    if (pickBound !== undefined) {
                        let queryBud = entity.pickBound[0];
                        let [, boundValue] = value.cols.find(([b, v]) => b === queryBud);
                        if (queryRowColl[boundValue as number] === true) {
                            checkDisabeld = true;
                            defaultChecked = true;
                        }
                    }
                }
                return <label className={cn + 'd-flex align-items-end'}>
                    <input type="checkbox" className="form-check-input me-3 mb-2 align-self-end"
                        defaultChecked={defaultChecked}
                        onChange={onCheckChange}
                        disabled={checkDisabeld}
                    />
                    <div className="flex-fill">
                        <ViewItemDetail value={value} />
                    </div>
                </label>;
            }
            return <div className={cn}><ViewItemDetail value={value} /></div>;
        }
        return <div>
            {vHead}
            <List items={picked.subs} ViewItem={ViewItemSub}
                className={cnList}
                onItemClick={onItemClick}
                itemBan={itemBan}
                sep={vSep} />
        </div>;
    }

    let cnList = ' bg-white ';
    let vSep = <Sep className="border-bottom" />;
    return <Page header={header} footer={btnOk}>
        <ViewQueryParams query={query} binPick={binPick} editing={editing} onSearch={onSearch} />
        <List items={list} ViewItem={ViewItem}
            className={cnList}
            itemBan={itemBan}
            sep={vSep} />
    </Page>
}
