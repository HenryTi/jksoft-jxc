import { Route } from "react-router-dom";
import { LMR } from "tonwa-com";
import { PageAtomList, PageAtomNew, PageAtomView, GenAtom, PageAtomSelect, GenAtomNew } from "app/template/Atom";
import { Atom, uqSchema } from "uqs/UqDefault";
import { UqApp } from "app/UqApp";

export class GenGoods extends GenAtom {
    readonly bizEntityName = uqSchema.$biz.goods.name;
    get GenAtomNew() { return GenGoodsNew; }
    get exLabel(): string { return '描述' }
}

class GenGoodsNew extends GenAtomNew {
}

function ViewItemGoods({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <LMR className="d-block px-3 py-2">
        <div>
            <div className='small text-muted'>{no}</div>
            <div><b>{ex}</b></div>
        </div>
    </LMR>
}

export function ModalSelectGoods() {
    return <PageAtomSelect Gen={GenGoods} ViewItem={ViewItemGoods} />;
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
    return <PageAtomSelect
        Gen={GenGoods}
        ViewItem={ViewItemGoodsRetailPrice}
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
