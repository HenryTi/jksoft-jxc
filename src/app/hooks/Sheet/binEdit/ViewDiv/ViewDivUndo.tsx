import { FA, setAtomValue } from "tonwa-com";
import { DivStore, ValDiv } from "../../store";
import { useModal } from "tonwa-app";
import { useAtomValue } from "jotai";

interface Props {
    divStore: DivStore;
    valDiv: ValDiv;
    viewRow: JSX.Element;
}

export function ViewDivUndo(props: Props) {
    const modal = useModal();
    const { divStore, valDiv, viewRow } = props;
    const { atomValDivs, binDiv, atomDeleted } = valDiv;
    const { level, entityBin, div } = binDiv;
    const deleted = useAtomValue(atomDeleted);

    async function onDel() {
        setAtomValue(atomDeleted, !deleted);
        if (level === 0) {
            modal.close();
            return;
        }
    }
    async function onDelThoroughly() {
        await divStore.delValDiv(valDiv);
    }

    function btn(onClick: () => void, icon: string, iconColor: string, caption: string, captionColor: string) {
        return <div className={'cursor-pointer px-2 ' + iconColor} onClick={onClick}>
            <FA className="me-1" name={icon} fixWidth={true} />
            <span className={captionColor}>{caption}</span>
        </div>
    }

    function btnDel(icon: string, caption?: string) {
        return btn(onDel, icon, ' text-body-secondary ', caption, '');
    }

    // <EditRow {...props} deleted={deleted} />
    return <div className="d-flex border-bottom">
        <div className="flex-fill text-body-tetiary opacity-50 text-decoration-line-through">
            {viewRow}
        </div>
        <div className="w-min-6c text-end pt-2">
            {btnDel('undo', '恢复')}
            {btn(onDelThoroughly, 'times', ' text-warning ', '删除', 'text-info')}
        </div>
    </div>;
}
