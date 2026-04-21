import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    // plain layout: no background image

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6 p-0">
                    <div className="flex flex-col items-center gap-2">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-1 font-medium"
                        >
                            <span className="sr-only">{title}</span>
                        </Link>
                        <div className="space-y-1 text-center">
                            <h2 className="text-sm font-semibold tracking-tight">
                                Biometric-Based Attendance Monitoring System
                            </h2>
                            <h1 className="text-xl leading-tight font-extrabold">
                                BBAMS
                            </h1>
                            <p className="text-center text-xs text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="mt-2">{children}</div>
                </div>
            </div>
        </div>
    );
}
