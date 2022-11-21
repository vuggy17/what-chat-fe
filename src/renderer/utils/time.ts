import 'dayjs/locale/vi';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { StringMappingType } from 'typescript';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.locale('vi');
dayjs.extend(LocalizedFormat);

/**
 *
 * @param {number} dt Unix timestamp
 * @returns {string} formatted dayjs string
 */
export default function formatDTime(dt: number) {
  // if (dayjs(dt).isToday()) {
  //   return dayjs(dt).fromNow();
  // } else
  return dayjs.unix(dt).format('HH:mm');
}

export function aisToday(time: string) {
  return dayjs(time).isToday();
}

export function formatFullTime(time: string) {
  return dayjs(time).format('L LT');
}

export function getDif(source: string, dest: string) {
  const date1 = dayjs(source);
  const date2 = dayjs(dest);
  return date1.diff(date2, 'hour');
}
