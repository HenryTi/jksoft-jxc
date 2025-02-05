import { useAtomValue } from "jotai";
// import { DivEditing, BinStore, ValDivBase } from "../../../../Store";
import { FA, setAtomValue } from "tonwa-com";
import { Page, useModal } from "tonwa-app";
import { ViewDivUndo } from "./ViewDivUndo";
import { ViewRow } from "./ViewRow";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";
// import { editDivs, rowEdit } from "../divEdit";
import { TControlDetailEdit } from "./TControlDetailEdit";
import { ValDivBase } from "../../Store/ValDiv";

// 编辑div任意层
export function PageEditDivRoot({ control, valDiv }: { control: TControlDetailEdit; valDiv: ValDivBase; }) {
    const { binStore } = control.controlSheet;
    const { sheetStore } = binStore;
    const { entity, mainStore } = sheetStore;
    return <Page header={`${(entity.caption)} - ${mainStore.no}`}>
        <EditDiv control={control} valDiv={valDiv} />
    </Page>;
}

interface EditDivProps {
    control: TControlDetailEdit;
    // binStore: BinStore;
    valDiv: ValDivBase;
}

function EditDiv(props: EditDivProps) {
    const modal = useModal();
    const { control, valDiv } = props;
    const { binStore } = control.controlSheet;
    const { binDiv, atomDeleted } = valDiv;
    const { level, entityBin, subBinDiv: div } = binDiv;
    const { divLevels, pivot } = entityBin;
    const divs = useAtomValue(valDiv.atomValDivs);
    const deleted = useAtomValue(atomDeleted);
    let bg = divLevels - level - 1;
    let borderTop = ''; // bg > 0 ? 'border-top' : '';
    let cdAddBottom: string;
    let cnDivBottom: string;
    if (div === undefined || div === pivot) {
        cnDivBottom = ' border-bottom ';
        cdAddBottom = '';
    }
    else {
        cnDivBottom = level === 0 ? ' mb-2 ' : ' mb-2 border-bottom ';
        cdAddBottom = ' border-bottom ';
    }
    let viewDivs: any;
    if (divs.length > 0) {
        async function onAddNew() {
            await control.onAddNew(valDiv);
        }
        viewDivs = <div className="ms-4 border-start">
            {
                divs.map(v => <EditDiv key={v.id} {...props} valDiv={v} />)
            }
            <div className={` ps-3 py-2 tonwa-bg-gray-${bg} ${borderTop} ${cdAddBottom} cursor-pointer text-primary`} onClick={onAddNew}>
                <FA name="plus" size="lg" className="me-2" /> {div?.ui?.caption}
            </div>
        </div>;
    }
    async function onDel() {
        setAtomValue(atomDeleted, !deleted);
        control.controlSheet.notifyRowChange();
        if (level === 0) {
            modal.close();
            return;
        }
    }
    const btnDel: DivRightButton = { onClick: onDel, icon: 'trash-o', color: ' text-body-secondary ' }

    if (deleted === true) {
        return <ViewDivUndo control={control} valDiv={valDiv} />;
    }

    let tops: DivRightButton[], bottoms: DivRightButton[];
    if (level === divLevels) {
        async function onEdit() {
            await control.onLeafEdit(valDiv);
        }
        tops = [{
            icon: 'pencil-square-o',
            color: 'text-primary',
            onClick: onEdit,
        }];
        bottoms = [btnDel];
    }
    else {
        bottoms = [{ ...btnDel, className: ' mb-2 ' }];
    }

    let viewDivRightButtons = <ViewDivRightButtons tops={tops} bottoms={bottoms} />;
    return <div className={cnDivBottom}>
        <ViewRow {...props} buttons={viewDivRightButtons} hidePivot={true} />
        {viewDivs}
    </div>
}
