import { FA, LMR } from "tonwa-com";

export function Cmd({ onClick, content, icon, iconColor }: { onClick: () => void; content: any; icon?: string; iconColor?: string }) {
    return <LMR className="p-3 cursor-pointer align-items-center" onClick={onClick}>
        <FA name={icon ?? 'cog'} fixWidth={true} className={' me-3 ' + (iconColor ?? ' text-primary ')} size="lg" />
        {content}
        <FA name="angle-right" />
    </LMR>;
}
