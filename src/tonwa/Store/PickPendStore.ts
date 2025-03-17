import { BinBudsEditing } from "../Control/ControlBuds/BinEditing";
import { EnumBudType, PendQuery, PickPend, ValueSetType } from "../Biz";
import { contentFromDays } from "../tools";
import { BinStore } from "./BinStore";

export class PickPendStore {
    readonly binStore: BinStore;
    readonly pickPend: PickPend;
    readonly paramsEditing: BinBudsEditing;
    private readonly pendQuery: PendQuery;

    constructor(binStore: BinStore, pickPend: PickPend, pendQueryId: number) {
        this.binStore = binStore;
        this.pickPend = pickPend;
        const { queries } = this.pickPend.from;
        if (pendQueryId === undefined) {
            this.pendQuery = queries[0];
        }
        else {
            this.pendQuery = queries.find(v => v.id = pendQueryId);
        }
        this.paramsEditing = this.createParamsEditing();
        this.paramsEditing.calcAll();
    }

    private createParamsEditing() {
        let { pickParams } = this.pickPend;
        const { sheetStore, entity: entityBin } = this.binStore;
        const { pend: entityPend } = entityBin;
        let { params } = this.pendQuery;
        let ret = new BinBudsEditing(sheetStore, entityBin, params);
        for (let bud of params) {
            let pickParam = pickParams.find(v => v.name === bud.name);
            if (pickParam !== undefined) {
                ret.addFormula(pickParam.name, pickParam.valueSet, pickParam.valueSetType === ValueSetType.init);
            }
        }
        return ret;
    }

    async searchPend() {
        let params: { [budId: number]: number | string } = {};
        let { entity: { pend: entityPend } } = this.binStore;
        const { pickParams } = this.pickPend;
        const { params: queryParams } = this.pendQuery; // entityPend;
        for (let param of queryParams) {
            let paramValue: any = undefined;
            let { id, name, budDataType } = param;
            let pickParam = pickParams?.find(v => v.name === name);
            if (pickParam !== undefined) {
            } else if (budDataType !== undefined && budDataType.type !== 0 && name !== undefined) {
                // paramValue = this.paramsEditing.getValue(name);
            }
            paramValue = this.paramsEditing.getBudValue(param); // .values.buds[id];
            // radio 值是数组，需要变成单值
            switch (budDataType.type) {
                case EnumBudType.radio:
                    if (Array.isArray(paramValue) === true) {
                        paramValue = Number(paramValue[0]);
                        if (Number.isNaN(paramValue) === true || paramValue === 0) {
                            paramValue = undefined;
                        }
                    }
                    break;
                case EnumBudType.date:
                    paramValue = contentFromDays(paramValue);
                    break;
            }
            params[id] = paramValue;
        }
        await this.binStore.searchPend(params);
    }
}
