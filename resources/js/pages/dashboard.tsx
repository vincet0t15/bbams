import { Head } from '@inertiajs/react';
import {
    Flag,
    Target,
    ShieldCheck,
    Users2,
    Calendar,
    DollarSign,
    CreditCard,
    Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

type Props = {
    stats: {
        students: number;
        faculties: number;
        staff: number;
        events: number;
        today_in: number;
        today_out: number;
        latest_event: { id: number; title: string } | null;
    };
};

export default function Dashboard({ stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Hero / Welcome */}
                <section className="rounded-xl border bg-gradient-to-r from-blue-50 to-white p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold">
                                Welcome Back,
                            </h1>
                            <div className="text-2xl font-semibold">
                                Administrator
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                Welcome back! Here’s your latest payroll and
                                compensation snapshot for{' '}
                                <span className="font-medium">April 2026</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 rounded-lg border bg-white p-2">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div className="text-sm">April</div>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border bg-white p-2">
                                <div className="text-sm">2026</div>
                            </div>
                            <Button className="ml-2 bg-indigo-600 text-white hover:bg-indigo-700">
                                View Payroll
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Summary cards */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden">
                        <CardContent>
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-sm">
                                        Total Employees
                                    </div>
                                    <div className="text-3xl font-bold">
                                        {stats?.students ?? 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Active workforce
                                    </div>
                                </div>
                                <div className="rounded-full bg-blue-50 p-3">
                                    <Users2 className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-sm">Total Offices</div>
                                    <div className="text-3xl font-bold">18</div>
                                    <div className="text-sm text-muted-foreground">
                                        Departments
                                    </div>
                                </div>
                                <div className="rounded-full bg-emerald-50 p-3">
                                    <Briefcase className="h-6 w-6 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-sm">
                                        April Deductions
                                    </div>
                                    <div className="text-3xl font-bold">₱0</div>
                                    <div className="text-sm text-muted-foreground">
                                        0 entries • 0 employees
                                    </div>
                                </div>
                                <div className="rounded-full bg-orange-50 p-3">
                                    <DollarSign className="h-6 w-6 text-orange-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-sm">Total Claims</div>
                                    <div className="text-3xl font-bold">₱0</div>
                                    <div className="text-sm text-muted-foreground">
                                        0 total claims
                                    </div>
                                </div>
                                <div className="rounded-full bg-violet-50 p-3">
                                    <CreditCard className="h-6 w-6 text-violet-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Compensation Overview */}
                <section>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-100 p-2">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                </div>
                                <CardTitle>Compensation Overview</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                Total compensation breakdown across all
                                employees
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-lg border bg-white p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm">
                                                Total Salaries
                                            </div>
                                            <div className="text-2xl font-bold">
                                                0
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-blue-50 p-3">
                                            <DollarSign className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-white p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm">
                                                PERA Allowances
                                            </div>
                                            <div className="text-2xl font-bold">
                                                0
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-emerald-50 p-3">
                                            <Briefcase className="h-6 w-6 text-emerald-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-white p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm">
                                                RATA Benefits
                                            </div>
                                            <div className="text-2xl font-bold">
                                                0
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-orange-50 p-3">
                                            <CreditCard className="h-6 w-6 text-orange-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
                        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {[
                                {
                                    name: 'Louise Catherine T. Galia',
                                    initials: 'LG111',
                                    image: '/developerImages/c60971e2-6128-49d3-b14f-5355cff77cee.jpg',
                                },
                                {
                                    name: 'Riggien G. Diolata',
                                    initials: 'RD',
                                    image: '/developerImages/ab5d7a19-7dbf-479c-935b-25583b8a5472.jpg',
                                },
                                {
                                    name: 'Liezel Shein Agravante',
                                    initials: 'LA',

                                    image: '/developerImages/5cbf812a-ee1f-4e55-a93b-e1055e0506c9.jpg',
                                },
                                {
                                    name: 'Jea Bati-on',
                                    initials: 'JB',
                                    image: '/developerImages/8ca8a418-799a-429c-b005-d2b046340e24.jpg',
                                },
                                {
                                    name: 'Elyn Joy O. Sieco',
                                    initials: 'ES',
                                    image: '/developerImages/ac7005be-4b54-43fa-b8ac-3c8c591feec5.jpg',
                                },
                            ].map((dev) => (
                                <div
                                    key={dev.name}
                                    className="flex flex-col items-center gap-4 rounded-lg border p-6 text-center transition-shadow hover:shadow-md"
                                >
                                    <Avatar className="size-40 border-2 border-primary/20">
                                        <AvatarImage
                                            src={dev.image}
                                            alt={dev.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {dev.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="leading-tight font-semibold">
                                            {dev.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
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
