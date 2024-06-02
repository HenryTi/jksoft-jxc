import { PickQuery } from "app/Biz";
import { ChangeEvent, useCallback, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { List, Sep, theme } from "tonwa-com";
import { filterUndefined } from "app/tool";
import { usePageParams } from "../Sheet/binPick/PageParams";
import { NamedResults, PickResult, RearPickResultType, VNamedBud } from "../Sheet/store";
import { Picked, Prop, RowCols } from "app/hooks/tool";
import { QueryStore } from "app/hooks/Query";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewAtomPrimesOfStore, ViewAtomTitlesOfStore, ViewSpecAtom, ViewSpecBuds } from "../View";

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

        // debugger;
        // retParam['p物流中心'] = 4294984988;

        let queryStore = new QueryStore(query);
        let pickedArr: Picked[] = [];
        pickedArr = await queryStore.query(retParam);

        const { idFrom } = query;
        const { arr, bizPhraseType } = idFrom;
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

        function PageFromQuery() {
            let [selectedItems, setSelectedItems] = useState<{ [id: number]: Picked; }>({});
            function onPick() {
                let values = Object.values(selectedItems);
                values.sort((a, b) => {
                    let aId = a.id, bId = b.id;
                    if (aId === bId) return 0;
                    return aId < bId ? -1 : 1;
                });
                modal.close(values);
            }
            function onMultipleClick(item: Picked, isSelected: boolean) {
                const { id } = item;
                if (isSelected === true) {
                    selectedItems[id] = item;
                }
                else {
                    delete selectedItems[id];
                }
                setSelectedItems({ ...selectedItems });
            }
            function onSingleClick(item: Picked) {
                modal.close(item);
            }
            /*
            let vSelected: any;
            let selectedKeys = Object.keys(selectedItems);
            if (selectedKeys.length === 0) {
                vSelected = <small className="text-secondary">[无]</small>;
            }
            else {
                vSelected = <>{selectedKeys.map(v => v).join(', ')}</>;
            }
            */
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
            function ViewPropArr({ propArr }: { propArr: Prop[]; }) {
                return <>
                    {propArr.map((v, index) => {
                        return <VNamedBud key={index} {...v} />;
                    })}
                </>;
            }
            function ViewItemAtomContent({ value: picked }: { value: Picked }) {
                let propArr: Prop[] = picked.$ as any;
                const { id } = picked;
                return <>
                    <div>
                        <ViewSpecAtom id={id} store={queryStore} />
                        <ViewAtomTitlesOfStore id={id} store={queryStore} />
                    </div>
                    <RowCols contentClassName="">
                        <ViewAtomPrimesOfStore id={id} store={queryStore} />
                        <ViewPropArr propArr={propArr} />
                    </RowCols>
                </>;
            }
            function ViewValue({ value, caption }: { value: number; caption: string; }) {
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
                    <ViewValue value={picked.value} caption="数量" />
                </div>
            }
            function ViewItemSpec({ value: picked }: { value: Picked }) {
                const { $specs } = picked;
                let vSpecs: any;
                if ($specs !== undefined) {
                    let vList = ($specs as any[]).map((v, index) => {
                        const { $, id } = v;
                        let propArr: Prop[] = $ as any;
                        let cn = 'py-1 px-3 d-flex align-items-end ';
                        function onCheckChange(evt: ChangeEvent<HTMLInputElement>) {
                            const { checked } = evt.currentTarget;
                            onMultipleClick(v, checked);
                        }
                        if (index > 0) cn += ' border-top';
                        return <label className={cn} key={id}>
                            <input type="checkbox" className="form-check-input mx-3 mb-2 align-self-end"
                                defaultChecked={selectedItems[id] !== undefined}
                                onChange={onCheckChange}
                            />
                            <div className="flex-fill">
                                <RowCols contentClassName="">
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
                        <ViewValue value={picked.value} caption="合计" />
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
                case BizPhraseType.spec:
                    vList = <List items={pickedArr} ViewItem={ViewItemSpec} className=""
                        sep={vSep} />
                    break;
            }

            return <Page header={header} footer={btnOk}>
                {vList}
            </Page>
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
