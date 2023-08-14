import { Page } from "tonwa-app";
import { Sep } from "tonwa-com";
//import { arrIDCustom, collIDCustom, IDCustom } from "./defs";

export function PageProp() {
    /*
    function ViewItem({ value: { type, custom } }: { value: { type: EnumID; custom: IDCustom; } }) {
        return <Link to={`${type}`}>
            <div className="px-3 py-2">{custom.caption}属性</div>
        </Link>;
    }
    */
    //<List items={arrIDCustom.map(v => ({ type: v, custom: collIDCustom[v] }))} ViewItem={ViewItem} />
    return <Page header="属性">
        <Sep />
    </Page>;
}

