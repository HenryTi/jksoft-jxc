import { useAtomValue } from "jotai";
import { useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { GenProps } from "app/tool";
import { GenOrigin } from "./GenOrigin";
import { PageSheetEdit } from "../PageSheetEdit";
import { useNavigate, useParams } from "react-router-dom";
import { Sheet } from "uqs/UqDefault";

export function PageOriginEdit({ Gen }: GenProps<GenOrigin>) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const gen = uqApp.objectOf(Gen);
    const { genEditing: editing
        , ModalSheetStart, ModalSelectDetailAtom, PageSheetDetail
        , buildDetailFromSelectedAtom
    } = gen;
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
            let ret = await openModal<number>(<ModalSheetStart Gen={Gen} />);
            if (ret === undefined) {
                navigate(-1);
            }
        })();
    });

    async function onAddRow() {
        let selectedItem = await openModal(<ModalSelectDetailAtom />);
        if (selectedItem === undefined) return;
        // 新建一个detail
        let detail = buildDetailFromSelectedAtom(selectedItem);
        //let ret = 
        await openModal(<PageSheetDetail detail={detail} Gen={Gen} />);
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
        let ret = await openModal(<PageSheetDetail detail={detail} Gen={Gen} />);
        if (ret === undefined) return;
        let newDetail = { ...detail, ...ret }
        let retId = await editing.setDetail(newDetail);
        if (retId > 0) {
            detail.id = retId;
        }
    }
    return <PageSheetEdit Gen={Gen} onAddRow={onAddRow} onEditRow={onEditRow} sheet={sheet} />;
}
