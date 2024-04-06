import { ViewSpecBaseOnly } from "app/hooks";
import { ViewDivProps } from "./tool";
import { ViewRowLeaf } from "./ViewRowLeaf";
import { ViewRowStem } from "./ViewRowStem";

export function ViewRow(props: ViewDivProps) {
    const { valDiv } = props;
    const { binDiv } = valDiv;
    const { binDivBuds: binBuds, level, entityBin, div } = binDiv;
    const { divLevels } = entityBin;
    const { hasIBase } = binBuds;
    let vIBase: any;
    if (hasIBase === true) {
        let { iBase } = valDiv;
        vIBase = iBase !== undefined ? <div className="fw-bold">
            <ViewSpecBaseOnly id={iBase} noVisible={true} />
        </div> : null;
    }
    return <div className={'d-flex border-bottom ps-3 py-2 tonwa-bg-gray-' + (divLevels - level)}>
        {
            div === undefined ?
                <ViewRowLeaf {...props} vIBase={vIBase} />
                :
                <ViewRowStem {...props} vIBase={vIBase} />
        }
    </div>;
}
