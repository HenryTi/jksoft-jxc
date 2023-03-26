import { PartProps } from "app/template/Part";
import { useUqApp } from "app/UqApp";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { PageSheetEdit } from "../PageSheetEdit";
import { PartDerive } from "./PartDerive";

export function PageDeriveEdit({ Part }: PartProps<PartDerive>) {
    const sheet: any = {};
    const uqApp = useUqApp();
    const part = uqApp.objectOf(Part);
    const { editing, ModalSheetStart } = part;
    const { openModal } = useModal();
    const navigate = useNavigate();
    const { id: paramId } = useParams();
    useEffectOnce(() => {
        (async function () {
            if (paramId !== undefined) {
                let sheetDeriveId = Number(paramId);
                if (Number.isNaN(sheetDeriveId) === false) {
                    await editing.load(sheetDeriveId);
                    return;
                }
            }
            let sheetOriginId = await openModal(<ModalSheetStart Part={Part} />);
            if (sheetOriginId === undefined) {
                navigate(-1);
                return;
            }
            editing.reset();
            await editing.loadOrigin(sheetOriginId);
        })();
    });
    async function onAddRow() {
    }
    async function onEditRow(row: any) {
    }
    return <PageSheetEdit Part={Part} sheet={sheet} onEditRow={onEditRow} onAddRow={onAddRow} />;
}
