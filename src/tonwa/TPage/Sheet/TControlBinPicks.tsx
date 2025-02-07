import { JSX } from "react";
import { ControlBinPicks } from "../../Control/ControlBuds";
import { PickPendStore } from "../../Store/PickPendStore";
import { PagePend } from "./PagePend";

export class TControlBinPicks extends ControlBinPicks {
    protected override PagePend(storePend: PickPendStore): JSX.Element {
        return <PagePend pendStore={storePend} />;
    }
}
