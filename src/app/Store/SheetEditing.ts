import { BudEditing } from "app/hooks";
import { BinBudsEditing, BinEditing } from "./BinEditing";
import { SheetConsole, SheetStore } from "./SheetStore";

export class SheetEditing {
    readonly sheetStore: SheetStore;
    readonly budsEditing: BinBudsEditing;
    readonly budEditings: BudEditing[];

    constructor(sheetConsole: SheetConsole) {
        this.sheetStore = new SheetStore(sheetConsole);
        this.budsEditing = new BinEditing(this.sheetStore, this.sheetStore.mainStore.entity);
        this.budEditings = this.budsEditing.createBudEditings();
    }
}
