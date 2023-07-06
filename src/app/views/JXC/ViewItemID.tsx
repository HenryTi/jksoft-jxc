export function ViewItemID({ value }: { value: any; }) {
    let { no, ex } = value;
    return <div>
        <div className='small text-muted'>{no}</div>
        <div><b>{ex}</b></div>
    </div>;
}
