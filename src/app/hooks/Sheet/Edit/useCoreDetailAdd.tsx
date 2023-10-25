import { useCallback } from "react";
import { CoreDetail, Row, Section, BinDetail } from "./SheetStore";
import { Page, useModal } from "tonwa-app";
import { ModalInputRow } from "./ModalInputRow";
import { useBinPicks } from "./binPick";

/*
type PickResult = { [prop: string]: any };
interface PickResults {
    [name: string]: PickResult;
}
*/
export function useCoreDetailAdd(coreDetail: CoreDetail) {
    const { openModal } = useModal();
    // const pick = usePick();
    const { entityBin } = coreDetail;
    const { pend } = entityBin;
    const pick = useBinPicks(entityBin);
    /*
    // if no detailSection add new, else edit
    async function addNewFromPend() {
        let inputed = await openModal<BinDetail[]>(<ModalInputPend propPend={pend} />);
        if (inputed === undefined) return;
        let iArr: BinDetail[] = [];
        let iGroup: number[] = [];
        let iColl: { [i: number]: BinDetail[] } = {};
        for (let r of inputed) {
            let { i, x } = r;
            if (x === undefined) {
                iArr.push(r);
            }
            else {
                let group = iColl[i];
                if (group === undefined) {
                    group = [r];
                    iColl[i] = group;
                    iGroup.push(i);
                }
                else {
                    group.push(r);
                }
            }
        }
        await addNewArr();
        await addNewGroup();
        async function addNewArr() {
            for (let rowProps of iArr) {
                let sec = new Section(coreDetail);
                coreDetail.addSection(sec);
                await sec.addRowProps(rowProps);
            }
        }
        async function addNewGroup() {

        }
    }
    */
    // if no detailSection add new, else edit
    async function addNewDirect() {
        let section = new Section(coreDetail);
        let row = new Row(section);

        let pickResults = await pick(coreDetail);
        if (pickResults === undefined) return;

        /*
        let retI = await pick(i);
        if (retI === undefined) return;
        let { spec } = retI;
        row.props.i = spec;

        if (x !== undefined) {
            let retX = await pick(x);
            if (retX === undefined) return;
            let { spec } = retX;
            row.props.x = spec;
        }
        */
        // row.props.i = pickResults['pickspec']?.id;

        coreDetail.addSection(section);
        await openModal(<ModalInputRow row={row} picked={pickResults} />);
        await row.addToSection();
    }
    //return useCallback(pend !== undefined ? addNewFromPend : addNewDirect, []);
    return useCallback(addNewDirect, []);
}
