export function getTimeLeftFormatted(startDate: Date, endDate: Date): string {
    let diffMs: number = Math.abs(endDate.getTime() - startDate.getTime());

    const days: number = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs %= (1000 * 60 * 60 * 24);

    const hours: number = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs %= (1000 * 60 * 60);

    const minutes: number = Math.floor(diffMs / (1000 * 60));
    diffMs %= (1000 * 60);

    const seconds: number = Math.floor(diffMs / 1000);

    return `${days}-${hours}-${minutes}-${seconds}`;
}
