export function BI({ name, className }: { name: string; className?: string; }) {
    return <div className={`d-inline-block text-center w-1-5c ${className}`}>
        <i className={`bi-${name}`} />
    </div>;
}