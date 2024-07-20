import { BizBud, EnumBudType, PickPend } from "app/Biz";
import { BinStore } from "./BinStore";
import { NamedResults, PickResult } from "./NamedResults";
import { ValuesBudsEditing } from "app/hooks/BudsEditing";

export class PickPendStore {
    readonly divStore: BinStore;
    readonly pickPend: PickPend;
    readonly namedResults: NamedResults;
    readonly paramsEditing: ValuesBudsEditing;

    constructor(divStore: BinStore, pickPend: PickPend, namedResults: NamedResults) {
        this.divStore = divStore;
        this.pickPend = pickPend;
        this.namedResults = namedResults;
        this.paramsEditing = this.createParamsEditing();
    }

    private createParamsEditing() {
        let paramsInput: BizBud[] = [];
        let { pickParams } = this.pickPend;
        let { entity: { pend: entityPend } } = this.divStore;
        let { params } = entityPend;
        for (let bud of params) {
            if (pickParams.findIndex(v => v.name === bud.name) >= 0) continue;
            paramsInput.push(bud);
        }
        return new ValuesBudsEditing(this.divStore.modal, paramsInput);
    }

    async searchPend() {
        let params: { [budId: number]: number | string } = {};
        let { entity: { pend: entityPend } } = this.divStore;
        const { pickParams } = this.pickPend;
        const { params: queryParams } = entityPend;
        for (let param of queryParams) {
            let paramValue: any = undefined;
            let { id, name, budDataType } = param;
            let pickParam = pickParams?.find(v => v.name === name);
            if (pickParam !== undefined) {
                let { bud, prop, valueSet, valueSetType } = pickParam;
                if (bud === undefined) debugger;
                let namedResult = this.namedResults[bud] as PickResult;
                if (namedResult === undefined) {
                    paramValue = this.paramsEditing.values[id];
                }
                else {
                    if (prop === undefined) prop = 'id';
                    paramValue = namedResult[prop];
                }
            }
            else if (budDataType !== undefined && budDataType.type !== 0 && name !== undefined) {
                paramValue = this.paramsEditing.values[id];
            }

            // radio 值是数组，需要变成单值
            if (budDataType.type === EnumBudType.radio) {
                if (Array.isArray(paramValue) === true) {
                    paramValue = Number(paramValue[0]);
                    if (Number.isNaN(paramValue) === true || paramValue === 0) {
                        paramValue = undefined;
                    }
                }
            }
            params[id] = paramValue;
        }
        await this.divStore.searchPend(params);
    }
}
