export const parseCsv = (text: string): string[][] => {
  const rows = text.split('\n');
  return rows.map(row => row.split(',').map(cell => cell.replace(/"/g, '')));
};