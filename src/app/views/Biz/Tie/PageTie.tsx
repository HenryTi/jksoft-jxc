import { useBizTie } from "app/hooks";

export function PageTie() {
    const { page } = useBizTie();
    return page;
}
