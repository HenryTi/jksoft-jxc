import { ReactNode } from "react";
import { LMR } from "tonwa-com";

export function ViceTitle({ className, children }: { className?: string; children: ReactNode; }) {
    return <LMR className={'tonwa-bg-gray-2 px-3 small pt-3 pb-1 ' + (className ?? '')}>
        {children}
    </LMR>;
}
