import { PickQuery } from "app/Biz";
import { useCallback, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { List, Sep } from "tonwa-com";
import { filterUndefined } from "app/tool";
import { usePageParams } from "../Sheet/binPick/PageParams";
import { NamedResults, PickResult, RearPickResultType, VNamedBud/*, Picked, Prop, pickedFromJsonArr*/ } from "../Sheet/store";
import { Picked, Prop, RowCols } from "app/hooks/tool";
import { QueryStore } from "app/hooks/Query";

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

        let queryStore = new QueryStore(query);
        /*
        let retQuery = await uq.DoQuery.submitReturns({ query: query.id, json: retParam, pageStart: undefined, pageSize: 100 });
        let { ret: retItems, props, specs, atoms } = retQuery;
        let pickedArr: Picked[] = [];
        for (let row of retItems) {
            let propArr: Prop[] = [];
            let picked: Picked = {
                $: propArr as any,
                id: row.id as any,
            };
            picked.ban = {
                name: 'ban',
                bud: undefined,
                value: row.ban,
            };
            pickedFromJsonArr(query, propArr, picked, row.json);
            pickedArr.push(picked);
        }
        */
        let pickedArr: Picked[] = [];
        pickedArr = await queryStore.query(retParam);

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
            let vSelected: any;
            let selectedKeys = Object.keys(selectedItems);
            if (selectedKeys.length === 0) {
                vSelected = <small className="text-secondary">[无]</small>;
            }
            else {
                vSelected = <>{selectedKeys.map(v => v).join(', ')}</>;
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
            let btnOk: any; // , vTop: any;
            if (pickResultType === RearPickResultType.array) {
                onItemSelect = onMultipleClick;
                cnItem = ' my-2 ';
                btnOk = <button className="btn btn-primary m-3" onClick={onPick}>选入</button>;
                // vTop = <div className="tonwa-bg-gray-2 p-3 border-bottom">已选：{vSelected}</div>;
            }
            else {
                onItemClick = onSingleClick;
                cnViewItem += 'ps-3 ';
                cnItem = 'py-2 px-3 border-bottom ';
                /*
                    vTop = <div className="tonwa-bg-gray-2 p-3 border-bottom text-info">
                        <FA name="hand-o-down" className="me-3 text-danger" />
                        请选择
                    </div>;
                */
            }
            function ViewItem({ value: picked }: { value: Picked }) {
                let propArr: Prop[] = picked.$ as any;
                const { no, ex } = picked;
                let vFirst: any;
                if (ex !== undefined) {
                    vFirst = <><b>{ex}</b> &nbsp; &nbsp; <small className="text-secondary">{no}</small></>;
                }
                else if (no !== undefined) {
                    vFirst = <b>{no}</b>;
                }
                if (vFirst !== undefined) {
                    vFirst = <div className="mb-1">
                        {vFirst}
                    </div>;
                }
                return <div className={cnItem}>
                    {vFirst}
                    <RowCols contentClassName="">
                        {propArr.map((v, index) => {
                            return <VNamedBud key={index} {...v} />;
                        })}
                    </RowCols>
                </div>
            }
            return <Page header={header} footer={btnOk}>
                <List items={pickedArr} ViewItem={ViewItem}
                    className=""
                    onItemSelect={onItemSelect}
                    onItemClick={onItemClick}
                    itemBan={itemBan}
                    sep={<Sep className="border-bottom" />} />
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
