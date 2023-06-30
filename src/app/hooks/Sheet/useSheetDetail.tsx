import { EditingRow, SheetRow } from "app/tool";
import { Atom, Detail } from "uqs/UqDefault";
import { Editing } from "./useEditing";
// import { GenAtomSpec } from "../BizAtomSpec";

export interface OptionsUseSheetDetail {
    detail: string;
}

export interface UseSheetDetailReturn {
    detail: string;
    ViewItemTemplate: ({ value: { no, ex } }: { value: Atom }) => JSX.Element;
    ViewRow: (props: { editingRow: EditingRow; updateRow: (editingRow: EditingRow, details: Detail[]) => Promise<void>; }) => JSX.Element;
    addRow: (editingRows: EditingRow[]) => Promise<SheetRow[]>;
    editRow: (genEditing: Editing, editingRow: EditingRow) => Promise<void>;
    // genAtomSpec: GenAtomSpec;
}
