import { BinPick, BizBud } from "../../Biz";
import { ControlBaseWithBiz, ControlBiz } from "../ControlBiz";

export abstract class ControlBuds extends ControlBaseWithBiz {
    protected readonly buds: BizBud[];

    constructor(controllerBiz: ControlBiz, buds: BizBud[]) {
        super(controllerBiz);
        this.buds = buds;
    }
}
