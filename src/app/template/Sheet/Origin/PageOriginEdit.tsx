import { useAtomValue } from "jotai";
import { useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { PartProps } from "../../Part";
import { PartOrigin } from "./PartOrigin";
import { PageSheetEdit } from "../PageSheetEdit";
import { useNavigate, useParams } from "react-router-dom";
import { Sheet } from "uqs/UqDefault";

export function PageOriginEdit({ Part }: PartProps<PartOrigin>) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const part = uqApp.objectOf(Part);
    const { editing
        , ModalSheetStart, PageDetailItemSelect, PageSheetDetail
        , buildDetailFromSelectedItem
    } = part;
    const { atomSheet } = editing;
    const sheet = useAtomValue(atomSheet) as Sheet;
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
        //let ret = 
        await openModal(<PageSheetDetail detail={detail} Part={Part} />);
        /*
        if (!ret) {
            closeModal();
            return;
        }
        let { quantity } = ret;
        if (Number.isNaN(quantity) === true) {
            closeModal();
            return;
        }
        let value = { ...detail, ...ret }; //, sheet: sheet.id };
        // let id = 
        await editing.setDetail(value);
        */
        // value.id = id;
        /*
        let id = await uq.ActID({
            ID: IDDetail,
            value,
        });
        value.id = id;
        editing.addDetail(value);
        */
        onAddRow();
    }

    async function onEditRow(detail: any) {
        let ret = await openModal(<PageSheetDetail detail={detail} Part={Part} />);
        if (ret === undefined) return;
        let newDetail = { ...detail, ...ret }
        let retId = await editing.setDetail(newDetail);
        if (retId > 0) {
            detail.id = retId;
        }
    }
    return <PageSheetEdit Part={Part} onAddRow={onAddRow} onEditRow={onEditRow} sheet={sheet} />;
}
