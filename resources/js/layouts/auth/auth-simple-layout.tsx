import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
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
