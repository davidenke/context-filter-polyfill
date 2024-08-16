type PickByType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
