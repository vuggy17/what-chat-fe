/* eslint-disable no-plusplus */
export default function quickSort<T>(arr: any[], condition: string): T[] {
  if (arr.length < 2) return arr;

  const pivotIndex = arr.length - 1;
  const pivot = arr[pivotIndex];

  const left = [];
  const right = [];

  let currentItem;
  for (let i = 0; i < pivotIndex; i++) {
    currentItem = arr[i];

    if (currentItem[condition] < pivot[condition]) {
      left.push(currentItem);
    } else {
      right.push(currentItem);
    }
  }

  return [...quickSort(left, condition), pivot, ...quickSort(right, condition)];
}
