import { CSSProperties } from "react";
export function ComAsync({ isWaiting }: { isWaiting?: boolean }) {
    let style: CSSProperties = {
        zIndex: 30001,
        background: 'rgba(0, 0, 0, 0.3)',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    }
    if (isWaiting !== true) return null;
    return <div className="d-flex position-absolute align-items-center justify-content-center" style={style}>
        <i className="fa fa-spinner fa-spin" />
    </div>
}
