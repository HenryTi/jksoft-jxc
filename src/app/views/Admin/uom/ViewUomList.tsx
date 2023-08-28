import { LMR, List } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { BudRadio } from "app/Biz";
import { Link } from "react-router-dom";
import { pathAtomView } from "app/hooks";
import { EnumAtom } from "uqs/UqDefault";
import { Page } from "tonwa-app";
import { BI } from "app/coms";

export function ViewUomList() {
    const { biz } = useUqApp();
    let bizUom = biz.entities[EnumAtom.Uom];
    let budType = bizUom.buds['type'];
    let budItems = budType.budDataType as BudRadio;
    function ViewBaseUnit({ value }: { value: any[] }) {
        const [name, caption, enm] = value;
        return <Link to={'/' + pathAtomView(EnumAtom.Uom, enm)}>
            <LMR className="px-3 py-2 align-items-center text-black">
                <BI name="archive" className="w-2c me-3 text-primary" iconClassName="fs-4" />
                <span>{caption ?? name}</span>
                <BI name="chevron-right" className="text-secondary" />
            </LMR>
        </Link>;
    }
    return <div>
        <List items={budItems.items} ViewItem={ViewBaseUnit} />
    </div>
}

export function PageUomRoot() {
    const { biz } = useUqApp();
    const { caption: uomCaption } = biz.entities[EnumAtom.Uom];
    return <Page header={uomCaption}>
        <ViewUomList />
    </Page>
}
