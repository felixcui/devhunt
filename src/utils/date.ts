export function formatDate(dateInput: string | number): string {
  const date = new Date(Number(dateInput));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
} 