import { EntityDetail } from "app/Biz/EntitySheet";
import { AtomPhrase, GenBizEntity } from "app/tool";
import { GenEditing } from "./GenEditing";
import { Atom } from "uqs/UqDefault";
import { AtomMetricSpec, EditingRow, SheetRow } from "../../tool";
import { GenAtomSpec } from "../AtomSpec";

export abstract class GenDetail extends GenBizEntity<EntityDetail> {
    // readonly bizEntityType = 'detail';
    // get entity(): EntityDetail { return this.biz.details[this.bizEntityName] }
    abstract get genAtomSpec(): GenAtomSpec;
    abstract get addRow(): (genEditing: GenEditing) => Promise<SheetRow[]>;
    abstract get editRow(): (genEditing: GenEditing, editingRow: EditingRow) => Promise<void>;
    abstract get ViewRow(): (props: { editingRow: EditingRow; genEditing: GenEditing }) => JSX.Element;
    selectTarget(header?: string): Promise<Atom> {
        return undefined;
    }
    protected selectAtomSpecMetric(header?: string): Promise<AtomMetricSpec> {
        return undefined;
    }

    async saveSpec(atom: AtomPhrase, spec: any): Promise<number> {
        let genSpec = this.genAtomSpec.genSpecFromAtom(atom.phrase);
        let values = genSpec.entity.getValues(spec);
        let ret = await this.uq.SaveSpec.submit({
            spec: genSpec.bizEntityName,
            atom: atom.id,
            values
        });
        return ret.id;
    }
}
