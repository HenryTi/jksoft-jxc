import { List } from "tonwa-com";
import { ViewListHeader } from "./ViewListHeader";
import { useUqApp } from "app/UqApp";
import { BudRadio } from "app/Biz";
import { Link } from "react-router-dom";

export function ViewUomList() {
    const { biz } = useUqApp();
    let bizUom = biz.entities['uom'];
    let budType = bizUom.propColl['type'];
    let budItems = budType.budDataType as BudRadio;
    function ViewBaseUnit({ value }: { value: any[] }) {
        const [name, caption] = value;
        return <Link to={'/uom'}>
            <div className="px-3 py-2">
                {caption ?? name}
            </div>
        </Link>;
    }
    return <div>
        <ViewListHeader caption="基本单位" />
        <List items={budItems.items} ViewItem={ViewBaseUnit} />
    </div>
}
