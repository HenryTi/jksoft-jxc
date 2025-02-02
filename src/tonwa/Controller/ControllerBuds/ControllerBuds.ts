import { BinPick, BizBud } from "../../Biz";
import { ControllerBase, ControllerBiz } from "../ControllerBiz";

export abstract class ControllerBuds extends ControllerBase {
    protected readonly buds: BizBud[];

    constructor(controllerBiz: ControllerBiz, buds: BizBud[]) {
        super(controllerBiz);
        this.buds = buds;
    }
}
