import { BinPick } from "tonwa";
import { PickResult } from "app/hooks/Calc";
import { ChangeEvent, KeyboardEvent, FocusEvent, useRef, useEffect, MouseEvent } from "react";
import { FA } from "tonwa-com";

interface Scalar {
    value: any;
    close: () => void;
    onKeyDown(e: KeyboardEvent<HTMLInputElement>): Promise<void>;
    onChange(e: ChangeEvent<HTMLInputElement>): Promise<void>;
    onBlur(): Promise<void>;
}

function useScalar(onPicked: (result: any) => void, value: any) {
    const refScalar = useRef<Scalar>({
        value,
        close,
        onKeyDown,
        onChange,
        onBlur,
    });
    function close(): void {
        const { current } = refScalar;
        let result = current.value;
        if (result !== undefined) {
            if (typeof result === 'string') {
                if ((result as string).trim().length === 0) result = undefined;
            }
        }
        onPicked(result);
    }
    async function onKeyDown(e: KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.key !== 'Enter') return;
        close();
    }
    async function onChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
        refScalar.current.value = e.currentTarget.value;
    }
    async function onBlur() {
        close();
    }
    return refScalar.current;
}

export function InputScalar({ binPick, value, onPicked }: { binPick: BinPick; value: any; onPicked: (result: any) => void; }) {
    const refInput = useRef<HTMLInputElement>(undefined);
    const { onKeyDown, onChange, onBlur } = useScalar(onPicked, value);
    const { caption } = binPick;
    useEffect(() => {
        refInput.current.focus();
    });
    function onMouseUp(e: MouseEvent<HTMLInputElement>) {
        e.currentTarget.focus();
    }
    return <div className="input-group ">
        <input ref={refInput} className="form-control" type="text"
            onKeyDown={onKeyDown}
            onChange={onChange}
            onBlur={onBlur}
            onMouseUp={onMouseUp}
            defaultValue={value}
            placeholder={'请输入' + caption} />
        <div className="input-group-text cursor-pointer text-info" onClick={onBlur}>
            <FA name="reply" flip="vertical" />
        </div>
    </div>;
}
