import { BinPick } from "app/Biz";
import { SheetStore } from "./SheetStore";

export type PickResult = { [prop: string]: any };
export interface NamedResults {
    [name: string]: PickResult;
}

export interface ReturnUseBinPicks {
    namedResults: NamedResults;
    rearBinPick: BinPick;           // rear pick = the endmost pick
    rearResult: PickResult[];
    rearPickResultType: RearPickResultType;
};

export enum RearPickResultType {
    scalar,
    array,
}

export type PickFunc = (sheetStore: SheetStore, rearPickResultType: RearPickResultType) => Promise<ReturnUseBinPicks>;
