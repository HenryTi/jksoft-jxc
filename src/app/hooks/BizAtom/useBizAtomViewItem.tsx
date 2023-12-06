import { EntityAtom } from "app/Biz";

export function useBizAtomViewItem(atom: EntityAtom) {
    return function ({ value }: { value: any; }) {
        return <div>BizAtomViewItem</div>
    }
}
