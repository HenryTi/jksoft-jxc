import { useCallback } from "react";
import { CoreDetail, Row, Section } from "./SheetStore";
import { useModal } from "tonwa-app";
import { ModalInputRow } from "./ModalInputRow";
import { RowStore, useBinPicks } from "./binPick";

export function useCoreDetailAdd(coreDetail: CoreDetail) {
    const { openModal } = useModal();
    const { entityBin } = coreDetail;
    const pick = useBinPicks(entityBin);
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
                let rowStore = new RowStore(entityBin);
                rowStore.init(rowProps);
                let values = rowStore.binDetail;
                let sec = new Section(coreDetail);
                coreDetail.addSection(sec);
                if (values.value === undefined) values.value = 0;
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
            const rowStore = new RowStore(entityBin);
            rowStore.init(picked);
            let ret = await openModal(<ModalInputRow row={row} rowStore={rowStore} />);
            if (ret === true) {
                Object.assign(row.props, rowStore.binDetail);
                await row.addToSection();
            }
        }
    }
    return useCallback(addNewDirect, []);
}
