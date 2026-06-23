type FirestoreTimestampLike =
  | { seconds: number; nanoseconds?: number; toDate?: () => Date }
  | Date
  | string
  | number
  | null
  | undefined;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatTime(
  value: FirestoreTimestampLike,
  includeHour: boolean = true
): string {
  if (!value) return "";

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else if (typeof value === "object") {
    if (typeof value.toDate === "function") {
      date = value.toDate();
    } else if (typeof value.seconds === "number") {
      date = new Date(value.seconds * 1000);
    } else {
      return "";
    }
  } else {
    return "";
  }

  if (Number.isNaN(date.getTime())) return "";

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  if (!includeHour) {
    return `${day}/${month}/${year}`;
  }

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}