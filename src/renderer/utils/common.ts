/* eslint-disable no-plusplus */
/**
 *
 * @param arr array to sort
 * @param condition key to sort by (must be a key of T)
 * @param direction asc|desc
 * @returns new sorted array
 */
export function quickSort<T>(
  arr: T[],
  condition: string,
  direction: 'desc' | 'asc' = 'desc'
): T[] {
  if (arr.length < 2) return arr;

  const pivotIndex = arr.length - 1;
  const pivot = arr[pivotIndex];

  const left: T[] = [];
  const right: T[] = [];

  let currentItem: T;
  for (let i = 0; i < pivotIndex; i++) {
    currentItem = arr[i];

    switch (direction) {
      case 'desc':
        if (currentItem[condition] > pivot[condition]) {
          left.push(currentItem);
        } else {
          right.push(currentItem);
        }
        break;
      default:
        if (currentItem[condition] < pivot[condition]) {
          left.push(currentItem);
        } else {
          right.push(currentItem);
        }
        break;
    }
  }

  return [...quickSort(left, condition), pivot, ...quickSort(right, condition)];
}

export function groupBy<T>(array: T[], count: number) {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += count) {
    result.push(array.slice(i, i + count));
  }
  return result;
}

export function randomNumber(start: number, end: number) {
  return Math.floor(Math.random() * (end - start) + start);
}

// import Cookies from "universal-cookie";

// function getCookie(name: string) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift();

//   return undefined;
// }

// async function setCookie(name: string, value: string, days = 4) {
//   const c = new Cookies();

//   const endTime = new Date();
//   endTime.setTime(endTime.getTime() + days * 24 * 60 * 60 * 1000);
//   c.set(name, value, {
//     expires: endTime,
//   });
// }

// function deleteCookie(name: string) {
//   console.log("cookie deleteing");
//   document.cookie =
//     name + "=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=localhost";
// }
// export { getCookie, setCookie, deleteCookie };
