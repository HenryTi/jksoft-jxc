import { useAtomValue } from "jotai";
import { useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { PartProps } from "../../Part";
import { PartOrigin } from "./PartOrigin";
import { DetailBase, DetailQuantityBase, SheetBase } from "../PartSheet";
import { PageSheetEdit } from "../PageSheetEdit";
import { useNavigate, useParams } from "react-router-dom";

export function PageOriginEdit<S extends SheetBase, D extends DetailQuantityBase>({ Part }: PartProps<PartOrigin<S, D>>) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const part = uqApp.partOf(Part);
    const { editing, uq
        , IDDetail
        , ModalSheetStart, PageDetailItemSelect, PageSheetDetail
        , buildDetailFromSelectedItem
    } = part;
    const { atomSheet } = editing;
    const sheet = useAtomValue(atomSheet) as S;
    const { id: paramId } = useParams();
    const { openModal, closeModal } = useModal();

    useEffectOnce(() => {
        (async function () {
            editing.reset();
            let sheetId = Number(paramId);
            if (Number.isNaN(sheetId) === false) {
                await editing.load(sheetId);
                return;
            }
            let ret = await openModal<number>(<ModalSheetStart Part={Part} />);
            if (ret === undefined) {
                navigate(-1);
            }
        })();
    });

    async function onAddRow() {
        let selectedItem = await openModal(<PageDetailItemSelect />);
        if (selectedItem === undefined) return;
        // 新建一个detail
        let detail = buildDetailFromSelectedItem(selectedItem);
        let ret = await openModal(<PageSheetDetail detail={detail} Part={Part} />);
        if (!ret) {
            closeModal();
            return;
        }
        let { quantity } = ret;
        if (Number.isNaN(quantity) === true) {
            closeModal();
            return;
        }
        let value = { ...detail, ...ret, sheet: sheet.id };
        let id = await uq.ActID({
            ID: IDDetail,
            value,
        });
        value.id = id;
        editing.addDetail(value);
        onAddRow();
    }

    async function onEditRow(row: any) {
        let ret = await openModal(<PageSheetDetail detail={row} Part={Part} />);
        let newDetail = { ...row, sheet: sheet.id, ...ret }
        let retId = editing.setDetail(newDetail);
        row.id = retId;
        /*
        await uq.ActID({
            ID: IDDetail,
            value: newDetail
        });
        editing.updateDetail(newDetail);
        */
    }
    return <PageSheetEdit Part={Part} onAddRow={onAddRow} onEditRow={onEditRow} sheet={sheet} />;
}
