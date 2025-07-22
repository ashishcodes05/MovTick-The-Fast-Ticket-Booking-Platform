export const kConverter = (num) => {
    // Handle undefined, null, or non-numeric values
    if (num === undefined || num === null || isNaN(num) || typeof num !== 'number') {
        return '0';
    }
    
    if (num < 1000) return num.toString();
    const units = ['K', 'M', 'B', 'T'];
    const unitIndex = Math.floor(Math.log10(num) / 3);
    const scaledNum = num / Math.pow(1000, unitIndex);
    return `${scaledNum.toFixed(1)}${units[unitIndex - 1]}`;
}