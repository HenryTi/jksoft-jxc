import { useAtomValue } from "jotai";
import { DetailMain, DetailRow, DetailSection } from "./SheetStore";
import { FA, LMR } from "tonwa-com";
import { useModal } from "tonwa-app";
import { PageInputRow } from "./PageInputRow";

export function ViewDetail({ detail }: { detail: DetailMain; }) {
    const sections = useAtomValue(detail.sections);
    const { caption } = detail;
    return <div>
        <div className="py-1 px-3 tonwa-bg-gray-2">{caption}</div>
        <div>
            {sections.map(v => <ViewSection key={v.keyId} section={v} />)}
        </div>
    </div>
}

function ViewSection({ section }: { section: DetailSection }) {
    const { openModal } = useModal();
    const rows = useAtomValue(section.rows);
    async function onClick() {
        let ret = await openModal(<PageInputRow />);
        section.addRow(ret);
    }
    return <div className="border-top">
        <LMR className="tonwa-bg-gray-1 pt-1 px-3">
            <div>section</div>
            <button className="btn btn-sm btn-link" onClick={onClick}><FA name="plus" /></button>
        </LMR>
        {rows.map(v => <ViewRow key={v.keyId} row={v} />)}
    </div>
}

function ViewRow({ row }: { row: DetailRow }) {
    const { value } = row
    return <div className="px-3 py-2">
        {row.keyId} {value}
    </div>
}