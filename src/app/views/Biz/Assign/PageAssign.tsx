import { useBizAssign } from "app/hooks";

export function PageAssign() {
    const { page } = useBizAssign();
    return page;
}
