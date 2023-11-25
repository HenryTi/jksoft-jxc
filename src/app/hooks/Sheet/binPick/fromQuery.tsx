import { BinPick, PickQuery } from "app/Biz";
import { useCallback, useState } from "react";
import { LastPickResultType, NamedResults, PickResult } from "./useBinPicks";
import { Page, useModal } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { FA, List } from "tonwa-com";
import { filterUndefined } from "app/tool";
import { usePageParams } from "./PageParams";
import { Picked, Prop, VNamedBud, pickedFromJsonArr } from "./tool";

export function usePickFromQuery(): [
    (namedResults: NamedResults, binPick: BinPick) => Promise<PickResult>,
    (namedResults: NamedResults, binPick: BinPick, lastPickResultType: LastPickResultType) => Promise<PickResult[]>,
] {
    const { uq, biz } = useUqApp();
    const modal = useModal();
    const pickParam = usePageParams();
    const pickFromQueryBase = useCallback(async function (
        namedResults: NamedResults
        , binPick: BinPick
        , pickResultType: LastPickResultType)
        : Promise<PickResult | PickResult[]> {
        let { name, caption, pick, pickParams } = binPick;
        let pickBase = pick as PickQuery;
        let { query } = pickBase;
        const header = caption ?? query.caption ?? name;
        let retParam = await pickParam({
            header,
            namedResults,
            queryParams: query.params,
            pickParams
        });
        if (retParam === undefined) return;
        retParam = filterUndefined(retParam);
        let retQuery = await uq.DoQuery.submitReturns({ query: query.id, json: retParam, pageStart: undefined, pageSize: 100 });
        let pickedArr: Picked[] = [];
        for (let row of retQuery.ret) {
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
        if (pickResultType === LastPickResultType.scalar) {
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
            let cnFirst: string;
            let btnOk: any, vTop: any;
            if (pickResultType === LastPickResultType.array) {
                onItemSelect = onMultipleClick;
                cnFirst = 'my-2 ';
                btnOk = <button className="btn btn-primary m-3" onClick={onPick}>选入</button>;
                vTop = <div className="tonwa-bg-gray-2 p-3 border-bottom">已选：{vSelected}</div>;
            }
            else {
                onItemClick = onSingleClick;
                cnViewItem += 'ps-3 ';
                cnFirst = 'my-2 mx-3';
                vTop = <div className="tonwa-bg-gray-2 p-3 border-bottom text-info">
                    选择请点击
                    <FA name="hand-o-down" className="ms-3 text-danger" />
                </div>;
            }
            function ViewItem({ value: picked }: { value: Picked }) {
                let propArr: Prop[] = picked.$ as any;
                const { no, ex } = picked;
                let vFirst: any;
                if (ex !== undefined) {
                    vFirst = <><b>{ex}</b> &nbsp; &nbsp; {no}</>;
                }
                else if (no !== undefined) {
                    vFirst = <><b>{no}</b></>;
                }
                if (vFirst !== undefined) {
                    vFirst = <div className={cnFirst}>
                        {vFirst}
                    </div>;
                }
                return <div>
                    {vFirst}
                    <div className={cnViewItem}>
                        {propArr.map((v, index) => {
                            return <VNamedBud key={index} {...v} />;
                        })}
                    </div>
                </div>
            }
            return <Page header={header} >
                <div>
                    {vTop}
                    <div>
                        <List items={pickedArr} ViewItem={ViewItem}
                            className=""
                            onItemSelect={onItemSelect}
                            onItemClick={onItemClick}
                            itemBan={itemBan} />
                    </div>
                    {btnOk}
                </div>
            </Page>
        }
    }, []);
    const pickFromQueryScalar = useCallback(async function (
        namedResults: NamedResults
        , binPick: BinPick)
        : Promise<PickResult> {
        return await pickFromQueryBase(namedResults, binPick, LastPickResultType.scalar) as PickResult;
    }, []);
    const pickFromQuery = useCallback(async function (
        namedResults: NamedResults
        , binPick: BinPick
        , lastPickResultType: LastPickResultType)
        : Promise<PickResult[]> {
        return await pickFromQueryBase(namedResults, binPick, lastPickResultType) as PickResult[];
    }, []);
    return [pickFromQueryScalar, pickFromQuery];
}
