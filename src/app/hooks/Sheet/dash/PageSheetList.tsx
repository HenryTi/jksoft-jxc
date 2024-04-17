import { EntitySheet } from "app/Biz";
import { Page } from "tonwa-app";
import { SheetConsole } from "../store";

export function PageSheetList({ entitySheet, sheetConsole }: { entitySheet: EntitySheet; sheetConsole: SheetConsole; }) {
    const { caption, name, uq, biz } = entitySheet;
    return <Page header={(caption ?? name) + ' - 已提交'}>
        <div className="m-3">
            正在实现中...
        </div>
    </Page>;
}