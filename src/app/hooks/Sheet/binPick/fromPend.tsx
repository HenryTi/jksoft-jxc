import { BinPick, PickPend } from "app/Biz";
import { useCallback } from "react";
import { useModal } from "tonwa-app";
import { NamedResults, PickResult } from "../store";
import { usePageParams } from "./PageParams";
import { PagePendProps } from "../binEdit/model";
import { PendProxyHander, ValRow } from "../tool";
import { DivStore } from "../store";
import { PagePend } from "./PagePend";

export function usePickFromPend() {
    const modal = useModal();
    const pickParam = usePageParams();
    return useCallback(
        async function pickFromPend(divStore: DivStore, namedResults: NamedResults, binPick: BinPick): Promise<PickResult[]> {
            let { name, caption, from: entityPend, pickParams, bin } = binPick as PickPend;
            // let pickBase = pick as PickPend;
            // let entityPend = pickBase.from;
            const pendProxyHander = new PendProxyHander(entityPend);
            const { params: queryParams } = entityPend;

            let retParam: any;
            if (queryParams !== undefined) {
                const header = caption;
                retParam = await pickParam({
                    header,
                    namedResults,
                    queryParams,
                    pickParams,
                });
                if (retParam === undefined) return;
            }
            else {
                retParam = {};
            }
            await divStore.loadPend(retParam);

            let props: PagePendProps = {
                caption,
                divStore,
                search: [],
            };

            let inputed = await modal.open<ValRow[]>(<PagePend {...props} />);
            if (inputed === undefined) return;
            // 如果有inputs，直接已经输入进了。就不用返回了。
            if (bin.div.inputs !== undefined) return;
            function proxy(obj: any) {
                return new Proxy(obj, pendProxyHander);
            }
            let iArr: (ValRow | [number, ValRow[]])[] = [];
            let iGroup: number[] = [];
            let iColl: { [i: number]: ValRow[] } = {};
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
