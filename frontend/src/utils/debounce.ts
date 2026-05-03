/**
 * Simple debounce utility.
 * Returns a debounced version of the given function that delays
 * invocation until after `ms` milliseconds of inactivity.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  ms: number,
) {
  let timer: ReturnType<typeof setTimeout>;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  
  debounced.cancel = () => {
    clearTimeout(timer);
  };
  
  return debounced;
}
