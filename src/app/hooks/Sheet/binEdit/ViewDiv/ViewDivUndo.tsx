import { FA, setAtomValue, wait } from "tonwa-com";
import { ViewRow } from "./ViewRow";
import { ViewDivProps } from "./tool";
import { useCallback, useRef, useState } from "react";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";

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

    const bottoms: DivRightButton[] = [];

    function btn(onClick: () => void, icon: string, iconColor: string, caption: string, captionColor: string) {
        return <div className={'cursor-pointer px-2 ' + iconColor} onClick={onClick}>
            <FA className="me-1" name={icon} fixWidth={true} />
            <span className={captionColor}>{caption}</span>
        </div>
    }

    // function viewRestore() {
    if (deleting === 0) {
        bottoms.push(
            {
                icon: 'undo',
                color: ' text-warning ',
                label: '恢复',
                // labelColor: 'text-info',
                onClick: onRestore,
            },
            {
                icon: 'times',
                color: ' text-body-tertiary ',
                label: '清除',
                onClick: onDelThoroughly
            }
        )
        /*
        return <div className="d-flex flex-column align-items-end w-min-6c text-end pt-2">
            {btn(onRestore, 'undo', ' text-warning ', '恢复', 'text-info')}
            {btn(onDelThoroughly, 'times', ' text-body-tertiary ', '清理', '')}
        </div>;
        */
    }
    else {
        function onCancelDel() {
            refCanceled.current = true;
        }
        bottoms.push({
            icon: 'times',
            color: ' text-secondary ',
            label: '取消',
            onClick: onCancelDel,
        });
    }

    // {viewRestore()}
    // {viewIsDeleting()}
    // <EditRow {...props} deleted={deleted} />

    return <div className="d-flex border-bottom">
        <div className="flex-fill text-body-tetiary opacity-50 text-decoration-line-through">
            <ViewRow {...props} hidePivot={true} />
        </div>
        <ViewDivRightButtons tops={undefined} bottoms={bottoms} />
    </div>;
}
