import { Page, useModal } from "tonwa-app";
import { useCallback } from "react";
import { ModalInputRow } from "./ModalInputRow";
import { Row } from "../SheetStore";
import { RowStore } from "./RowStore";

export function usePickInput() {
    const modal = useModal();
    return useCallback(async (row: Row, rowStore: RowStore) => {
        let ret = await modal.open(<ModalInputRow row={row} rowStore={rowStore} />);
        return ret;
    }, []);
    /*
    async function func(pickResults: NamedResults, binPick: BinPick) {
        let { name, caption, pick } = binPick;
        // let pickBase = pick as PickInput;
        let ret = await modal.open(<PagePickInput />);
        return ret;
    }
    return useCallback(func, []);
    */
}

function PagePickInput() {
    return <Page header="Pick Input">

    </Page>;
}
