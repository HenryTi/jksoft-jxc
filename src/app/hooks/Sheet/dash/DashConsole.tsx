import { EntitySheet } from "app/Biz";
import { Modal } from "tonwa-app";
import { PageSheetNew } from "./PageSheetEntry";
import { SheetConsole, SheetSteps } from "../store";
import { UqExt } from "uqs/UqDefault";

export class DashConsole implements SheetConsole {
    private readonly modal: Modal;
    private uq: UqExt;
    private readonly entitySheet: EntitySheet;
    constructor(modal: Modal, entitySheet: EntitySheet) {
        this.modal = modal;
        this.uq = entitySheet.uq;
        this.entitySheet = entitySheet;
    }
    close(): void {
        this.modal.close();
    }
    restart(): void {
        this.modal.close();
        this.modal.open(<PageSheetNew entitySheet={this.entitySheet} sheetConsole={this} />);
    }
    discard(sheetId: number): void {
        this.modal.close();
    }
    onSheetAdded(sheetId: number, no: string): void {
        alert('sheet add ' + no);
    }
    removeFromCache(sheetId: number): void {
        alert('remove from cache');
    }

    async loadMyDrafts(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let { $page } = await this.uq.GetMyDrafts.page(param, pageStart, pageSize);
        return $page;
    }

    steps: SheetSteps;
}
