import { ViewDivProps } from "./tool";
import { ViewRowLeaf } from "./ViewRowLeaf";
import { ViewRowStem } from "./ViewRowStem";

export function ViewRow(props: ViewDivProps) {
    const { valDiv } = props;
    const { binDiv } = valDiv;
    const { level, entityBin, subBinDiv: div } = binDiv;
    const { divLevels } = entityBin;
    return <div className={'d-flex border-bottom tonwa-bg-gray-' + (divLevels - level)}>
        {
            div === undefined ?
                <ViewRowLeaf {...props} />
                :
                <ViewRowStem {...props} />
        }
    </div>;
}
