import { useCallback } from "react";
import { CoreDetail, Row, Section, BinDetail } from "./SheetStore";
import { Page, useModal } from "tonwa-app";
import { ModalInputRow } from "./ModalInputRow";
import { RowStore, useBinPicks } from "./binPick";

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
    // const { pend } = entityBin;
    const pick = useBinPicks(entityBin);
    // if no detailSection add new, else edit
    async function addNewDirect() {
        let pickResults = await pick();
        const { props: picked, arr, group } = pickResults;

        function convertRowProps(props: any) {
            let ret: { [name: string]: any } = {};
            let pickName: string;
            for (let i in props) {
                if (i === '$') continue;
                let v = props[i];
                let nv: any;
                if (typeof v === 'object') {
                    const { name, value } = v;
                    if (i === name) {
                        nv = value;
                    }
                    else {
                        pickName = name;
                        nv = value?.id;
                    }
                    if (i === undefined) debugger;
                }
                else {
                    nv = v;
                }
                ret[i] = nv;
            }
            return { [pickName]: ret };
        }
        async function addNewArr() {
            if (coreDetail === undefined) {
                alert('Pick Pend on main not implemented');
                return;
            }
            for (let rowProps of arr) {
                rowProps = convertRowProps(rowProps);
                let rowStore = new RowStore(entityBin, {} as BinDetail, rowProps);
                rowStore.calc.run(undefined);
                let values = rowStore.getValues();
                let sec = new Section(coreDetail);
                coreDetail.addSection(sec);
                // await sec.addRowProps(rowProps);
                await sec.addRowProps(values as any);
            }
        }
        async function addNewGroup() {

        }
        if (arr.length > 0) {
            await addNewArr();
            await addNewGroup();
        }
        else {
            let section = new Section(coreDetail);
            let row = new Row(section);
            coreDetail.addSection(section);
            const binDetail: BinDetail = {} as any;
            const rowStore = new RowStore(entityBin, binDetail, picked);
            rowStore.calc.run(undefined);
            await openModal(<ModalInputRow row={row} rowStore={rowStore} />);
            await row.addToSection();
        }
    }
    //return useCallback(pend !== undefined ? addNewFromPend : addNewDirect, []);
    return useCallback(addNewDirect, []);
}
