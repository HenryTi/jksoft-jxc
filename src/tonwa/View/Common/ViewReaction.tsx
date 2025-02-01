import { WritableAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import { FA, setAtomValue, useEffectOnce } from "tonwa-com";

interface Props {
    className?: string;
    atomContent: WritableAtom<any, any, any>;
    delay?: number;
}

export function ViewReaction({ className, atomContent, delay }: Props) {
    let content = useAtomValue(atomContent);
    if (content === undefined) return null;
    function ViewReactionContent() {
        let refTimeOut = useRef(undefined);
        useEffectOnce(() => {
            if (delay === undefined) delay = 2;
            if (delay < 0) return;
            refTimeOut.current = setTimeout(() => {
                setAtomValue(atomContent, undefined);
            }, (delay) * 1000);

        });
        function onClose() {
            clearTimeout(refTimeOut.current);
            setAtomValue(atomContent, undefined);
        }
        return <div className={'px-3 py-2 d-inline-block rounded border bg-warning-subtle text-primary ' + (className ?? '')}>
            {content}
            <span onClick={onClose}>
                <FA className="ms-3 cursor-pointer" name="times-circle" />
            </span>
        </div>;
    }
    return <ViewReactionContent />
}
