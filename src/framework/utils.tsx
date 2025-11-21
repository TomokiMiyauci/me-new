export interface Ref<T> {
  current: T;
}

export function createRef<T>(init: T): [Ref<T>, (value: T) => void] {
  const ref = { current: init };

  function setState(value: T): void {
    ref.current = value;
  }

  return [ref, setState];
}
