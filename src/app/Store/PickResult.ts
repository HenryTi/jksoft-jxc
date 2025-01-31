import { BinPick } from "tonwa";
import { PickResult } from "app/hooks/Calc";
import { FormBudsStore } from "./BinEditing";

/*
export interface NamedResults {
    [name: string]: PickResult;
}
*/
/*
export type PickResult = { [prop: string]: any };
*/
export interface ReturnUseBinPicks {
    editing: FormBudsStore;
    // namedResults: NamedResults;
    rearBinPick: BinPick;           // rear pick = the endmost pick
    rearResult: PickResult[];
    rearPickResultType: RearPickResultType;
};

export enum RearPickResultType {
    scalar,
    array,
}

// export type PickFunc = (sheetStore: SheetStore, bin: EntityBin, rearPickResultType: RearPickResultType) => Promise<ReturnUseBinPicks>;
/*
export class PickStates {
    // readonly atomPickedResults: WritableAtom<NamedResults, any, any>;
    readonly atomRearPickResult: WritableAtom<PickResult, any, any>;
    readonly atomCur: WritableAtom<number, any, any>;
    constructor(namedResults: NamedResults, rearPickResult: PickResult, cur: number) {
        // this.atomPickedResults = atom(namedResults);
        this.atomRearPickResult = atom(rearPickResult);
        this.atomCur = atom(cur);
    }
}
*/