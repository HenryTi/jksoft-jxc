import { useAtomValue } from "jotai";
import { BinStore, ValDiv } from "../BinEditing";
import { useState } from "react";

export function ViewBinDivs({ binStore, editable }: { binStore: BinStore; editable: boolean; }) {
    const [redraw, setRedraw] = useState(false);
    function onRedraw() {
        setRedraw(!redraw);
    }
    return <div>
        <ViewDivs div={binStore.valDiv} editable={editable} />
        <button className="btn btn-primary" onClick={onRedraw}>刷新</button>
    </div>;
}

function ViewDivs({ div, editable, className }: { div: ValDiv; editable: boolean; className?: string; }) {
    const divs = useAtomValue(div.atomDivs);
    return <div className={className}>
        {divs.map(v => <ViewDiv key={v.id} div={v} editable={editable} />)}
    </div>;
}

function ViewDiv({ div, editable }: { div: ValDiv; editable: boolean; }) {
    const { atomValRow, atomDivs } = div;
    return <div>
        {atomValRow && <ViewRow div={div} editable={editable} />}
        {atomDivs && <ViewDivs div={div} editable={editable} className="ms-5" />}
    </div>
}

function ViewRow({ div, editable }: { div: ValDiv; editable: boolean; }) {
    const { level, atomValRow } = div;
    const val = useAtomValue(atomValRow);
    return <div>
        <div className="px-3 py-2">level: {level} - {JSON.stringify(val)}</div>
    </div>
}