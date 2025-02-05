import { BinPick, BizBud } from "../../Biz";
import { ControlBaseWithBiz, ControlBiz } from "../ControlBiz";

export abstract class ControlBuds extends ControlBaseWithBiz {
    protected readonly buds: BizBud[];

    constructor(controlBiz: ControlBiz, buds: BizBud[]) {
        super(controlBiz);
        this.buds = buds;
    }
}
