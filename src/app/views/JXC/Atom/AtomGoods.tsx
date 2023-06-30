import { LMR } from "tonwa-com";
import { Atom, EnumAtom } from "uqs/UqDefault";
import { useUqApp } from "app/UqApp";
import { GenAtomSpec } from "app/template";
import { AtomMetricSpec, GAtom, OptionsAtomSelect } from "app/tool";
import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView, selectAtom } from "app/hooks";

export function ViewAtomGoods({ value }: { value: Atom; }) {
    let { no, ex } = value;
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

const BizContact: OptionsUseBizAtom = {
    atomName: EnumAtom.Goods,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageNew() {
    let ret = useBizAtomNew(BizContact);
    return ret;
}

function PageView() {
    let ret = useBizAtomView(BizContact);
    return ret;
}

function PageList() {
    let options = Object.assign({}, BizContact, {
        ViewItemAtom: ViewAtomGoods,
        top: undefined,
    })
    let ret = useBizAtomList(options);
    return ret;
}

export const gGoods: GAtom = {
    name: EnumAtom.Goods,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewAtomGoods,
}
