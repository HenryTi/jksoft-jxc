import { Gen } from "app/tool";
import { ParamSaveMetricItem } from "uqs/UqDefault";

export class GenMetric extends Gen {
    async getAtomMetric(id: number) {
        let results = await this.uq.GetAtomMetric.query({ id });
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

    async saveMetricItem(param: ParamSaveMetricItem): Promise<{ id: number; metric: number; }> {
        let result = await this.uq.SaveMetricItem.submitReturns(param);
        if (result === undefined) return undefined;
        let { ret } = result;
        if (ret === undefined) return undefined;
        if (ret.length === 0) return undefined;
        let r = ret[0];
        return r;
    }
}
