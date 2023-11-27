import { BinPick, EntityPend, PickPend, predefinedPendFields } from "app/Biz";
import { useCallback } from "react";
import { BudValue, Page, useModal } from "tonwa-app";
import { NamedResults, PickResult } from "./useBinPicks";
import { BinDetail } from "../SheetStore";
import { useUqApp } from "app/UqApp";
import { ViewSpec } from "app/hooks/View";
import { useState } from "react";
import { List } from "tonwa-com";
import { ReturnGetPendRetSheet } from "uqs/UqDefault";
import { PendRow } from "../SheetStore";
import { usePageParams } from "./PageParams";
import { Prop, VNamedBud, arrFromJsonArr, arrFromJsonMid } from "./tool";
import { OwnedBuds, budValuesFromProps } from "app/hooks/tool/tool";

export function usePickFromPend() {
    const { uq } = useUqApp();
    const modal = useModal();
    const pickParam = usePageParams();
    return useCallback(
        async function pickFromPend(namedResults: NamedResults, binPick: BinPick): Promise<PickResult[]> {
            let { name, caption, pick, pickParams } = binPick;
            let pickBase = pick as PickPend;
            let entityPend = pickBase.from;
            const pendProxyHander = new PendProxyHander(entityPend);
            const { params: queryParams } = entityPend;

            let retParam: any;
            if (queryParams !== undefined) {
                const header = caption;
                retParam = await pickParam({
                    header,
                    namedResults,
                    queryParams,
                    pickParams
                });
                if (retParam === undefined) return;
            }
            else {
                retParam = {};
            }
            let { $page, retSheet, props: showBuds } = await uq.GetPend.page({ pend: entityPend.id, params: retParam }, undefined, 100);
            const { ownerColl, budColl } = budValuesFromProps(showBuds);
            let collSheet: { [id: number]: ReturnGetPendRetSheet } = {};
            for (let v of retSheet) {
                collSheet[v.id] = v;
            };
            let pendRows: PendRow[] = [];
            for (let v of $page) {
                let { pendValue, mid, cols } = v;
                if (pendValue === undefined || pendValue <= 0) continue;
                let propArr: Prop[] = arrFromJsonArr(entityPend, cols);
                let midArr = arrFromJsonMid(entityPend, mid);
                let pendRow: PendRow = {
                    pend: v.pend,
                    sheet: { ...collSheet[v.sheet], buds: {}, owned: undefined },
                    detail: { ...v, buds: {}, owned: undefined },
                    value: pendValue,
                    mid: midArr,
                    cols: propArr,
                };
                pendRows.push(pendRow);
            }

            let props: ModalInputPendProps = {
                caption,
                entity: pickBase.from,
                search: [],
                pendRows,
                ownerColl,
            };

            let inputed = await modal.open<BinDetail[]>(<ModalInputPend {...props} />);
            if (inputed === undefined) return;
            function proxy(obj: any) {
                return new Proxy(obj, pendProxyHander);
            }
            let iArr: (BinDetail | [number, BinDetail[]])[] = [];
            let iGroup: number[] = [];
            let iColl: { [i: number]: BinDetail[] } = {};
            // group 按 i 分组
            // 行拆分。暂时没有内容
            for (let r of inputed) {
                let { i, x } = r;
                let rProxy = proxy(r);
                if (x === undefined) {
                    iArr.push(rProxy);
                }
                else {
                    let group = iColl[i];
                    if (group === undefined) {
                        group = [rProxy];
                        iColl[i] = group;
                        iGroup.push(i);
                    }
                    else {
                        group.push(rProxy);
                    }
                }
            }
            for (let g of iGroup) {
                iArr.push([g, iColl[g]]);
            }
            return iArr;
        }, []);
}

