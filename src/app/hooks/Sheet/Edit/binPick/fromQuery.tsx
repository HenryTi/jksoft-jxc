import { BinPick, PickQuery } from "app/Biz";
import { useCallback } from "react";
import { PickResults } from "./useBinPicks";
import { Page, useModal } from "tonwa-app";

export function usePickFromQuery() {
    const modal = useModal();
    return useCallback(async function pickFromQuery(pickResults: PickResults, binPick: BinPick): Promise<any> {
        let { name, caption, pick } = binPick;
        let pickBase = pick as PickQuery;
        function onPick() {
            modal.close({ name, caption });
        }
        let ret = await modal.open(<Page header={caption ?? name} >
            <div className="p-3">
                <button className="btn btn-primary" onClick={onPick}>选择</button>
            </div>
        </Page>);
        return ret;
    }, []);
}
