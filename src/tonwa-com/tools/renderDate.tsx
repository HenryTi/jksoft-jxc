export function renderDate(date: string): JSX.Element {
    if (!date) return null;
    let arr = date.split('-');
    let d = new Date(Number(arr[0]), Number(arr[1]) - 1, Number(arr[2]));
    return <>{d.toDateString()}</>;
}

export function renderHourMinute(time: string): JSX.Element {
    let arr = time.split(':');
    return <>{arr[0]}:{arr[1]}</>;
}