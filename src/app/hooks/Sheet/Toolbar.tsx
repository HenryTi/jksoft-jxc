import { useRef } from "react";
import { FA } from "tonwa-com";

export interface ToolButton {
    caption: string;
    icon?: string;
    className?: string;
    disabled?: boolean;
    hidden?: boolean;
    act: () => Promise<void> | void;
}

export function Toolbar({ groups }: { groups: ToolButton[][] }) {
    let { current: btnId } = useRef(1);
    function Group({ group, cnGap, cnBtn }: { group: ToolButton[]; cnGap: string; cnBtn: string; }) {
        return <div className="me-2">
            {group.map((v, index) => {
                const { caption, icon, className, hidden, disabled, act } = v;
                if (hidden === true) return null;
                let vIcon: any;
                if (icon !== undefined) {
                    vIcon = <FA name={icon} className="me-2" />;
                }
                return <button key={btnId++}
                    className={(className ?? ('btn btn-sm ' + cnBtn)) + cnGap}
                    disabled={disabled} onClick={act}>
                    {vIcon}{caption}
                </button>;
            })}
        </div>;
    }
    let vGroups: any[] = [];
    let len = groups.length;
    let cnGap = ' me-1 ';
    let cnBtn = ' btn-primary ';
    let i = 0;
    for (; i < len; i++) {
        let g = groups[i];
        if (g === null) {
            vGroups.push(<div key={i} className="flex-fill" />);
            i++
            break;
        }
        else {
            vGroups.push(<Group key={i} group={g} cnGap={cnGap} cnBtn={cnBtn} />);
        }
    }
    cnGap = ' ms-1 ';
    cnBtn = ' btn-outline-primary ';
    for (; i < len; i++) {
        vGroups.push(<Group key={i} group={groups[i]} cnGap={cnGap} cnBtn={cnBtn} />);
    }
    return <div className="d-flex bg-primary-subtle py-1 px-2 border-bottom border-primary-subtle border-2">
        {vGroups}
    </div>;
}
