import { FA, LMR } from "tonwa-com";

export function ViewListHeader({ caption, right, onAdd }: {
    caption: string;
    right?: JSX.Element;
    onAdd?: () => Promise<void>;
}) {
    if (right === undefined) {
        if (onAdd) {
            right = <button className="mt-1 btn btn-sm btn-outline-primary" onClick={onAdd}>
                <FA name="plus" />
            </button>;
        }
    }
    return <LMR className="px-3 py-1 tonwa-bg-gray-2 small text-black-50 align-items-end">
        <div className="pt-2">{caption}</div>
        {right}
    </LMR>;
}
