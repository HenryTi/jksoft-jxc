import { BizBase } from "./BizBase";

abstract class BizPropBase extends BizBase {
    items?: (string | number)[][];
}

export class BizProp extends BizPropBase {
}

export class BizSetting extends BizPropBase {
}
