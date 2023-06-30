import { GenBizEntity, PropsSpecEdit, Spec } from "app/tool";
import { EntityAtom, EntitySpec } from "app/Biz/EntityAtom";
import { UqApp } from "app/UqApp";

export abstract class GenSpec extends GenBizEntity<EntitySpec> {
    readonly bizEntityType = 'spec';
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

export abstract class GenAtomSpec {
    readonly uqApp: UqApp;
    readonly atomName: string;
    readonly genSpecs: { [name: string]: GenSpec } = {};
    constructor(uqApp: UqApp, atomName: string) {
        this.uqApp = uqApp;
        this.atomName = atomName;
        this.buildSpecs();
    }
    protected abstract buildSpecs(): void;

    genSpecFromAtom(atomName: string): GenSpec {
        if (atomName === undefined) return;
        let { biz } = this.uqApp;
        let atom = biz.entities[atomName] as EntityAtom;
        if (atom === undefined || atom.type !== 'atom') {
            let err = `'${atomName}' is not ATOM`;
            console.error(err);
            throw new Error(err);
        }
        let { spec } = atom;
        if (spec === undefined) return undefined;
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
