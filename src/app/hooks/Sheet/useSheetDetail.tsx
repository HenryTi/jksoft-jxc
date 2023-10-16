import { EntityBin } from "app/Biz/EntitySheet";
import { Bin, EditingRow, SheetRow } from "app/tool";
import { Atom } from "uqs/UqDefault";
// import { ReturnUseEditing } from "./useSheetEditing";
// import { GenAtomSpec } from "../BizAtomSpec";

export interface OptionsUseSheetDetail {
    detail: string;
}

export type UpdateRow = (editingRow: EditingRow, details: Bin[]) => Promise<void>;

export interface UseSheetDetailReturn {
    detail: EntityBin;
    ViewItemTemplate: ({ value: { no, ex } }: { value: Atom }) => JSX.Element;
    ViewRow: (props: { editingRow: EditingRow; updateRow: UpdateRow; }) => JSX.Element;
    addRow: (editingRows: EditingRow[]) => Promise<SheetRow[]>;
    editRow: (editingRow: EditingRow, updateRow: UpdateRow) => Promise<void>;
}
