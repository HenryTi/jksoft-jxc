import { useUqApp } from "app/UqApp";
import { ParamSaveMetricItem } from "uqs/UqDefault";

export function useMetric() {
    const { uq } = useUqApp();
    async function getAtomMetric(id: number) {
        let results = await uq.GetAtomMetric.query({ id });
        let { items } = results;
        for (let item of items) {
            let { div } = item;
            if (div !== undefined) {
                let $div = items.find(v => v.id === div);
                (item as any).$div = $div;
            }
        }
        return results;
    }

    async function saveMetricItem(param: ParamSaveMetricItem): Promise<{ id: number; metric: number; }> {
        let result = await uq.SaveMetricItem.submitReturns(param);
        if (result === undefined) return undefined;
        let { ret } = result;
        if (ret === undefined) return undefined;
        if (ret.length === 0) return undefined;
        let r = ret[0];
        return r;
    }
    return {
        getAtomMetric,
        saveMetricItem,
    }
}
