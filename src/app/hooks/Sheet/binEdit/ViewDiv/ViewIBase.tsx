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
    let { iBase } = valDiv;
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
        {/*viewAtom*/}
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

export function ViewIBaseFromId({ sheetStore, valDiv, iBase, baseBud }: { sheetStore: SheetStore, valDiv: ValDivBase; iBase: number; baseBud: BizBud; }) {
    let budIBase: BizBud;
    for (let p = valDiv; p !== undefined; p = p.parent) {
        const { binDiv } = p;
        const { binDivBuds } = binDiv;
        budIBase = binDivBuds.budIBase;
        if (budIBase !== undefined) {
            valDiv = p;
            iBase = valDiv.iBase;
            break;
        }
    }
    if (budIBase === undefined) return null;
    const { budsColl, bizAtomColl } = sheetStore
    let bizAtomValue = bizAtomColl[iBase];
    let viewAtom: any;

    if (bizAtomValue !== undefined) {
        viewAtom = <ViewAtom value={bizAtomValue} />;
    }
    else {
        viewAtom = <ViewAtomId id={iBase} />;
    }
    let budValueColl = budsColl[iBase];
    return <div>
        <div>
            {viewAtom}
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
