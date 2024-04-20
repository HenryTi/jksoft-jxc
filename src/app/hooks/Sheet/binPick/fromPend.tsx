import { PickPend } from "app/Biz";
import { useCallback } from "react";
import { useModal } from "tonwa-app";
import { NamedResults, PendProxyHander, PickResult, ValRow } from "../store";
import { usePageParams } from "./PageParams";
import { DivStore } from "../store";
import { PagePend } from "./PagePend";

export function usePickFromPend() {
    const modal = useModal();
    const pickParam = usePageParams();
    return useCallback(
        async function (divStore: DivStore, namedResults: NamedResults, binPick: PickPend): Promise<PickResult[]> {
            let { caption, from: entityPend, pickParams, bin } = binPick;
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
            const { sheetStore } = divStore;
            const { sheetConsole } = sheetStore;
            await divStore.loadPend(retParam);
            const { steps } = sheetConsole;
            if (steps !== undefined) steps.step = 1;
            let inputed = await modal.open<ValRow[]>(<PagePend divStore={divStore} caption={caption} />);
            if (inputed === undefined) return;
            sheetConsole.steps = undefined;
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
