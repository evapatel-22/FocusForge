export const getDateLabel = (date: any) => {
  const completedDate = date.toDate
    ? date.toDate()
    : new Date(date);

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(completedDate, today)) {
    return "Today";
  }

  if (isSameDay(completedDate, yesterday)) {
    return "Yesterday";
  }

  return completedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};