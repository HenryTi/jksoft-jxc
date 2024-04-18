import { WritableAtom, atom } from "jotai";
import { NamedResults, PickResult } from "./NamedResults";
import { SheetStore } from "./SheetStore";
import { EntitySheet } from "app/Biz";

export abstract class SheetConsole {
    readonly entitySheet: EntitySheet;

    constructor(entitySheet: EntitySheet) {
        this.entitySheet = entitySheet;
    }

    abstract close(): void;                      // 关闭当前页面
    abstract restart(): void;                    // 关闭并新开单
    abstract discard(sheetId: number): void;     // 废弃当前单据
    abstract onSheetAdded(store: SheetStore/*sheetId: number, no: string*/): Promise<void>;
    abstract sheetRowCountChanged(store: SheetStore): void;
    abstract removeFromCache(sheetId: number): void;
    abstract steps: SheetSteps;
    createSheetStore() {
        return new SheetStore(this.entitySheet, this);
    }

    picks: PickStates;
}

export interface SheetSteps {
    steps: string[];
    step: number;
    end: string;
}

export class PickStates {
    readonly atomPickedResults: WritableAtom<NamedResults, any, any>;
    readonly atomRearPickResult: WritableAtom<PickResult, any, any>;
    readonly atomCur: WritableAtom<number, any, any>;
    constructor(namedResults: NamedResults, rearPickResult: PickResult, cur: number) {
        this.atomPickedResults = atom(namedResults);
        this.atomRearPickResult = atom(rearPickResult);
        this.atomCur = atom(cur);
    }
}
