import { SheetStore, ValDiv, ValDivBase } from "../../store";
import { RowColsSm, ViewAtomTitles, ViewBudEmpty, ViewShowBuds } from "app/hooks/tool";
import { IDView } from "tonwa-app";
import { Atom as BizAtom } from "uqs/UqDefault";
import { useUqApp } from "app/UqApp";
import { BizBud } from "app/Biz";
import { theme } from "tonwa-com";
import { ViewSpecAtom } from "../../views";

export function ViewIBase({ sheetStore, valDiv }: { sheetStore: SheetStore, valDiv: ValDivBase }) {
    const { binDiv } = valDiv;
    const { binDivBuds, } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let iBase = valDiv.getIBase(sheetStore);
    if (iBase === undefined) return null;
    const { budsColl, bizAtomColl } = sheetStore
    /*
    let bizAtomValue = bizAtomColl[iBase];
    let viewAtom: any;
    if (bizAtomValue !== undefined) {
        viewAtom = <ViewAtom value={bizAtomValue} />;
    }
    else {
        viewAtom = <ViewAtomId id={iBase} />;
    }
    */
    let budValueColl = budsColl[iBase];
    return <>
        <ViewSpecAtom id={iBase} sheetStore={sheetStore} />
        <ViewAtomTitles budValueColl={budValueColl} bud={budIBase} atomColl={bizAtomColl} />
    </>;
}

function ViewAtom({ value }: { value: BizAtom; }) {
    const { no, ex } = value;
    return <><b>{ex}</b> <span className="ms-3">{no}</span></>;
}

function ViewAtomId({ id }: { id: number; }) {
    const { uq } = useUqApp();
    if (id === undefined) return <ViewBudEmpty />;
    return <IDView uq={uq} id={id} Template={ViewAtom} />;
}

export function ViewIBaseBuds({ sheetStore, valDiv }: { sheetStore: SheetStore, valDiv: ValDivBase }) {
    const { binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let { iBase } = valDiv;
    const { budsColl, bizAtomColl } = sheetStore;
    let budValueColl = budsColl[iBase];
    return <ViewShowBuds bud={budIBase} budValueColl={budValueColl} atomColl={bizAtomColl} />
}

export function ViewIBaseFromId({ sheetStore, valDiv, iBase }: { sheetStore: SheetStore, valDiv: ValDivBase; iBase: number; }) {
    let { iBase: budIBase } = valDiv.binDiv.entityBin
    const { budsColl, bizAtomColl } = sheetStore
    let bizAtomValue = bizAtomColl[iBase];
    let budValueColl = budsColl[iBase];
    return <div>
        <div>
            <ViewAtom value={bizAtomValue} />
        </div>
        <div>
            <ViewAtomTitles budValueColl={budValueColl} bud={budIBase} atomColl={bizAtomColl} />
        </div>
        <div className={theme.bootstrapContainer}>
            <RowColsSm contentClassName="flex-fill">
                <ViewShowBuds bud={budIBase} budValueColl={budValueColl} atomColl={bizAtomColl} />
            </RowColsSm>
        </div>
    </div>;
}
