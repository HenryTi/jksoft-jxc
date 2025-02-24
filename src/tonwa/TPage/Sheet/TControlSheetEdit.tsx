import { ControlDetailEdit, ControlSheetEdit } from "../../Control";
import { ViewSubmitReaction } from "./ViewSubmitReaction";
import { TControlDetailEdit } from "./TControlDetailEdit";

export class TControlSheetEdit extends ControlSheetEdit {
    protected createControlDetailEdit(): ControlDetailEdit {
        if (this.binStore === undefined) return;
        return new TControlDetailEdit(this, this.binStore.entity);
    }
    protected ViewSubmitReaction() {
        return <ViewSubmitReaction />;
    }
}
