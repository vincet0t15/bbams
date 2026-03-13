import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const [bg, setBg] = useState('/images/SAN_VICENTE_CAMPUS.jpg');

    useEffect(() => {
        const base = '/images/SAN_VICENTE_CAMPUS';
        const candidates = [
            `${base}.jpg`,
            `${base}.jpeg`,
            `${base}.png`,
            `${base}.webp`,
            base,
        ];
        let cancelled = false;
        (async () => {
            for (const src of candidates) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve();
                        img.onerror = () => reject(new Error('img error'));
                        img.src = src;
                    });

                    if (!cancelled) {
                        setBg(src);
                    }

                    break;
                } catch {
                    continue;
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div
                className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bg})` }}
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 -z-10 bg-black/40"
                aria-hidden
            />
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8 rounded-lg bg-white/70 p-6 shadow-md backdrop-blur-md dark:bg-black/40">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <img
                                src="/logos/psu_logo.png"
                                alt="PSU Logo"
                                className="mb-1 h-16 w-16 rounded-full object-contain"
                            />
                            <span className="sr-only">{title}</span>
                        </Link>
                        <div className="space-y-2 text-center">
                            <h2 className="text-base font-semibold tracking-tight">
                                Palawan State University- San Vicente Campus
                            </h2>
                            <h1 className="text-2xl leading-tight font-extrabold">
                                Biometric-Based Attendance
                                <br />
                                Monitoring System
                            </h1>
                            <p className="text-center text-xs text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
