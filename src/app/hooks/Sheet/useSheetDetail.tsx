import { EditingRow, SheetRow } from "app/tool";
import { Atom, Detail } from "uqs/UqDefault";
// import { ReturnUseEditing } from "./useSheetEditing";
// import { GenAtomSpec } from "../BizAtomSpec";

export interface OptionsUseSheetDetail {
    detail: string;
}

export type UpdateRow = (editingRow: EditingRow, details: Detail[]) => Promise<void>;

export interface UseSheetDetailReturn {
    detail: string;
    ViewItemTemplate: ({ value: { no, ex } }: { value: Atom }) => JSX.Element;
    ViewRow: (props: { editingRow: EditingRow; updateRow: UpdateRow; }) => JSX.Element;
    addRow: (editingRows: EditingRow[]) => Promise<SheetRow[]>;
    editRow: (editingRow: EditingRow, updateRow: UpdateRow) => Promise<void>;
}
