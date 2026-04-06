import { useRef } from 'react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  min?: string;
  max?: string;
};

export function DateTimePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick date & time',
  className,
  min,
  max,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const openNativePicker = () => {
        const el = inputRef.current;
        if (!el) return;
        // @ts-ignore: showPicker is supported in modern Chromium-based browsers
        if (typeof el.showPicker === 'function') {
            // @ts-ignore
            el.showPicker();
        } else {
            el.focus();
            el.click();
        }
    };

    const label =
        value && value.length
            ? dayjs(value).isValid()
                ? dayjs(value).format('MMM D, YYYY • h:mm A')
                : value
            : placeholder;

    return (
        <div className={className}>
            <input
                ref={inputRef}
                id={id}
                type="datetime-local"
                value={value}
        min={min}
        max={max}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
                aria-hidden
                tabIndex={-1}
            />
            <Button type="button" variant="outline" className="w-full justify-between" onClick={openNativePicker}>
                <span>{label}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="ml-2 size-4 opacity-70"
                >
                    <path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2v-8H3v8a2 2 0 0 0 2 2Z" />
                </svg>
            </Button>
        </div>
    );
}

