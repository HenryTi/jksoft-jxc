export function renderDate(date: string): JSX.Element {
    if (!date) return null;
    let Part = date.split('-');
    let d = new Date(Number(Part[0]), Number(Part[1]) - 1, Number(Part[2]));
    return <>{d.toDateString()}</>;
}

export function renderHourMinute(time: string): JSX.Element {
    let Part = time.split(':');
    return <>{Part[0]}:{Part[1]}</>;
}