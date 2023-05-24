import { GenBizEntity, Spec } from "app/tool";
import { GenAtom } from "../Atom";
import { EntitySpec } from "app/Biz/EntityAtom";
import { UqApp } from "app/UqApp";

export interface PropsSpecEdit<T extends Spec> {
    className?: string;
    spec: T;
    submitCaption?: string;
    submitClassName?: string;
    onSubmit?: (spec: T) => Promise<void>;
}

export abstract class GenSpec extends GenBizEntity<EntitySpec> {
    readonly bizEntityType = 'spec';
    get entity(): EntitySpec { return this.biz.specs[this.bizEntityName]; }
    Edit({ className }: PropsSpecEdit<any>): JSX.Element {
        return <div className={className}>
            Edit
        </div>
    }
    View(props: { className?: string; value: Spec; }): JSX.Element {
        let { className, value } = props;
        if (!value) return <div />;
        return <div className={className}>
            View of Spec
        </div>
    }
}

export abstract class GenAtomSpec extends GenAtom {
    readonly genSpecs: { [name: string]: GenSpec } = {};
    constructor(uqApp: UqApp) {
        super(uqApp);
        this.buildSpecs();
    }
    protected abstract buildSpecs(): void;

    genAtom(atomName: string): GenAtom {
        let atom = this.biz.atoms[atomName];
        if (atom === undefined) {
            let err = `'${atomName}' is not ATOM`;
            console.error(err);
            throw new Error(err);
        }
        return this.uqApp.genAtoms[atom.name];
    }

    genSpecFromAtom(atomName: string): GenSpec {
        let atom = this.biz.atoms[atomName];
        if (atom === undefined) {
            let err = `'${atomName}' is not ATOM`;
            console.error(err);
            throw new Error(err);
        }
        let { spec } = atom;
        if (spec === undefined) return undefined;
        /*
        {
            let err = `'${atomName}' does not have SPEC`;
            console.error(err);
            throw new Error(err);
        }
        */
        let genSpec = this.genSpecs[spec.phrase];
        return genSpec;
    }

    genSpec(specName: string): GenSpec {
        let genSpec = this.genSpecs[specName];
        if (genSpec === undefined) {
            const err = `undefined GenSpce of '${specName}'`;
            console.error(err);
            debugger;
            throw Error(err);
        }
        return genSpec;
    }
}
