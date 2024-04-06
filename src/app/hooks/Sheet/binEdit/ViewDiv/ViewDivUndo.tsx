import { FA, setAtomValue, wait } from "tonwa-com";
import { ViewRow } from "./ViewRow";
import { ViewDivProps } from "./tool";
import { useCallback, useRef, useState } from "react";

export function ViewDivUndo(props: ViewDivProps) {
    const { divStore, valDiv } = props;
    const { atomDeleted } = valDiv;
    let [deleting, setDeleting] = useState(0);
    const refCanceled = useRef(false);
    const onRestore = async function () {
        setAtomValue(atomDeleted, false);
    };
    const onDelThoroughly = useCallback(async function onDelThoroughly() {
        // 延迟一段时间删除的代码，还蛮难写的，以后再说
        let delay = 200;
        for (let i = delay; i >= 0; i--) {
            await wait(10);
            if (refCanceled.current === true) {
                refCanceled.current = false;
                setDeleting(0);
                return;
            }
            setDeleting(i);
        }
        await divStore.delValDiv(valDiv);
    }, []);

    function btn(onClick: () => void, icon: string, iconColor: string, caption: string, captionColor: string) {
        return <div className={'cursor-pointer px-2 ' + iconColor} onClick={onClick}>
            <FA className="me-1" name={icon} fixWidth={true} />
            <span className={captionColor}>{caption}</span>
        </div>
    }

    function viewIsDeleting() {
        if (deleting === 0) return null;
        function onCancelDel() {
            refCanceled.current = true;
        }
        return <div className="bg-tonwa-gray-2 border-start d-flex flex-column align-items-center w-min-6c">
            <div className="my-2">
                <FA name='spinner' spin={true} className="me-2" /> {(deleting / 100).toFixed(1)}秒
            </div>
            {btn(onCancelDel, 'times', ' text-secondary ', '取消', '')}
        </div>;
    }

    function viewRestore() {
        if (deleting !== 0) return null;
        return <div className="d-flex flex-column align-items-end w-min-6c text-end pt-2">
            {btn(onRestore, 'undo', ' text-warning ', '恢复', 'text-info')}
            {btn(onDelThoroughly, 'times', ' text-body-tertiary ', '删除', '')}
        </div>;
    }

    // <EditRow {...props} deleted={deleted} />
    return <div className="d-flex border-bottom">
        <div className="flex-fill text-body-tetiary opacity-50 text-decoration-line-through">
            <ViewRow {...props} hidePivot={true} />
        </div>
        {viewRestore()}
        {viewIsDeleting()}
    </div>;
}
