import { GenAtomSpec } from "app/template";
import { GenDetail } from "app/template/Sheet";
import { GenGoods } from "../../Atom";

export abstract class GenDetailGoods extends GenDetail {
    #genAtomSpec: GenAtomSpec;
    get genAtomSpec(): GenAtomSpec {
        if (this.#genAtomSpec === undefined) {
            this.#genAtomSpec = this.uqApp.objectOf(GenGoods);
        }
        return this.#genAtomSpec;
    }
}
