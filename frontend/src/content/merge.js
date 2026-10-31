const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

export const deepMerge = (base, over) => {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    if (base.length && isObj(base[0])) {
      return over.filter(isObj).map((o, i) => deepMerge(base[i] ?? base[0], o));
    }
    return over.filter((x) => typeof x === "string");
  }
  if (isObj(base)) {
    if (!isObj(over)) return base;
    return Object.fromEntries(Object.keys(base).map((k) => [k, deepMerge(base[k], over[k])]));
  }
  return typeof over === typeof base ? over : base;
};

export const setIn = (obj, path, value) => {
  if (!path.length) return value;
  const [key, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...(obj ?? {}) };
  copy[key] = setIn(obj?.[key], rest, value);
  return copy;
};
