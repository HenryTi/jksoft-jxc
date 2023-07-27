export function Spinner({ size, className }: { size?: number; className?: string; }) {
    let style: any;
    if (size !== undefined) {
        let sz = `${(Number(size ?? 2) + 1) * 0.5}em`;
        style = { width: sz, height: sz, };
    }
    let cn = 'spinner-border ' + (className ?? '');
    return <div className={cn} role="status" style={style}>
        <span className="visually-hidden">Loading...</span>
    </div>;
}
