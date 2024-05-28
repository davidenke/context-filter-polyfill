// proxy builtins, s. https://stackoverflow.com/a/76368325/1146207
export function proxyBuiltin<T extends object>(
  builtin: unknown,
  handler: ProxyHandler<T>,
) {
  const mirror = {};

  Object.entries(Object.getOwnPropertyDescriptors(builtin)).forEach(
    ([key, value]) => {
      Object.defineProperty(mirror, key, value);
      // @ts-expect-error - we're doing nasty things here
      delete builtin[key];
    },
  );

  Object.setPrototypeOf(builtin, new Proxy(mirror, handler));

  return mirror;
}
