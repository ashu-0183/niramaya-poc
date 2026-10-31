import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FIXED_LISTS, LONG_KEYS, labelFor } from "./labels";
import { FieldLabel, IconBtn, NativeSelect } from "./ui";

const tid = (path) => `admin-field-${path.join("-")}`;

const StringField = ({ path, name, value, onChange }) => {
  const id = tid(path);
  const long = value.length > 70 || LONG_KEYS.has(name);
  return (
    <div>
      <FieldLabel htmlFor={id}>{labelFor(path)}</FieldLabel>
      {long ? (
        <Textarea id={id} rows={3} value={value} onChange={(e) => onChange(path, e.target.value)} className="rounded-xl bg-white text-[15px]" data-testid={id} />
      ) : (
        <Input id={id} value={value} onChange={(e) => onChange(path, e.target.value)} className="h-11 rounded-xl bg-white text-[15px]" data-testid={id} />
      )}
    </div>
  );
};

const StringList = ({ path, name, items, onChange }) => {
  const fixed = FIXED_LISTS.has(name);
  const id = tid(path);
  return (
    <div>
      <FieldLabel htmlFor={`${id}-0`}>{labelFor(path)}</FieldLabel>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              id={`${id}-${i}`}
              value={item}
              onChange={(e) => onChange(path, items.map((x, j) => (j === i ? e.target.value : x)))}
              className="h-11 rounded-xl bg-white text-[15px]"
              data-testid={`${id}-${i}`}
            />
            {!fixed && (
              <IconBtn label="Remove item" tone="danger" onClick={() => onChange(path, items.filter((_, j) => j !== i))} testid={`${id}-remove-${i}`}>
                <X className="h-4 w-4" />
              </IconBtn>
            )}
          </div>
        ))}
      </div>
      {!fixed && (
        <button
          type="button"
          onClick={() => onChange(path, [...items, ""])}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-[#0b6b7b] hover:bg-[#e6f3f5]"
          data-testid={`${id}-add`}
        >
          <Plus className="h-4 w-4" /> Add item
        </button>
      )}
    </div>
  );
};

const Group = ({ title, children }) => (
  <fieldset className="rounded-2xl border border-[#0b6b7b]/12 bg-[#fbfaf6] p-4 md:p-5">
    <legend className="px-2 font-display text-lg text-[#0b6b7b]">{title}</legend>
    {children}
  </fieldset>
);

const Field = ({ name, value, path, onChange, siblings }) => {
  if (typeof value === "string") return <StringField path={path} name={name} value={value} onChange={onChange} />;
  if (typeof value === "number") {
    const lines = Array.isArray(siblings?.lines) ? siblings.lines : [];
    return (
      <div>
        <FieldLabel htmlFor={tid(path)}>{labelFor(path)}</FieldLabel>
        <NativeSelect id={tid(path)} value={value} onChange={(v) => onChange(path, Number(v))} testid={tid(path)}>
          {lines.map((l, i) => (
            <option key={i} value={i}>{`Line ${i + 1}: ${l}`}</option>
          ))}
        </NativeSelect>
      </div>
    );
  }
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) {
    return <StringList path={path} name={name} items={value} onChange={onChange} />;
  }
  if (Array.isArray(value)) {
    return (
      <Group title={labelFor(path)}>
        <div className="space-y-4">
          {value.map((item, i) => (
            <Group key={i} title={`${i + 1}. ${item?.t || item?.name || ""}`}>
              <Fields obj={item} path={[...path, i]} onChange={onChange} />
            </Group>
          ))}
        </div>
      </Group>
    );
  }
  if (value && typeof value === "object") {
    return (
      <Group title={value.title || labelFor(path)}>
        <Fields obj={value} path={path} onChange={onChange} />
      </Group>
    );
  }
  return null;
};

export const Fields = ({ obj, path, onChange }) => (
  <div className="space-y-5">
    {Object.entries(obj ?? {}).map(([k, v]) => (
      <Field key={k} name={k} value={v} path={[...path, k]} onChange={onChange} siblings={obj} />
    ))}
  </div>
);
