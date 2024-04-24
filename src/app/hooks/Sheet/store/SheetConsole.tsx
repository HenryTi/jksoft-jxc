import { PickStates } from "./NamedResults";
import { SheetStore } from "./SheetStore";
import { EntitySheet } from "app/Biz";
import { Modal } from "tonwa-app";

export abstract class SheetConsole {
    protected readonly modal: Modal;
    readonly entitySheet: EntitySheet;

    constructor(modal: Modal, entitySheet: EntitySheet) {
        this.modal = modal;
        this.entitySheet = entitySheet;
    }

    abstract close(): void;                      // 关闭当前页面
    abstract restart(): void;                    // 关闭并新开单
    abstract onSubmited(store: SheetStore): Promise<void>;        // 单据已提交
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
