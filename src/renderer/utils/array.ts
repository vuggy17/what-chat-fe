/* eslint-disable no-plusplus */
/**
 *
 * @param arr array to sort
 * @param condition key to sort by (must be a key of T)
 * @param direction asc|desc
 * @returns new sorted array
 */
function quickSort<T>(
  arr: any[],
  condition: string,
  direction: 'desc' | 'asc' = 'desc'
): T[] {
  if (arr.length < 2) return arr;

  const pivotIndex = arr.length - 1;
  const pivot = arr[pivotIndex];

  const left = [];
  const right = [];

  let currentItem;
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

function groupBy<T>(array: T[], count: number) {
  const result = [];
  for (let i = 0; i < array.length; i += count) {
    result.push(array.slice(i, i + count));
  }
  return result;
}

export { quickSort, groupBy };
