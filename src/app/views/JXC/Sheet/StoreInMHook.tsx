import { UqApp, useUqApp } from "app/UqApp";
import { GSheet, OriginDetail, SheetRow } from "app/tool";
import { ModalSelectContact, ViewItemContact } from "../Atom";
import { Atom, EnumSheet, Sheet } from "uqs/UqDefault";
import { IDView, uqAppModal } from "tonwa-app";
import { Band } from "app/coms";
import { useDetailPend } from "./Detail/Pend/useDetailPend";
import { useSheetAct, usePendFromItem } from "app/hooks";
import { useRef } from "react";
import { EntitySheet } from "app/Biz";
import { ViewPendRow } from "./ViewPendRow";

const sheet = EnumSheet.SheetStoreInMultiStorage;
const caption = '入库单-分仓';
const targetCaption = '往来单位';
function PageStoreInG() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const act = '$';
    const detail = 'detailstorein';
    const entity = biz.entities[sheet] as EntitySheet;
    const { fromPend } = entity.getAct(detail, act);
    const selectPend = usePendFromItem({
        pendName: fromPend.name,
        ViewPendRow,
        caption: '选择待入库',
        placeholderOfSearch: '待入库商品编号名称',
    });
    function ViewTargetBand({ sheet }: { sheet: Sheet; }) {
        return <Band label={targetCaption}>
            <ViewTarget sheet={sheet} />
        </Band>;
    }
    function ViewTarget({ sheet }: { sheet: Sheet; }) {
        return <IDView id={sheet.target} uq={uq} Template={ViewItemContact} />;
    }
    async function selectTarget() {
        const { openModal } = uqAppModal(uqApp);
        let ret = await openModal<Atom>(<ModalSelectContact />);
        return ret;
    }
    async function loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let sheetRows = await selectPend(undefined);
        if (sheetRows === undefined) {
            return undefined;
        }
        let target: number;
        if (selectTarget !== undefined) {
            let targetAtom = await selectTarget(/*'选择仓库'*/);
            target = targetAtom.id;
        }
        let no = await uq.IDNO({ ID: uq.Sheet });
        let sheet: Sheet = {
            no,
            target,
            // phrase, 
            base: undefined,
            operator: undefined,
            value: undefined
        };
        return { sheet, sheetRows };
        /*
        let targetAtom = await selectTarget();
        if (targetAtom === undefined) return;
        let no = await uq.IDNO({ ID: uq.Sheet });
        let main = { no, target: targetAtom.id } as Sheet;
        return { sheet: main, sheetRows: [] };
        */
    }
    const useDetailReturn = useDetailPend({ detail, selectPend });
    const ret = useSheetAct({
        sheet,
        caption,
        targetCaption,
        ViewTargetBand,
        ViewTarget,
        selectTarget,
        loadStart,
        act,
        useDetailReturn,
    });
    return ret;
}
export const gStoreInM: GSheet = {
    sheet,
    caption,
    pageEdit: <PageStoreInG />,
}
