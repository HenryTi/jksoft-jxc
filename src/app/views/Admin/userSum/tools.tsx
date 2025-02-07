import { ViewAtom } from "app/hooks";
import { Pencil } from "tonwa-app";

export function ListHeader({ caption, onEdit }: { caption: string; onEdit: () => Promise<void>; }) {
    const cnHeader = ' tonwa-bg-gray-1 small d-flex align-items-end';
    let vEditButton: any;
    if (onEdit !== undefined) {
        vEditButton = <div className="text-primary cursor-pointer py-2 px-3" onClick={onEdit}>
            <Pencil />
        </div>;
    }
    return <div className={cnHeader}>
        <div className="flex-grow-1 ps-3 py-2">{caption}</div>
        {vEditButton}
    </div>
}

export function ViewAtomItem({ value }: { value: any }) {
    return <div className="px-3 py-2 mx-3 my-2 border rounded-2 w-min-12c">
        <ViewAtom value={value} />
    </div>
}
