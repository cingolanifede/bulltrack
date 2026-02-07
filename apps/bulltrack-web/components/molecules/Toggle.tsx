type ToggleProps = {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      {label}
      <span
        className={`relative inline-block h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-black" : "bg-zinc-700"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-primary shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
          aria-hidden
        />
      </span>
    </label>
  );
}
