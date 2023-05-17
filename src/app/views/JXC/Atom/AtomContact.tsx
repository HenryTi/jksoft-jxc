import { UqApp } from "app/UqApp";
import { PageAtomList, PageAtomNew, PageAtomView, GenAtom, PageAtomSelect, GenAtomNew } from "app/template/Atom";
import { Route } from "react-router-dom";
import { LMR } from "tonwa-com";
import { Atom, uqSchema } from "uqs/UqDefault";

export class GenContact extends GenAtom {
    readonly bizEntityName = uqSchema.$biz.contact.name;
    get GenAtomNew(): new (genAtom: GenAtom) => GenAtomNew { return GenContactNew; }

    get PageSelect(): JSX.Element {
        return <PageAtomSelect Gen={GenContact} />;
    }
}

class GenContactNew extends GenAtomNew {
}

function ViewItemContact({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <LMR className="d-block px-3 py-2">
        <div>
            <div className='small text-muted'>{no}</div>
            <div><b>{ex}</b></div>
        </div>
    </LMR>
}

export function ModalSelectContact() {
    return <PageAtomSelect Gen={GenContact} ViewItem={ViewItemContact} />;
}

export function routeContact(uqApp: UqApp) {
    let { genAtomNew, genAtomList, genAtomView } = uqApp.objectOf(GenContact);
    return <>
        <Route path={genAtomNew.path} element={<PageAtomNew Gen={GenContact} />} />
        <Route path={genAtomList.path} element={<PageAtomList Gen={GenContact} />} />
        <Route path={`${genAtomView.path}/:id`} element={<PageAtomView Gen={GenContact} />} />
    </>;
};
