import { GenProps } from "app/tool";
import { useUqApp } from "app/UqApp";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { PageSheetEditOld } from "../PageSheetEditOld";
import { GenDerive } from "./GenDerive";

export function PageDeriveEdit({ Gen }: GenProps<GenDerive>) {
    const sheet: any = {};
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { genEditing: editing, ModalSheetStart } = gen;
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
            let sheetOriginId = await openModal(<ModalSheetStart Gen={Gen} />);
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
    return <PageSheetEditOld Gen={Gen} sheet={sheet} onEditRow={onEditRow} onAddRow={onAddRow} />;
}
