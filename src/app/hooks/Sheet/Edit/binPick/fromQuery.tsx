import { BinPick, BizBud, PickQuery } from "app/Biz";
import { useCallback, useState } from "react";
import { NamedResults, PickResultType } from "./useBinPicks";
import { Page, useModal } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { List } from "tonwa-com";
import { FormRow, FormRowsView } from "app/coms";
import { ViewBud, budFormRow } from "app/hooks";
import { useForm } from "react-hook-form";
import { filterUndefined } from "app/tool";

interface Prop<T = any> {
    name: string;
    bud: BizBud;
    value: T;
}
interface Picked { [name: string]: Prop | any }

export function usePickFromQuery() {
    const { uq, biz } = useUqApp();
    const modal = useModal();
    return useCallback(async function pickFromQuery(namedResults: NamedResults, binPick: BinPick, pickResultType: PickResultType): Promise<any> {
        let { name, caption, pick, param } = binPick;
        let pickBase = pick as PickQuery;
        let { query } = pickBase;
        const header = caption ?? query.caption ?? name;
        let retParam = await modal.open(<PageParam />);
        if (retParam === undefined) return;
        retParam = filterUndefined(retParam);
        let retQuery = await uq.DoQuery.submitReturns({ query: query.id, json: retParam, pageStart: undefined, pageSize: 100 });
        let pickedArr: Picked[] = [];
        for (let row of retQuery.ret) {
            let propArr: Prop[] = [];
            let picked: { [name: string]: Prop } = {
                $: propArr as any,
                id: row.id as any,
            };
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
                            switch (v0) {
                                case 'no': picked.no = v1; continue;
                                case 'ex': picked.ex = v1; continue;
                            }
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
        if (pickResultType === PickResultType.single) {
            return toRet(ret);
        }
        else {
            return (ret as any[]).map(v => toRet(v));
        }

        function PageParam() {
            const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
            const { params } = query;
            const inputParams = params.filter(v => v.budDataType.type !== 0);
            let formRows: FormRow[] = [
                ...inputParams.map(v => budFormRow(v, false)),
                { type: 'submit', label: '查找', options: {}, className: undefined }
            ];
            function onSubmitForm(data: any) {
                modal.close(data);
            }
            return <Page header={header}>
                <form className="container my-3" onSubmit={handleSubmit(onSubmitForm)}>
                    <FormRowsView rows={formRows} register={register} errors={errors} />
                </form>
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
            if (pickResultType === PickResultType.multiple) {
                onItemSelect = onMultipleClick;
                cnFirst = 'my-2 ';
            }
            else {
                onItemClick = onSingleClick;
                cnViewItem += 'ps-3 ';
                cnFirst = 'my-2 mx-3';
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
                    // if (value !== null && typeof value === 'object') value = value.id;
                    return <div className="my-2 me-3 w-min-16c d-flex align-items-center">
                        <small className="text-secondary me-2 w-min-4c">{caption}</small>
                        <span><ViewBud bud={bud} value={value} /></span>
                    </div>;
                }
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
                            return <VName key={index} {...v} />;
                        })}
                    </div>
                </div>
            }
            return <Page header={header} >
                <div>
                    <div className="tonwa-bg-gray-2 p-3 border-bottom">已选：{vSelected}</div>
                    <div>
                        <List items={pickedArr} ViewItem={ViewItem}
                            className=""
                            onItemSelect={onItemSelect}
                            onItemClick={onItemClick}
                            itemBan={itemBan} />
                    </div>
                    <button className="btn btn-primary m-3" onClick={onPick}>选入</button>
                </div>
            </Page>
        }
    }, []);
}
