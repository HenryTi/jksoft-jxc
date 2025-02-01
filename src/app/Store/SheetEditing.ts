import { BudEditing } from "app/hooks";
import { BinBudsEditing, BinEditing } from "./BinEditing";
import { SheetConsole, StoreSheet } from "./SheetStore";

export class SheetEditing {
    readonly sheetStore: StoreSheet;
    readonly budsEditing: BinBudsEditing;
    readonly budEditings: BudEditing[];

    constructor(sheetConsole: SheetConsole) {
        this.sheetStore = new StoreSheet(sheetConsole);
        this.budsEditing = new BinEditing(this.sheetStore, this.sheetStore.mainStore.entity);
        this.budEditings = this.budsEditing.createBudEditings();
    }
}
