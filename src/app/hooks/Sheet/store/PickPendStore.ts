import { BizBud, EnumBudType, PickPend } from "app/Biz";
import { BinStore } from "./BinStore";
import { ValuesBudsEditing } from "app/hooks/BudsEditing";
import { PickResult, ValueSpace } from "app/hooks/Calc";
import { BinBudsEditing } from "./BinEditing";

export class PickPendStore {
    readonly divStore: BinStore;
    readonly pickPend: PickPend;
    readonly valueSpace: ValueSpace;
    readonly paramsEditing: BinBudsEditing;

    constructor(divStore: BinStore, pickPend: PickPend, valueSpace: ValueSpace) {
        this.divStore = divStore;
        this.pickPend = pickPend;
        this.valueSpace = valueSpace;
        this.paramsEditing = this.createParamsEditing();
        this.paramsEditing.calcAll();
    }

    private createParamsEditing() {
        let { pickParams } = this.pickPend;
        const { sheetStore, entity: entityBin } = this.divStore;
        const { pend: entityPend } = entityBin;
        let { params } = entityPend;
        let ret = new BinBudsEditing(sheetStore, entityBin, params);
        for (let bud of params) {
            let pickParam = pickParams.find(v => v.name === bud.name);
            if (pickParam !== undefined) {
                ret.addFormula(pickParam.name, pickParam.valueSet);
            }
        }
        return ret;
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
                // let { /*bud, prop, */valueSet, valueSetType } = pickParam;
                /*
                if (bud === undefined) debugger;
                let namedResult = this.valueSpace.getValue(bud) as PickResult;
                if (namedResult === undefined) {
                    paramValue = this.paramsEditing.values[id];
                }
                else {
                    if (prop === undefined) prop = 'id';
                    paramValue = namedResult[prop];
                }
                */
                // paramValue = this.paramsEditing.getValue(name);
            } else if (budDataType !== undefined && budDataType.type !== 0 && name !== undefined) {
                // paramValue = this.paramsEditing.getValue(name);
            }
            paramValue = this.paramsEditing.getValue(name);

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
