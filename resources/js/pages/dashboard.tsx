import { Head } from '@inertiajs/react';
import { Flag, Target, ShieldCheck, Users2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Hero */}
                <section className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-muted to-background">
                    <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_0%,black,transparent)]" />
                    <div className="relative flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
                        <img
                            src="/logos/psu_logo.png"
                            alt="PSU Logo"
                            className="h-16 w-16 rounded-full border bg-white p-2 shadow-sm"
                        />
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold tracking-tight">
                                Palawan State University — San Vicente Campus
                            </h2>
                            <p className="text-2xl leading-tight font-extrabold">
                                Biometric-Based Attendance Monitoring System
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Campus overview and mission-driven information.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Target className="size-5 text-muted-foreground" />
                                <CardTitle>Vision</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed text-muted-foreground">
                            An internationally recognized university that
                            provides relevant and innovative education and
                            research for lifelong learning and sustainable
                            development.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Flag className="size-5 text-muted-foreground" />
                                <CardTitle>Mission</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed text-muted-foreground">
                            Palawan State University is committed to upgrade
                            people’s quality of life by providing education
                            opportunities through excellent instruction,
                            research and innovation, extension, production
                            services, and transnational collaborations.
                        </CardContent>
                    </Card>
                </section>

                {/* Campus Goal & Quality Policy */}
                <section className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users2 className="size-5 text-muted-foreground" />
                                <CardTitle>Campus Goal</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed text-muted-foreground">
                            To produce globally competitive graduate who are
                            catalyst of change, morally upright, technologically
                            advanced, with sense of leadership, productive and
                            community oriented.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-5 text-muted-foreground" />
                                <CardTitle>Quality Policy</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                            <p>
                                We Provide equal opportunities for relevant,
                                innovative and internationally recognized higher
                                education programs and advanced studies for
                                lifelong learning and sustainable development.
                            </p>
                            <p>
                                We Strongly commit to deliver excellence in
                                instruction, research, extension and
                                transnational programs in order to meet the
                                increasing levels of stakeholder demand as well
                                as statutory and regulatory requirements.
                            </p>
                            <p>
                                The University shall continue to monitor, review
                                and upgrade its quality management system to
                                ensure compliance with national and
                                international standards and requirements.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Developers */}
                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle>Developers</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    name: 'Louise Catherine T. Galia',
                                    initials: 'LG',
                                },
                                { name: 'Riggien G. Diolata', initials: 'RD' },
                                {
                                    name: 'Liezel Shein Agravante',
                                    initials: 'LA',
                                },
                                { name: 'Jea Bati-on', initials: 'JB' },
                                { name: 'Elyn Joy O. Sieco', initials: 'ES' },
                            ].map((dev) => (
                                <div
                                    key={dev.name}
                                    className="flex items-center gap-3 rounded-lg border p-3"
                                >
                                    <Avatar className="size-9">
                                        <AvatarImage alt={dev.name} />
                                        <AvatarFallback>
                                            {dev.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                        <div className="font-medium">
                                            {dev.name}
                                        </div>
                                        <div className="text-muted-foreground">
                                            Developer
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
