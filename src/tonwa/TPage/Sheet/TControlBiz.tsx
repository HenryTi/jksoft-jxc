import { JSX } from "react";
import { ControlBiz } from "../../Control";
import { PageCmdLog } from "../PageLog";

export class TControlBiz extends ControlBiz {
    protected override PageCmdLog(): JSX.Element {
        return <PageCmdLog />;
    }
}
