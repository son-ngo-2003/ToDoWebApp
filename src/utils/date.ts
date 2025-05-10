import dayjs from "dayjs"

export const isSameDate = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return dayjs(date1).isSame(dayjs(date2), "day");
}

export const dateToString = (date: Date | null): string => {
    if (!date) return "";
    return dayjs(date).format("DD/MMM/YYYY");
}