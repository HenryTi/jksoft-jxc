import { ViewSpecBaseOnly } from "app/hooks/View";
import { ValDiv } from "../../store";

export function ViewIBase({ valDiv }: { valDiv: ValDiv }) {
    const { binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let { iBase } = valDiv;
    if (iBase === undefined) return null;
    return <div className="fw-bold">
        <ViewSpecBaseOnly id={iBase} noVisible={true} />
    </div>;
}
