"use client";

type CheckboxProps = {
  checked: boolean;
  className?: string;
};

export function Checkbox({ checked, className }: CheckboxProps) {
  return (
    <span
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] ${
        checked
          ? "bg-primary"
          : "border-primary bg-transparent hover:border-primary-light border-[1.5px] border-solid"
      } ${className ?? ""}`}
      aria-hidden="true"
    >
      {checked && (
        <svg
          width={20}
          height={20}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-surface"
        >
          <path
            d="M4.16667 10.8333L7.5 14.1667L15.8333 5.83333"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
