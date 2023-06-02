import { Route } from "react-router-dom";
import { LMR } from "tonwa-com";
import { PageAtomList, PageAtomNew, PageAtomView, GenAtom, PageAtomSelect, GenAtomNew } from "app/template/Atom";
import { Atom, uqSchema } from "uqs/UqDefault";
import { UqApp, useUqApp } from "app/UqApp";
import { GenAtomSpec, GenSpec } from "app/template";
import { GenBatchValid, GenSpecShoe } from "./Spec";
import { AtomMetricSpec } from "app/tool";
import { selectAtomMetricSpec } from "app/template/AtomSpec";

const GenSpecArr: (new (uqApp: UqApp) => GenSpec)[] = [
    GenBatchValid,
    GenSpecShoe,
];
export class GenGoods extends GenAtomSpec {
    readonly bizEntityName = uqSchema.$biz.goods.name;
    get GenAtomNew() { return GenGoodsNew; }
    get exLabel(): string { return '描述' }
    protected override buildSpecs(): void {
        GenSpecArr.forEach(v => {
            let g = new v(this.uqApp);
            let { bizEntityName, phrase } = g;
            this.genSpecs[bizEntityName] = g;
            this.genSpecs[phrase] = g;
        });
    }
    readonly ViewItemAtom = ViewAtomGoods; // : (value: any) => JSX.Element;
}

class GenGoodsNew extends GenAtomNew {
}

export function ViewAtomGoods({ value }: { value: Atom; }) {
    let { no, ex } = value;
    /*
    return <LMR className="d-block px-3 py-2">
        <div>
            <div className='small text-muted'>{no}</div>
            <div><b>{ex}</b></div>
        </div>
    </LMR>
    */
    return <div>
        <div className='small text-muted'>{no}</div>
        <div><b>{ex}</b></div>
    </div>;
}

export function ModalSelectGoods() {
    let uqApp = useUqApp();
    let genAtom = uqApp.objectOf(GenGoods);
    return <PageAtomSelect genAtom={genAtom} />;
}

export async function selectGoodsMetricSpec(genAtomSpec: GenAtomSpec): Promise<AtomMetricSpec> {
    let ret = await selectAtomMetricSpec(genAtomSpec);
    return ret;
}

export interface GoodsRetailPrice extends Atom {
    buds: { retailprice: number; }
}

function ViewItemGoodsRetailPrice({ value }: { value: GoodsRetailPrice; }) {
    let { no, ex, buds: { retailprice } } = value;
    return <LMR className="d-block px-3 py-2">
        <div>
            <div className='small text-muted'>{no}</div>
            <div><b>{ex}</b></div>
        </div>
        <div>{retailprice}元</div>
    </LMR>
}

export function ModalSelectGoodsRetailPrice() {
    let uqApp = useUqApp();
    let genAtom = uqApp.objectOf(GenGoods);
    return <PageAtomSelect
        genAtom={genAtom}
        assigns={['retailprice']} />;
}

export function routeGoods(uqApp: UqApp) {
    let { genAtomNew, genAtomList, genAtomView } = uqApp.objectOf(GenGoods);
    return <>
        <Route path={genAtomNew.path} element={<PageAtomNew Gen={GenGoods} />} />
        <Route path={genAtomList.path} element={<PageAtomList Gen={GenGoods} />} />
        <Route path={`${genAtomList.path}/:atom`} element={<PageAtomList Gen={GenGoods} />} />
        <Route path={`${genAtomView.path}/:id`} element={<PageAtomView Gen={GenGoods} />} />
    </>;
};
