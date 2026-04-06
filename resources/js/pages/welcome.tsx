import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Clock,
    FileSpreadsheet,
    Fingerprint,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    const primaryCta = auth.user ? dashboard() : login();

    return (
        <>
            <Head title="BBAMS">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
                                <img
                                    src="/logos/PSU_logo.png"
                                    alt="PSU Logo"
                                    className="size-8 object-contain"
                                />
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm leading-tight font-semibold">
                                    Biometric-Based Attendance Monitoring System
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Palawan State University San Vicente Campus
                                </div>
                            </div>
                        </div>

                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild>
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button variant="outline" asChild>
                                            <Link href={register()}>
                                                Register
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="relative overflow-hidden">
                        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2 lg:py-20">
                            <div className="flex flex-col justify-center">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                                    <Fingerprint className="size-4 text-primary" />
                                    Secure biometric attendance tracking
                                </div>

                                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                    Track attendance faster, safer, and more
                                    accurately.
                                </h1>
                                <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                                    A campus-ready platform for biometric-based
                                    attendance monitoring—designed for students,
                                    faculty, and staff with role-based access
                                    and audit-friendly records.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Button asChild size="lg">
                                        <Link href={primaryCta}>
                                            {auth.user
                                                ? 'Open Dashboard'
                                                : 'Get Started'}
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg">
                                        <a href="#features">View Features</a>
                                    </Button>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    <div className="rounded-lg border bg-card p-4">
                                        <div className="text-xs text-muted-foreground">
                                            Real-time
                                        </div>
                                        <div className="mt-1 font-semibold">
                                            Attendance Logs
                                        </div>
                                    </div>
                                    <div className="rounded-lg border bg-card p-4">
                                        <div className="text-xs text-muted-foreground">
                                            Export
                                        </div>
                                        <div className="mt-1 font-semibold">
                                            Reports
                                        </div>
                                    </div>
                                    <div className="hidden rounded-lg border bg-card p-4 sm:block">
                                        <div className="text-xs text-muted-foreground">
                                            Role-Based
                                        </div>
                                        <div className="mt-1 font-semibold">
                                            Access
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/20 blur-3xl" />
                                <div className="absolute -right-24 -bottom-24 size-72 rounded-full bg-primary/15 blur-3xl" />

                                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold">
                                            Campus Overview
                                        </div>
                                        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                            Live
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl border bg-background p-4">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Clock className="size-4 text-primary" />
                                                Time-in / Time-out
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                Accurate timestamps with quick
                                                verification.
                                            </div>
                                        </div>
                                        <div className="rounded-xl border bg-background p-4">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <ShieldCheck className="size-4 text-primary" />
                                                Secure Access
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                Admin-controlled provisioning
                                                and roles.
                                            </div>
                                        </div>
                                        <div className="rounded-xl border bg-background p-4">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <BarChart3 className="size-4 text-primary" />
                                                Analytics
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                Track trends and attendance
                                                consistency.
                                            </div>
                                        </div>
                                        <div className="rounded-xl border bg-background p-4">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <FileSpreadsheet className="size-4 text-primary" />
                                                Exportable Reports
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground">
                                                Generate reports for
                                                documentation and auditing.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="features"
                        className="mx-auto max-w-6xl px-4 py-14"
                    >
                        <div className="flex flex-col gap-2">
                            <div className="text-sm font-semibold text-primary">
                                Features
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Built for campus workflows
                            </h2>
                            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                                Manage student, faculty, and staff profiles,
                                keep attendance records organized, and export
                                reports for administrative use.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Fingerprint,
                                    title: 'Biometric-based validation',
                                    desc: 'Designed to support fast and accurate verification.',
                                },
                                {
                                    icon: ShieldCheck,
                                    title: 'Admin-controlled access',
                                    desc: 'Only admins can provision accounts and assign roles.',
                                },
                                {
                                    icon: Clock,
                                    title: 'Real-time logging',
                                    desc: 'Capture time-in and time-out records reliably.',
                                },
                                {
                                    icon: BarChart3,
                                    title: 'Attendance analytics',
                                    desc: 'Summaries for quick insights and monitoring.',
                                },
                                {
                                    icon: FileSpreadsheet,
                                    title: 'Export-ready reports',
                                    desc: 'Generate reports compatible with documentation needs.',
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-xl border bg-card p-5 shadow-sm"
                                >
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <item.icon className="size-4 text-primary" />
                                        {item.title}
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        {item.desc}
                                    </div>
                                </div>
                            ))}

                            <div className="rounded-xl border bg-card p-5 shadow-sm">
                                <div className="text-sm font-semibold">
                                    Ready to start?
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    Log in to access the dashboard and begin
                                    managing records.
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button asChild>
                                        <Link href={primaryCta}>
                                            {auth.user ? 'Dashboard' : 'Log in'}
                                        </Link>
                                    </Button>
                                    {canRegister && !auth.user ? (
                                        <Button asChild variant="outline">
                                            <Link href={register()}>
                                                Register
                                            </Link>
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t">
                    <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            © {new Date().getFullYear()} Palawan State
                            University San Vicente Campus
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
