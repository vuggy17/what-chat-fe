import { useCallback, useRef } from "react";
export default function useDebounce(func: any, delay = 400) {
  const debounce = useRef<any>();
  return useCallback(
    (...args: any) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const context = this;
      clearTimeout(debounce.current);
      debounce.current = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    },
    [func],
  );
}
