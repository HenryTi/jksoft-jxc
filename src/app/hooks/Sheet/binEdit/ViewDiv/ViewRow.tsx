import React from "react";
import { ViewDivProps } from "./tool";
import { ViewRowLeaf } from "./ViewRowLeaf";
import { ViewRowStem } from "./ViewRowStem";

export function ViewRow(props: ViewDivProps) {
    const { valDiv } = props;
    const { binDiv } = valDiv;
    const { level, entityBin, subBinDiv } = binDiv;
    let { divLevels, pivot } = entityBin;
    if (pivot !== undefined) {
        // pivot叶层次不显示。直接白色底
        divLevels--;
    }
    function RowContainer({ children, mark }: { children: React.ReactNode; mark: string; }) {
        let content = <div className={'d-flex border-bottom tonwa-bg-gray-' + (divLevels - level)}>
            {children}
        </div>;
        if (mark === undefined) return content;
        return <div>
            <div className="px-3 py-1">{mark}: {level}</div>
            {content}
        </div>;
    }
    let mark: string;
    let ViewRowFunc: (props: ViewDivProps) => JSX.Element;
    if (subBinDiv === undefined) {
        mark = 'row leaf';
        ViewRowFunc = ViewRowLeaf;
    }
    else {
        mark = 'row stem';
        ViewRowFunc = ViewRowStem;
    }
    return <RowContainer mark={/*mark*/undefined}><ViewRowFunc {...props} /></RowContainer>;
}
