import { EntityQuery } from "tonwa";
import { Page, useModal } from "tonwa-app";
import { useForm } from "react-hook-form";
import { FormRow, FormRowsView } from "app/coms";
import { theme } from "tonwa-com";
import { ChangeEvent, useMemo, useRef } from "react";
import { IDColumn, PickQuery } from "tonwa";
import { useState } from "react";
import { List, Sep } from "tonwa-com";
import { LabelBox, Prop, QueryRow, QueryRowCol, RowCols } from "app/hooks/tool";
import { QueryStore } from "app/hooks/Query";
import { BizPhraseType } from "uqs/UqDefault";
// import { ViewAtomPrimesOfStore, ViewAtomTitlesOfStore, ViewForkAtom, ViewForkAtomBold } from "../View";
import { ViewForkId } from "app/coms/ViewForkId";
import { ViewAtomPrimesOfStore, ViewAtomTitlesOfStore, ViewBud, ViewForkAtom, ViewForkAtomBold } from "app/hooks";
import { FormBudsStore, RearPickResultType, ValuesBudsEditing } from "app/Store";

// to be removed
// use only in adminData
export function PageQuery({ entity }: { entity: EntityQuery; }) {
    const modal = useModal();
    const { caption, name, params, biz } = entity;
    let paramBudsEditing = useMemo(() => new FormBudsStore(modal, new ValuesBudsEditing(entity.biz, params)), []);
    const { current: paramsData } = useRef({} as any);
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    let formRows: FormRow[] = [
        ...paramBudsEditing.buildFormRows(),
        { type: 'submit', label: '查找', options: {}, className: undefined }
    ];
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { target: { name, value } } = evt;
        paramsData[name] = value;
    }
    const options = { onChange };
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    async function onSubmitForm(data: any) {
        let ret = { ...data, ...paramsData };
        await doQuery(paramBudsEditing, entity, ret);
    }
    return <Page header={caption ?? name}>
        <form className={theme.bootstrapContainer + ' my-3 '} onSubmit={handleSubmit(onSubmitForm)}>
            <FormRowsView rows={formRows} register={register} errors={errors} context={paramBudsEditing} />
        </form>
    </Page>;
}

async function doQuery(editing: FormBudsStore, query: EntityQuery, params: any, isPick?: boolean, pickResultType?: RearPickResultType) {
    const { modal } = editing;
    let queryStore = new QueryStore(modal, query);
    let queryResults = await queryStore.query(params);
    let pickedArr = queryResults as QueryRow[];

    let ret = await modal.open(<PageFromQuery />);
    return ret;
    function PageFromQuery() {
        const { caption, name, ids: idCols, showIds: showIdCols, idFrom, value: budValue, mainCols, hideCols } = query;
        const header = caption ?? name;
        const { bizPhraseType } = idFrom;
        let [selectedItems, setSelectedItems] = useState<{ [id: number]: QueryRow; }>({});
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
                                <ViewPropArr propArr={cols} />
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
        function ViewItemAtom({ value: picked }: { value: QueryRow }) {
            let v = picked.values[0]?.[1];
            return <div className={cnItem + ' d-flex '}>
                <div className="flex-fill">
                    <ViewItemAtomContent value={picked} />
                </div>
                <ViewValue value={v} caption="数量" />
            </div>
        }
        function ViewItemSpec({ value: picked }: { value: QueryRow }) {
            const { cols, values } = picked;
            let v = values[0]?.[1];
            const cQuantity = '数量';
            let cSum = '合计';
            function ViewSpec({ spec: detail, index }: { spec: any; index: number }) {
                const { rowId, ids } = detail; // $id 是序号
                let cn = 'py-1 px-3 d-flex align-items-end ';
                function onCheckChange(evt: ChangeEvent<HTMLInputElement>) {
                    const { checked } = evt.currentTarget;
                    onMultipleClick(detail, checked);
                }
                if (index > 0) cn += ' border-top';
                let vInput: any;
                if (isPick === true) {
                    vInput = <input type="checkbox" className="form-check-input me-3 mb-2 align-self-end"
                        defaultChecked={selectedItems[rowId] !== undefined}
                        onChange={onCheckChange}
                    />;
                }
                return <label className={cn}>
                    {vInput}
                    <div className="flex-fill">
                        <RowCols contentClassName="">
                            <ViewShowIds ids={ids} />
                            <ViewPropArr propArr={cols} />
                        </RowCols>
                    </div>
                    <ViewValue value={detail.value} caption={cQuantity} />
                </label>
            }
            let vSpecs: any;
            /*
            if ($specs !== undefined) {
                vSpecs = <div className="">
                    {($specs as any[]).map((v, index) => <ViewSpec key={v.$id} spec={v} index={index} />)}
                </div>
            }
            */
            let vSumValue: any, cnBase: string = 'px-3 d-flex ';
            if (false) {
            }
            else {
                cnBase += ' border-bottom ';
                vSumValue = <ViewValue value={v} caption={cSum} />;
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
