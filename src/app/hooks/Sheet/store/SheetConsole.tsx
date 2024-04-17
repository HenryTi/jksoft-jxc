export interface SheetConsole {
    close(): void;                      // 关闭当前页面
    restart(): void;                    // 关闭并新开单
    discard(sheetId: number): void;     // 废弃当前单据
    onSheetAdded(sheetId: number, no: string): void;
    removeFromCache(sheetId: number): void;
    steps: SheetSteps;
}

export interface SheetSteps {
    steps: string[];
    step: number;
    end: string;
}
