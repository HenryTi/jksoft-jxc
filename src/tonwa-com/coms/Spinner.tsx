export function Spinner({ size, className }: { size?: '1' | '2' | '3'; className?: string; }) {
    let sz = `${(Number(size ?? 2) + 1) * 0.5}em`;
    let style = { width: sz, height: sz, };
    let cn = 'spinner-border ' + (className ?? '');
    return <div className={cn} role="status" style={style}>
        <span className="visually-hidden">Loading...</span>
    </div>;
}
