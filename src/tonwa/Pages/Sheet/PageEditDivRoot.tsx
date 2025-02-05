import { useAtomValue } from "jotai";
// import { DivEditing, BinStore, ValDivBase } from "../../../../Store";
import { FA, setAtomValue } from "tonwa-com";
import { Page, useModal } from "tonwa-app";
import { ViewDivUndo } from "./ViewDivUndo";
import { ViewRow } from "./ViewRow";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";
// import { editDivs, rowEdit } from "../divEdit";
import { TControllerDetailEdit } from "./TControlDetailEdit";
import { ValDivBase } from "../../Store/ValDiv";

// 编辑div任意层
export function PageEditDivRoot({ controller, valDiv }: { controller: TControllerDetailEdit; valDiv: ValDivBase; }) {
    const { binStore } = controller.controlSheet;
    const { sheetStore } = binStore;
    const { entity, mainStore } = sheetStore;
    return <Page header={`${(entity.caption)} - ${mainStore.no}`}>
        <EditDiv controller={controller} valDiv={valDiv} />
    </Page>;
}

interface EditDivProps {
    controller: TControllerDetailEdit;
    // binStore: BinStore;
    valDiv: ValDivBase;
}

function EditDiv(props: EditDivProps) {
    const modal = useModal();
    const { controller, valDiv } = props;
    const { binStore } = controller.controlSheet;
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
            await controller.onAddNew(valDiv);
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
        const { sheetStore } = binStore;
        sheetStore.notifyRowChange();
        if (level === 0) {
            modal.close();
            return;
        }
    }
    const btnDel: DivRightButton = { onClick: onDel, icon: 'trash-o', color: ' text-body-secondary ' }

    if (deleted === true) {
        return <ViewDivUndo controller={controller} valDiv={valDiv} />;
    }

    let tops: DivRightButton[], bottoms: DivRightButton[];
    if (level === divLevels) {
        async function onEdit() {
            await controller.onLeafEdit(valDiv);
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
