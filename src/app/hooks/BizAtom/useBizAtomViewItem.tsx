import { EntityAtom } from "tonwa";

export function useBizAtomViewItem(atom: EntityAtom) {
    return function ({ value }: { value: any; }) {
        return <div>BizAtomViewItem</div>
    }
}
