import { EntityQuery, IDColumn, PickQuery } from "app/Biz";
import { ChangeEvent, useState } from "react";
import { Page } from "tonwa-app";
import { LabelRow, List, Sep, theme } from "tonwa-com";
import { RearPickResultType } from "../Sheet/store";
import { LabelBox, Prop, QueryRow, QueryRowCol, RowCols } from "app/hooks/tool";
import { QueryStore } from "app/hooks/Query";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewAtomPrimesOfStore, ViewAtomTitlesOfStore, ViewForkAtom, ViewForkAtomBold } from "../View";
import { ViewForkId } from "app/coms/ViewForkId";
import { ViewBud } from "../Bud";
import { BudsEditing } from "../BudsEditing";
import { PickResult } from "../Calc";
import { ViewQueryParams } from "./ViewQueryParams";

async function pickFromQueryBase(
    editing: BudsEditing
    , binPick: PickQuery
    , pickResultType: RearPickResultType)
    : Promise<PickResult | PickResult[]> {
    let { caption, query, pickParams } = binPick as PickQuery;
    const { modal } = editing;
    let queryStore = new QueryStore(modal, query);
    let ret = await modal.open(<PageFromQuery />);
    if (ret === undefined) return;
    /*
    function toRet(v: any) {
        let obj = {} as any;
        for (let i in v) {
            let p = v[i];
            if (typeof p === 'object') {
                obj[i] = p.value;
            }
            else {
                obj[i] = p;
            }
        }
        return obj;
    }
    */
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
        // return (ret as any[]).map(v => toRet(v));
        return (ret as QueryRow[]).map(v => toRet(v));
    }
    // return ret;

    function PageFromQuery() {
        //let isPick = false;
        const { caption, name, ids: idCols, showIds: showIdCols, idFrom, value: budValue, hideCols, subCols } = query;
        const header = caption ?? name;
        const { bizPhraseType } = idFrom;
        let [list, setList] = useState(null as QueryRow[]);
        let [selectedItems, setSelectedItems] = useState<{ [id: number]: QueryRow; }>({});
        async function onSearch(params: any) {
            let queryResults = await queryStore.query(params);
            setList(queryResults);
        }
        function closeModal(results: any) {
            // Object.assign(editing.store.bizAtomColl, queryStore.bizAtomColl);
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
        //if (isPick === true) {
        if (pickResultType === RearPickResultType.array) {
            onItemSelect = onMultipleClick;
            cnItem = ' my-2 ';
            btnOk = <button className="btn btn-primary m-3" onClick={onPick}>选入</button>;
        }
        else {
            onItemClick = onSingleClick;
            cnViewItem += 'ps-3 ';
            cnItem = 'py-2 px-3 border-bottom ';
        }
        //}
        function ViewPropArr({ propArr }: { propArr: QueryRowCol[]; }) {
            if (propArr === undefined) return null;
            return <>
                {propArr.map((v, index) => {
                    const [bud, value] = v;
                    if (hideCols[bud.id] === true) return null;
                    /*
                    if (subCols !== undefined) {
                        if (subCols[id] !== true) return null;
                    }
                    */
                    return <ViewBud key={index} bud={bud} value={value} store={queryStore} />;
                })}
            </>;
        }
        function ViewShowIds({ ids }: { ids: number[]; }) {
            if (ids === undefined) return null;
            return <>{showIdCols.map((v, index) => {
                const { ui, alias } = v;
                let caption: string;
                if (ui === undefined) {
                    caption = alias;
                }
                else {
                    caption = ui.caption ?? alias;
                }
                function ViewId({ id, col }: { id: number; col: IDColumn; }) {
                    let colFromEntity = query.getFromEntityFromAlias(col.alias);
                    const { bizPhraseType } = colFromEntity;
                    switch (bizPhraseType) {
                        default:
                            return <>unknown bizPhraseType {bizPhraseType}</>
                        case BizPhraseType.fork:
                            return <ViewForkId id={id} />;
                        case BizPhraseType.atom:
                            return <ViewForkAtom id={id} store={queryStore} />;
                    }
                }
                return <LabelBox key={index} label={caption}>
                    <ViewId id={ids[index]} col={v} />
                </LabelBox>;
            })}</>;
        }
        function ViewItemAtomContent({ value: picked }: { value: QueryRow }) {
            const { ids, cols } = picked;
            if (ids === undefined) return null;
            // let propArr: Prop[] = picked.$ as any;
            function ViewIdOne({ id, col }: { id: number; col: IDColumn; }) {
                let colFromEntity = query.getFromEntityFromAlias(col.alias);
                const { bizPhraseType } = colFromEntity;
                switch (bizPhraseType) {
                    default:
                        return <>unknown bizPhraseType {bizPhraseType}</>
                    case BizPhraseType.fork:
                        if (id === undefined) return null;
                        return <ViewForkId id={id} />;
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
            function onCheckChange(evt: ChangeEvent<HTMLInputElement>) {
                const { checked } = evt.currentTarget;
                onMultipleClick(picked, checked);
            }
            return <>
                {idCols.map((v, index) => {
                    let col = v;
                    let val = ids[index];
                    if (index >= idCols.length) return null;
                    return <ViewIdOne key={index} id={val} col={col} />
                })}
            </>;
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
            const { rowId } = picked;
            let vHead: any;
            if (rowId > 0) {
                vHead = <div className={cnItem + ' d-flex '}>
                    <div className="flex-fill">
                        <ViewItemAtomContent value={picked} />
                    </div>
                    <ViewValue value={picked.values?.[0]?.[1]} caption="数量" />
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
                        <ViewItemAtomContent value={value} />
                    </label>;
                }
                return <div className={cn}><ViewItemAtomContent value={value} /></div>;
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
