import { EntityQuery, IDColumn, PickQuery } from "app/Biz";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Modal, Page, useModal } from "tonwa-app";
import { List, Sep, theme, useEffectOnce } from "tonwa-com";
import { filterUndefined } from "app/tool";
import { pickQueryParams/*, usePageParams*/ } from "../Sheet/binPick/PageParams";
import { RearPickResultType } from "../Sheet/store";
import { LabelBox, Picked, Prop, RowCols } from "app/hooks/tool";
import { QueryStore } from "app/hooks/Query";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewAtomPrimesOfStore, ViewAtomTitlesOfStore, ViewSpecAtom, ViewSpecAtomBold } from "../View";
import { ViewSpecId } from "app/coms/ViewSpecId";
import { ViewBud } from "../Bud";
import { BudsEditing } from "../BudsEditing";
import { PickResult } from "../Calc";

/*
export function usePickFromQuery(): [
    (namedResults: NamedResults, binPick: PickQuery) => Promise<PickResult>,
    (namedResults: NamedResults, binPick: PickQuery, lastPickResultType: RearPickResultType) => Promise<PickResult[]>,
] {
    const modal = useModal();
    const pickParam = usePageParams();
    const pickFromQueryBase = useCallback(async function (
        namedResults: NamedResults
        , binPick: PickQuery
        , pickResultType: RearPickResultType)
        : Promise<PickResult | PickResult[]> {
        let { name, caption, query, pickParams } = binPick as PickQuery;
        const header = caption ?? query.caption ?? name;
        let retParam = await pickParam({
            header,
            namedResults,
            queryParams: query.params,
            pickParams
        });
        if (retParam === undefined) return;
        retParam = filterUndefined(retParam);

        // const { ids: idCols, showIds: showIdCols, idFrom, value: budValue } = query;
        // const { arr, bizPhraseType } = idFrom;
        let ret = await modal.open(<PageFromQuery query={query} params={retParam}
            pickResultType={pickResultType} isPick={true} />);
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
    }, []);
    const pickFromQueryScalar = useCallback(async function (
        namedResults: NamedResults
        , binPick: PickQuery)
        : Promise<PickResult> {
        return await pickFromQueryBase(namedResults, binPick, RearPickResultType.scalar) as PickResult;
    }, []);
    const pickFromQuery = useCallback(async function (
        namedResults: NamedResults
        , binPick: PickQuery
        , lastPickResultType: RearPickResultType)
        : Promise<PickResult[]> {
        return await pickFromQueryBase(namedResults, binPick, lastPickResultType) as PickResult[];
    }, []);
    return [pickFromQueryScalar, pickFromQuery];
}
*/
async function pickFromQueryBase(
    // modal: Modal
    // , namedResults: NamedResults
    editing: BudsEditing
    , binPick: PickQuery
    , pickResultType: RearPickResultType)
    : Promise<PickResult | PickResult[]> {
    let { name, caption, query, pickParams } = binPick as PickQuery;
    const header = caption ?? query.caption ?? name;
    let retParam = await pickQueryParams({
        editing,
        header,
        // namedResults,
        queryParams: query.params,
        pickParams
    });
    if (retParam === undefined) return;
    retParam = filterUndefined(retParam);
    const { modal } = editing;
    /*
    let queryStore = new QueryStore(query);
    let pickedArr: Picked[] = [];
    pickedArr = await queryStore.query(retParam);
    */
    // const { ids: idCols, showIds: showIdCols, idFrom, value: budValue } = query;
    // const { arr, bizPhraseType } = idFrom;
    let ret = await doQuery(modal, query, retParam, true, pickResultType);
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
    // modal: Modal
    // , namedResults: NamedResults
    editing: BudsEditing
    , binPick: PickQuery
    , lastPickResultType: RearPickResultType)
    : Promise<PickResult[]> {
    return await pickFromQueryBase(editing, binPick, lastPickResultType) as PickResult[];
};

export async function doQuery(modal: Modal, query: EntityQuery, params: any, isPick?: boolean, pickResultType?: RearPickResultType) {
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
        function onPick() {
            let values = Object.values(selectedItems);
            values.sort((a, b) => {
                let a$Id = a.$id, b$Id = b.$id;
                if (a$Id === b$Id) return 0;
                return a$Id < b$Id ? -1 : 1;
            });
            modal.close(values);
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
            modal.close(item);
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
            return <>
                {propArr.map((v, index) => {
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
                            return <ViewSpecId id={id} />;
                        case BizPhraseType.atom:
                            return <ViewSpecAtom id={id} store={queryStore} />;
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
                        return <ViewSpecId id={id} />;
                    case BizPhraseType.atom:
                        return <>
                            <div>
                                <ViewSpecAtomBold id={id} store={queryStore} />
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
            const { $specs } = picked;
            let vSpecs: any;
            if ($specs !== undefined) {
                let vList = ($specs as any[]).map((v, index) => {
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
                        vInput = <input type="checkbox" className="form-check-input mx-3 mb-2 align-self-end"
                            defaultChecked={selectedItems[$id] !== undefined}
                            onChange={onCheckChange}
                        />;
                    }
                    return <label className={cn} key={$id}>
                        {vInput}
                        <div className="flex-fill">
                            <RowCols contentClassName="">
                                <ViewShowIds ids={$ids} />
                                <ViewPropArr propArr={propArr} />
                            </RowCols>
                        </div>
                        <ViewValue value={v.value} caption="数量" />
                    </label>
                });
                vSpecs = <div className="">
                    {vList}
                </div>
            }
            return <div className="pt-2">
                <div className="px-3 border-bottom d-flex">
                    <div className="flex-fill">
                        <ViewItemAtomContent value={picked} />
                    </div>
                    <ViewValue value={picked.sum} caption="合计" />
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