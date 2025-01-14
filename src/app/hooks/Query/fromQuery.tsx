import { EntityQuery, IDColumn, PickQuery } from "app/Biz";
import { ChangeEvent, useState } from "react";
import { Page } from "tonwa-app";
import { List, Sep, theme } from "tonwa-com";
import { RearPickResultType } from "../Sheet/store";
import { LabelBox, Picked, Prop, RowCols } from "app/hooks/tool";
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
    if (pickResultType === RearPickResultType.scalar) {
        return toRet(ret);
    }
    else {
        return (ret as any[]).map(v => toRet(v));
    }
    // return ret;

    function PageFromQuery() {
        let isPick = true;
        const { caption, name, ids: idCols, showIds: showIdCols, idFrom, value: budValue } = query;
        const header = caption ?? name;
        const { bizPhraseType } = idFrom;
        let [list, setList] = useState(null as Picked[]);
        let [selectedItems, setSelectedItems] = useState<{ [id: number]: Picked; }>({});
        async function onSearch(params: any) {
            let queryResults = await queryStore.query(params);
            let pickedArr = queryResults as Picked[];
            setList(pickedArr);
        }
        function modalClose(results: any) {
            // Object.assign(editing.store.bizAtomColl, queryStore.bizAtomColl);
            editing.store.mergeStoreColl(queryStore);
            modal.close(results);
        }
        function onPick() {
            let values = Object.values(selectedItems);
            values.sort((a, b) => {
                let a$Id = a.$id, b$Id = b.$id;
                if (a$Id === b$Id) return 0;
                return a$Id < b$Id ? -1 : 1;
            });
            modalClose(values);
        }
        function onMultipleClick(item: Picked, isSelected: boolean) {
            const { $id } = item;  // $id 是序号
            if (isSelected === true) {
                selectedItems[$id] = item;
            }
            else {
                delete selectedItems[$id];
            }
            setSelectedItems({ ...selectedItems });
        }
        function onSingleClick(item: Picked) {
            modalClose(item);
        }
        function itemBan(item: Picked) {
            const { ban } = item;
            if (ban.value > 0) {
                let { ban: banCaption } = query;
                if (banCaption === true) banCaption = '不可选';
                return banCaption;
            }
        }
        let onItemSelect: any, onItemClick: any;
        let cnViewItem = 'd-flex flex-wrap ';
        let cnItem: string;
        let btnOk: any;
        if (isPick === true) {
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
        }
        function ViewPropArr({ propArr }: { propArr: Prop[]; }) {
            if (propArr === undefined) return null;
            const { hideCols } = query;
            return <>
                {propArr.map((v, index) => {
                    if (hideCols[v.bud.id] === true) return null;
                    return <ViewBud key={index} {...v} store={queryStore} />;
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
        function ViewItemAtomContent({ value: picked }: { value: Picked }) {
            const ids = picked.json as number[];
            let propArr: Prop[] = picked.$ as any;
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
                        return <>
                            <div>
                                <ViewForkAtomBold id={id} store={queryStore} />
                                <ViewAtomTitlesOfStore id={id} store={queryStore} />
                            </div>
                            <RowCols contentClassName="">
                                <ViewAtomPrimesOfStore id={id} store={queryStore} />
                                <ViewPropArr propArr={propArr} />
                            </RowCols>
                        </>;
                }
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
        function ViewItemAtom({ value: picked }: { value: Picked }) {
            return <div className={cnItem + ' d-flex '}>
                <div className="flex-fill">
                    <ViewItemAtomContent value={picked} />
                </div>
                <ViewValue value={picked.sum} caption="数量" />
            </div>
        }
        function ViewItemSpec({ value: picked }: { value: Picked }) {
            const { $specs, atomOnly } = picked;
            const cQuantity = '数量';
            let cSum = '合计';
            function ViewSpec({ spec: v, index }: { spec: any; index: number }) {
                const { $, $id, id, $ids } = v; // $id 是序号
                let propArr: Prop[] = $ as any;
                let cn = 'py-1 px-3 d-flex align-items-end ';
                function onCheckChange(evt: ChangeEvent<HTMLInputElement>) {
                    const { checked } = evt.currentTarget;
                    onMultipleClick(v, checked);
                }
                if (index > 0) cn += ' border-top';
                let vInput: any;
                if (isPick === true) {
                    vInput = <input type="checkbox" className="form-check-input me-3 mb-2 align-self-end"
                        defaultChecked={selectedItems[$id] !== undefined}
                        onChange={onCheckChange}
                    />;
                }
                return <label className={cn}>
                    {vInput}
                    <div className="flex-fill">
                        <RowCols contentClassName="">
                            <ViewShowIds ids={$ids} />
                            <ViewPropArr propArr={propArr} />
                        </RowCols>
                    </div>
                    <ViewValue value={v.value} caption={cQuantity} />
                </label>
            }
            let vSpecs: any;
            if ($specs !== undefined) {
                vSpecs = <div className="">
                    {($specs as any[]).map((v, index) => <ViewSpec key={v.$id} spec={v} index={index} />)}
                </div>
            }
            let vSumValue: any, cnBase: string = 'px-3 d-flex ';
            if (atomOnly === true) {
            }
            else {
                cnBase += ' border-bottom pb-1 ';
                vSumValue = <ViewValue value={picked.sum} caption={cSum} />;
            }
            return <div className="pt-2">
                <div className={cnBase}>
                    <div className="flex-fill">
                        <ViewItemAtomContent value={picked} />
                    </div>
                    {vSumValue}
                </div>
                {vSpecs}
            </div>;
        }

        let vList: any, cnList = ' bg-white ';
        let vSep = <Sep className="border-bottom" />;
        switch (bizPhraseType) {
            default:
                vList = <div>can not show bizPhraseType {bizPhraseType}</div>;
                break;
            case BizPhraseType.atom:
                vList = <List items={list} ViewItem={ViewItemAtom} className={cnList}
                    onItemSelect={onItemSelect}
                    onItemClick={onItemClick}
                    itemBan={itemBan}
                    sep={vSep} />
                break;
            case BizPhraseType.fork:
                vList = <List items={list} ViewItem={ViewItemSpec} className={cnList}
                    sep={vSep} />
                break;
        }

        return <Page header={header} footer={btnOk}>
            <ViewQueryParams query={query} binPick={binPick} editing={editing} onSearch={onSearch} />
            {vList}
        </Page>
    }

    // let ret = await doQuery(editing, query, retParam, true, pickResultType);
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

export async function doQuery(editing: BudsEditing, query: EntityQuery, params: any, isPick?: boolean, pickResultType?: RearPickResultType) {
    const { modal } = editing;
    let queryStore = new QueryStore(modal, query);
    let queryResults = await queryStore.query(params);
    let pickedArr = queryResults as Picked[];

    let ret = await modal.open(<PageFromQuery />);
    return ret;
    function PageFromQuery() {
        const { caption, name, ids: idCols, showIds: showIdCols, idFrom, value: budValue } = query;
        const header = caption ?? name;
        const { bizPhraseType } = idFrom;
        let [selectedItems, setSelectedItems] = useState<{ [id: number]: Picked; }>({});
        function modalClose(results: any) {
            editing.store.mergeStoreColl(queryStore);
            modal.close(results);
        }
        function onPick() {
            let values = Object.values(selectedItems);
            values.sort((a, b) => {
                let a$Id = a.$id, b$Id = b.$id;
                if (a$Id === b$Id) return 0;
                return a$Id < b$Id ? -1 : 1;
            });
            modalClose(values);
        }
        function onMultipleClick(item: Picked, isSelected: boolean) {
            const { $id } = item;  // $id 是序号
            if (isSelected === true) {
                selectedItems[$id] = item;
            }
            else {
                delete selectedItems[$id];
            }
            setSelectedItems({ ...selectedItems });
        }
        function onSingleClick(item: Picked) {
            modalClose(item);
        }
        function itemBan(item: Picked) {
            const { ban } = item;
            if (ban.value > 0) {
                let { ban: banCaption } = query;
                if (banCaption === true) banCaption = '不可选';
                return banCaption;
            }
        }
        let onItemSelect: any, onItemClick: any;
        let cnViewItem = 'd-flex flex-wrap ';
        let cnItem: string;
        let btnOk: any;
        if (isPick === true) {
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
        }
        function ViewPropArr({ propArr }: { propArr: Prop[]; }) {
            if (propArr === undefined) return null;
            const { hideCols } = query;
            return <>
                {propArr.map((v, index) => {
                    if (hideCols[v.bud.id] === true) return null;
                    return <ViewBud key={index} {...v} store={queryStore} />;
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
        function ViewItemAtomContent({ value: picked }: { value: Picked }) {
            const ids = picked.json as number[];
            let propArr: Prop[] = picked.$ as any;
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
                        return <>
                            <div>
                                <ViewForkAtomBold id={id} store={queryStore} />
                                <ViewAtomTitlesOfStore id={id} store={queryStore} />
                            </div>
                            <RowCols contentClassName="">
                                <ViewAtomPrimesOfStore id={id} store={queryStore} />
                                <ViewPropArr propArr={propArr} />
                            </RowCols>
                        </>;
                }
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
        function ViewItemAtom({ value: picked }: { value: Picked }) {
            return <div className={cnItem + ' d-flex '}>
                <div className="flex-fill">
                    <ViewItemAtomContent value={picked} />
                </div>
                <ViewValue value={picked.sum} caption="数量" />
            </div>
        }
        function ViewItemSpec({ value: picked }: { value: Picked }) {
            const { $specs, atomOnly } = picked;
            const cQuantity = '数量';
            let cSum = '合计';
            function ViewSpec({ spec: v, index }: { spec: any; index: number }) {
                const { $, $id, id, $ids } = v; // $id 是序号
                let propArr: Prop[] = $ as any;
                let cn = 'py-1 px-3 d-flex align-items-end ';
                function onCheckChange(evt: ChangeEvent<HTMLInputElement>) {
                    const { checked } = evt.currentTarget;
                    onMultipleClick(v, checked);
                }
                if (index > 0) cn += ' border-top';
                let vInput: any;
                if (isPick === true) {
                    vInput = <input type="checkbox" className="form-check-input me-3 mb-2 align-self-end"
                        defaultChecked={selectedItems[$id] !== undefined}
                        onChange={onCheckChange}
                    />;
                }
                return <label className={cn}>
                    {vInput}
                    <div className="flex-fill">
                        <RowCols contentClassName="">
                            <ViewShowIds ids={$ids} />
                            <ViewPropArr propArr={propArr} />
                        </RowCols>
                    </div>
                    <ViewValue value={v.value} caption={cQuantity} />
                </label>
            }
            let vSpecs: any;
            if ($specs !== undefined) {
                vSpecs = <div className="">
                    {($specs as any[]).map((v, index) => <ViewSpec key={v.$id} spec={v} index={index} />)}
                </div>
            }
            let vSumValue: any, cnBase: string = 'px-3 d-flex ';
            if (atomOnly === true) {
            }
            else {
                cnBase += ' border-bottom ';
                vSumValue = <ViewValue value={picked.sum} caption={cSum} />;
            }
            return <div className="pt-2">
                <div className={cnBase}>
                    <div className="flex-fill">
                        <ViewItemAtomContent value={picked} />
                    </div>
                    {vSumValue}
                </div>
                {vSpecs}
            </div>;
        }

        let vList: any;
        let vSep = <Sep className="border-bottom" />;
        switch (bizPhraseType) {
            default:
                vList = <div>can not show bizPhraseType {bizPhraseType}</div>;
                break;
            case BizPhraseType.atom:
                vList = <List items={pickedArr} ViewItem={ViewItemAtom} className=""
                    onItemSelect={onItemSelect}
                    onItemClick={onItemClick}
                    itemBan={itemBan}
                    sep={vSep} />
                break;
            case BizPhraseType.fork:
                vList = <List items={pickedArr} ViewItem={ViewItemSpec} className=""
                    sep={vSep} />
                break;
        }

        return <Page header={header} footer={btnOk}>
            {vList}
        </Page>
    }
}