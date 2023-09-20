import { useCallback } from "react";
import { Page, useModal } from "tonwa-app";

export function usePick() {
    const { openModal, closeModal } = useModal();
    async function pick(pickName: string) {
        function onPick() {
            let retValue = 3;
            closeModal(`${pickName} picked ${retValue}`);
        }
        let ret = await openModal(<Page header="pick">
            <button className="btn btn-primary m-3" onClick={onPick}>Pick</button>
        </Page>);
        return ret;
    }
    return useCallback(pick, []);
}