const sheetFields = ['si', 'sx', 'svalue', 'sprice', 'samount'];
class PendProxyHander implements ProxyHandler<any> {
    private readonly entityPend: EntityPend;
    constructor(entityPend: EntityPend) {
        this.entityPend = entityPend;
    }
    get(target: any, p: string | symbol, receiver: any) {
        if (sheetFields.findIndex(v => v === p) >= 0) {
            let k = p.toString().substring(1);
            let ret = target.sheet[k];
            return ret
        }
        if (predefinedPendFields.findIndex(v => v === p) >= 0) {
            return target[p];
        }
        let bud = this.entityPend.budColl[p as string];
        if (bud === undefined) return;
        let ret = target.mid[bud.id];
        return ret;
    }
}

interface ModalInputPendProps {
    caption: string;
    entity: EntityPend;
    search: string[];
    pendRows: PendRow[];
    ownerColl: {
        [row: number]: {
            [owner: number]: [number, BudValue][];
        };
    }
}

function ModalInputPend({ caption, entity: entityPend, search, pendRows, ownerColl }: ModalInputPendProps) {
    const uqApp = useUqApp();
    const modal = useModal();
    let { name: pendName, i: iBud } = entityPend;
    let [selectedItems, setSelectedItems] = useState<{ [id: number]: PendRow; }>({});

    if (caption === undefined) {
        caption = entityPend.caption ?? pendName;
    }
    function onClick() {
        let pendRows = Object.values(selectedItems).sort((a, b) => {
            let aPend = a.pend, bPend = b.pend;
            if (aPend < bPend) return -1;
            if (aPend === bPend) return 0;
            return 1;
        });
        let ret: BinDetail[] = [];
        for (let pendRow of pendRows) {
            const { pend, detail, value, sheet } = pendRow;
            let rowProps: BinDetail = {
                ...detail,
                value,
                origin: detail.id,             // origin detail id
                pendFrom: pend,
                pendValue: value,
                sheet,
                id: undefined,              // 保存之后才有的新输入的 detail id。编辑时有
            };
            detail.id = undefined;          // 取的是origin detail id
            ret.push(rowProps);
        }
        modal.close(ret);
    }
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex text-end align-items-center">
            <span className="me-3 small text-secondary">{caption}</span>
            <span className="w-min-4c">{value}</span>
        </div>;
    }
    const digits = 2;
    function ViewPropArr({ className, arr }: { className?: string; arr: Prop[]; }) {
        if (arr === undefined || arr.length === 0) return null;
        return <div className={className}>
            {arr.map((v, index) => {
                return <VNamedBud key={index} {...v} />;
            })}
        </div>;
    }
    function ViewPendRow({ value: pendRow }: { value: PendRow }) {
        const { detail: { id, i, price, amount }, value, mid, cols } = pendRow;
        return <div className="container">
            <div className="row">
                <div className="col">
                    <div className="py-2">
                        <ViewSpec id={i} />
                        <OwnedBuds values={ownerColl[id][iBud.id]} />
                    </div>
                </div>
                <ViewPropArr className="col" arr={mid} />
                <ViewPropArr className="col" arr={cols} />
                <div className="col">
                    <div className="py-2 d-flex flex-column align-items-end">
                        <ViewValue caption={'单价'} value={price?.toFixed(digits)} />
                        <ViewValue caption={'金额'} value={amount?.toFixed(digits)} />
                        <ViewValue caption={'数量'} value={<span className="fs-larger fw-bold">{value}</span>} />
                    </div>
                </div >
            </div>
        </div>;
    }
    function onItemSelect(item: PendRow, isSelected: boolean) {
        const { pend } = item;
        if (isSelected === true) {
            selectedItems[pend] = item;
        }
        else {
            delete selectedItems[pend];
        }
        setSelectedItems({ ...selectedItems });
    }
    return <Page header={caption}>
        <List items={pendRows} ViewItem={ViewPendRow} className="" onItemSelect={onItemSelect} />
        <div className="p-3">
            <button className="btn btn-primary" onClick={onClick}>选入</button>
        </div>
    </Page>;
}
