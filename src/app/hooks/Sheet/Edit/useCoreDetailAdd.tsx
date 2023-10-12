import { useCallback } from "react";
import { CoreDetail, Row, Section, BinDetail } from "./SheetStore";
import { useModal } from "tonwa-app";
import { usePick } from "app/hooks/BizPick";
import { ModalInputRow } from "./ModalInputDirect";
import { ModalInputPend } from "./ModalInputPend";

export function useCoreDetailAdd(coreDetail: CoreDetail) {
    const { openModal } = useModal();
    const pick = usePick();
    const { entityDetail } = coreDetail;
    const { pend, i, x } = entityDetail;

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
        /*
        let sec: Section;
        for (let ig of iGroup) {
            if (sec === undefined || sec.i !== ig) {
                if (section !== undefined && section.i === ig) {
                    sec = section;
                }
                else {
                    sec = new Section(coreDetail);
                    coreDetail.addSection(sec);
                }
            }
            let group = iColl[ig];
            for (let g of group) {
                let { i, x } = g;
                let rows = getAtomValue(sec._rows);
                let row = rows.find(v => {
                    let vx = v.props.x;
                    return vx === x;
                });
                if (row === undefined) {
                    row = new Row(sec);
                    row.setValue(g);
                    rows.push(row);
                    setAtomValue(sec._rows, [...rows])
                }
            }
        }
        */
    }

    // if no detailSection add new, else edit
    async function addNewDirect() {
        let section = new Section(coreDetail);
        let row = new Row(section);
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

        coreDetail.addSection(section);
        await openModal(<ModalInputRow row={row} />);
        await row.addToSection();
    }
    return useCallback(pend !== undefined ? addNewFromPend : addNewDirect, []);
}
