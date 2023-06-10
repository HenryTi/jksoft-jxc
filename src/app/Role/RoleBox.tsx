
export function RoleBox({ role }: { role: string | string[] }) {
    let roleContent: any;
    if (!role) {
        roleContent = <small className="text-muted">no role</small>
    }
    else if (typeof role === 'string') {
        roleContent = role;
    }
    else {
        roleContent = role.join(', ');
    }
    return <>
        RoleBox {roleContent}
    </>;
}
