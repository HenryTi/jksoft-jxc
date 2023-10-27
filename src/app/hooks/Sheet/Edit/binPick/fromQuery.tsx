import { BinPick, BizBud, Entity, PickQuery } from "app/Biz";
import { useCallback, useState } from "react";
import { PickResults } from "./useBinPicks";
import { Page, useModal } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { List } from "tonwa-com";

interface Prop<T = any> {
    name: string;
    bud: BizBud;
    value: T;
}
interface Picked { [name: string]: Prop }

export function usePickFromQuery() {
    const { uq, biz } = useUqApp();
    const modal = useModal();
    return useCallback(async function pickFromQuery(pickResults: PickResults, binPick: BinPick): Promise<any> {
        let { name, caption, pick } = binPick;
        let pickBase = pick as PickQuery;
        let { query } = pickBase;

        let retQuery = await uq.DoQuery.submitReturns({ query: query.id, json: { a: null }, pageStart: undefined, pageSize: 100 });
        let pickedArr: Picked[] = [];
        for (let row of retQuery.ret) {
            let propArr: Prop[] = [];
            let picked: { [name: string]: Prop } = {
                $: propArr as any,
            };
            propArr.push(picked.id = {
                name,
                bud: undefined,
                value: row,
            });
            picked.ban = {
                name: 'ban',
                bud: undefined,
                value: row.ban,
            };
            let arr: any[] = row.json;
            for (let v of arr) {
                let { length } = v;
                let v0 = v[0];
                let v1 = v[1];
                let name: string, bud: BizBud, value: any;
                switch (length) {
                    default: debugger; continue;
                    case 2:
                        if (typeof (v0) === 'string') {
                            name = v0;
                            value = v1
                        }
                        else {
                            bud = query.buds[v0];
                            name = bud.name;
                            value = v1;
                        }
                        break;
                    case 3:
                        let bizEntity = biz.entityIds[v0];
                        bud = bizEntity.buds[v1];
                        name = bud.name;
                        value = v[2];
                        break;
                }
                propArr.push(picked[name] = { name, bud, value });
            }
            pickedArr.push(picked);
        }
        let retParam = await modal.open(<PageParam />);
        let ret = await modal.open(<PageFromQuery />);
        if (ret === undefined) return false;
        pickResults.arr = ret;
        return true;

        function PageParam() {
            function onOk() {
                modal.close({});
            }
            return <Page header="param">
                <div className="p-3">
                    <button className="btn btn-primary" onClick={onOk}>确认</button>
                </div>
            </Page>;
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
            function ViewItem({ value: picked }: { value: Picked }) {
                let propArr: Prop[] = picked.$ as any;
                function VName({ name, value, bud }: { name: string; value: any; bud: BizBud; }) {
                    let caption: string;
                    if (bud === undefined) caption = name;
                    else {
                        const { name: bn, caption: bc } = bud;
                        caption = bc ?? bn;
                    }
                    if (typeof value === 'object') value = value.id;
                    return <div>
                        <small className="text-secondary me-2 w-min-3c d-inline-block">{caption}</small>
                        <span>{value}</span>
                    </div>;
                }
                return <div className="py-2">
                    {propArr.map((v, index) => <VName key={index} {...v} />)}
                </div>
            }
            function onItemSelect(item: Picked, isSelected: boolean) {
                const { id: { value: { id } } } = item;
                if (isSelected === true) {
                    selectedItems[id] = item;
                }
                else {
                    delete selectedItems[id];
                }
                setSelectedItems({ ...selectedItems });
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
            return <Page header={caption ?? name} >
                <div>
                    <div className="tonwa-bg-gray-2 p-3 border-bottom">已选：{vSelected}</div>
                    <div>
                        <List items={pickedArr} ViewItem={ViewItem} className="" onItemSelect={onItemSelect} itemBan={itemBan} />
                    </div>
                    <button className="btn btn-primary m-3" onClick={onPick}>选入</button>
                </div>
            </Page>
        }
    }, []);
}
