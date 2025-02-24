import { DateTime } from "luxon";
export const formatDate = (date) =>
    DateTime.fromISO(date, { zone: "utc" }).toFormat("dd.MM.yyyy");

  