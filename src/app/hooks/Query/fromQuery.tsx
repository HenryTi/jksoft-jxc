import { BinPick, EntityQuery, IDColumn, PickQuery } from "app/Biz";
import { ChangeEvent, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { List, Sep, theme } from "tonwa-com";
import { RearPickResultType } from "../Sheet/store";
import { QueryRow, QueryRowCol, RowCols } from "app/hooks/tool";
import { QueryStore } from "app/hooks/Query";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewAtomPrimesOfStore, ViewAtomTitlesOfStore, ViewForkAtomBold, ViewForkBuds } from "../View";
import { ViewBud } from "../Bud";
import { BudsEditing } from "../BudsEditing";
import { PickResult } from "../Calc";
import { ViewQueryParams } from "./ViewQueryParams";

async function pickFromQueryBase(
    editing: BudsEditing
    , binPick: PickQuery
    , pickResultType: RearPickResultType)
    : Promise<PickResult | PickResult[]> {
    let { query } = binPick as PickQuery;
    const { modal } = editing;
    let queryStore = new QueryStore(modal, query);
    let ret = await modal.open(<PageFromQuery
        queryStore={queryStore}
        query={query} editing={editing}
        binPick={binPick} pickResultType={pickResultType} />);
    if (ret === undefined) return;
    function toRet(queryRow: QueryRow) {
        let { ids, cols } = queryRow;
        let ret: any = { id: ids[ids.length - 1] };
        if (cols !== undefined) {
            for (let [bud, value] of cols) {
                ret[bud.name] = value;
            }
        }
        return ret;
    }
    if (pickResultType === RearPickResultType.scalar) {
        return toRet(ret);
    }
    else {
        return (ret as QueryRow[]).map(v => toRet(v));
    }
}

export async function pickFromQueryScalar(
    // modal: Modal
    // , namedResults: NamedResults
    editing: BudsEditing
    , binPick: PickQuery)
    : Promise<PickResult> {
    return await pickFromQueryBase(editing, binPick, RearPickResultType.scalar) as PickResult;
};

export async function pickFromQuery(
    editing: BudsEditing
    , binPick: PickQuery
    , lastPickResultType: RearPickResultType)
    : Promise<PickResult[]> {
    return await pickFromQueryBase(editing, binPick, lastPickResultType) as PickResult[];
};

export function PageFromQuery({ query, queryStore, editing, binPick, pickResultType }: {
    query: EntityQuery;
    queryStore: QueryStore;
    editing: BudsEditing;
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
    let onItemSelect: any, onItemClick: any;
    let cnViewItem = 'd-flex flex-wrap ';
    let cnItem: string;
    let btnOk: any;
    switch (pickResultType) {
        default:
            cnViewItem += 'ps-3 ';
            cnItem = 'py-2 px-3 border-bottom ';
            break;
        case RearPickResultType.array:
            onItemSelect = onMultipleClick;
            cnItem = ' px-3 my-2 ';
            btnOk = <button className="btn btn-primary m-3" onClick={onPick}>选入</button>;
            break;
        case RearPickResultType.scalar:
            onItemClick = onSingleClick;
            cnViewItem += 'ps-3 ';
            cnItem = 'py-2 px-3 border-bottom ';
            break;
    }

    function ViewPropArr({ propArr }: { propArr: QueryRowCol[]; }) {
        if (propArr === undefined) return null;
        return <>
            {propArr.map((v, index) => {
                const [bud, value] = v;
                if (hideCols[bud.id] === true) return null;
                return <ViewBud key={index} bud={bud} value={value} store={queryStore} />;
            })}
        </>;
    }
    function ViewIdOne({ id, col, cols }: { id: number; col: IDColumn; cols: QueryRowCol[]; }) {
        let colFromEntity = query.getFromEntityFromAlias(col.alias);
        const { bizPhraseType } = colFromEntity;
        switch (bizPhraseType) {
            default:
                return <>unknown bizPhraseType {bizPhraseType}</>
            case BizPhraseType.main:    // should be bin
                return <div>
                    <div>bin: {id}</div>
                    <RowCols contentClassName="">
                        <ViewPropArr propArr={cols} />
                    </RowCols>
                </div>;
            case BizPhraseType.fork:
                if (id === undefined) return null;
                return <ViewForkBuds id={id} store={queryStore} />;
            case BizPhraseType.atom:
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
        }
    }
    function ViewItemMain({ value: picked }: { value: QueryRow }) {
        const { ids, cols } = picked;
        return <>
            {idCols.map((v, index) => {
                if (index >= indexLast) return null;
                let col = v;
                let val = ids[index];
                return <ViewIdOne key={index} id={val} col={col} cols={cols} />
            })}
        </>;
    }
    function ViewItemDetail({ value: picked }: { value: QueryRow }) {
        const { ids, cols } = picked;
        return <ViewIdOne id={ids[0]} col={idCols[indexLast]} cols={cols} />
    }
    function ViewValue({ value, caption }: { value: number; caption: string; }) {
        if (budValue === undefined) return null;
        if (value === undefined) return null;
        return <div className="w-min-8c text-end">
            <div className={theme.labelColor}>{caption}</div>
            <div>{value}</div>
        </div>;
    }
    function ViewItem({ value: picked }: { value: QueryRow }) {
        const { rowId, values } = picked;
        let vHead: any;
        if (rowId > 0) {
            vHead = <div className={cnItem + ' d-flex '}>
                <div className="flex-fill">
                    <ViewItemMain value={picked} />
                </div>
                <ViewValue value={values?.[0]?.[1]} caption="数量" />
            </div>;
        }
        function ViewItemSub({ value }: { value: QueryRow }) {
            function onCheckChange(evt: ChangeEvent<HTMLInputElement>) {
                const { checked } = evt.currentTarget;
                onMultipleClick(value, checked);
            }
            const cn = 'py-1 px-3 ';
            if (pickResultType === RearPickResultType.array) {
                return <label className={cn + 'd-flex align-items-end'}>
                    <input type="checkbox" className="form-check-input me-3 mb-2 align-self-end"
                        defaultChecked={selectedItems[value.rowId] !== undefined}
                        onChange={onCheckChange}
                    />
                    <div className="flex-fill">
                        <ViewItemDetail value={value} />
                    </div>
                </label>;
            }
            return <div className={cn}><ViewItemDetail value={value} /></div>;
        }
        // onItemSelect={onItemSelect}
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
