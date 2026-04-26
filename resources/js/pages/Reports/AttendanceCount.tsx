import { Head, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import Pagination from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Printer } from 'lucide-react';

type CountRow = {
    user: { id: number; name: string; username: string; role: string | null };
    total_in: number;
    total_out: number;
    days_present: number;
    events: (string | null)[];
};

type Props = {
    report: {
        data: CountRow[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    events: { id: number; title: string | null }[];
    courses: { id: number; name: string; code: string | null }[];
    filters: {
        search?: string;
        event_id?: string;
        start_date?: string;
        end_date?: string;
        role?: string;
        course_id?: string;
    };
    range: { start: string; end: string };
    summary: {
        all: {
            total_users: number;
            total_in: number;
            total_out: number;
            total_days_present: number;
        };
        student: {
            total_users: number;
            total_in: number;
            total_out: number;
            total_days_present: number;
        };
        faculty: {
            total_users: number;
            total_in: number;
            total_out: number;
            total_days_present: number;
        };
        staff: {
            total_users: number;
            total_in: number;
            total_out: number;
            total_days_present: number;
        };
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendance Count', href: '/reports/attendance-count' },
];

export default function AttendanceCountReport({
    report,
    events,
    courses,
    filters,
    summary,
}: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
        event_id: filters.event_id || 'all',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        role: filters.role || 'all',
        course_id: filters.course_id || 'all',
    });

    useEffect(() => {
        setData({
            search: filters.search || '',
            event_id: filters.event_id || 'all',
            start_date: filters.start_date || '',
            end_date: filters.end_date || '',
            role: filters.role || 'all',
            course_id: filters.course_id || 'all',
        } as any);
    }, [filters, setData]);

    const [isFiltering, setIsFiltering] = useState(false);

    const buildQuery = (overrides?: Partial<typeof data>) => {
        const current = { ...data, ...(overrides ?? {}) };
        const query: Record<string, string> = {};

        if (current.search) {
            query.search = current.search;
        }

        if (current.event_id && current.event_id !== 'all') {
            query.event_id = current.event_id;
        }

        if (current.start_date) {
            query.start_date = current.start_date;
        }

        if (current.end_date) {
            query.end_date = current.end_date;
        }

        if (current.role && current.role !== 'all') {
            query.role = current.role;
        }

        if (
            current.role === 'student' &&
            current.course_id &&
            current.course_id !== 'all'
        ) {
            query.course_id = current.course_id;
        }

        return Object.keys(query).length ? query : undefined;
    };

    const submit = () => {
        setIsFiltering(true);
        router.get('/reports/attendance-count', buildQuery(), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    const reset = () => {
        setData({
            search: '',
            event_id: 'all',
            start_date: '',
            end_date: '',
            role: 'all',
            course_id: 'all',
        } as any);
        router.get('/reports/attendance-count', undefined, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            submit();
        }
    };
    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handlePrint = () => {
        const query = buildQuery();
        const params = new URLSearchParams();
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                params.append(key, value);
            });
        }
        const printUrl = `/reports/attendance-count/print${params.toString() ? '?' + params.toString() : ''}`;
        window.open(printUrl, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Count Report" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                All Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">
                                    {summary?.all?.total_users ?? 0}
                                </div>
                                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                    <Badge variant="secondary">
                                        IN: {summary?.all?.total_in ?? 0}
                                    </Badge>
                                    <Badge variant="secondary">
                                        OUT: {summary?.all?.total_out ?? 0}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Students
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">
                                    {summary?.student?.total_users ?? 0}
                                </div>
                                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                    <Badge variant="secondary">
                                        IN: {summary?.student?.total_in ?? 0}
                                    </Badge>
                                    <Badge variant="secondary">
                                        OUT: {summary?.student?.total_out ?? 0}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Faculty
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">
                                    {summary?.faculty?.total_users ?? 0}
                                </div>
                                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                    <Badge variant="secondary">
                                        IN: {summary?.faculty?.total_in ?? 0}
                                    </Badge>
                                    <Badge variant="secondary">
                                        OUT: {summary?.faculty?.total_out ?? 0}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Staff
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">
                                    {summary?.staff?.total_users ?? 0}
                                </div>
                                <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                                    <Badge variant="secondary">
                                        IN: {summary?.staff?.total_in ?? 0}
                                    </Badge>
                                    <Badge variant="secondary">
                                        OUT: {summary?.staff?.total_out ?? 0}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        size="sm"
                        value={data.role}
                        onValueChange={(val) => {
                            if (!val) {
                                return;
                            }

                            const role = val;
                            setData('role', role);
                            router.get(
                                '/reports/attendance-count',
                                buildQuery({
                                    role,
                                    course_id:
                                        role === 'student'
                                            ? data.course_id
                                            : 'all',
                                }),
                                { preserveScroll: true, preserveState: true },
                            );
                        }}
                        className="w-full justify-start"
                    >
                        <ToggleGroupItem value="all">All</ToggleGroupItem>
                        <ToggleGroupItem value="student">
                            Students
                        </ToggleGroupItem>
                        <ToggleGroupItem value="faculty">
                            Faculty
                        </ToggleGroupItem>
                        <ToggleGroupItem value="staff">Staff</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {data.role === 'student' ? (
                            <div className="space-y-2">
                                <Label>Program</Label>
                                <Select
                                    value={data.course_id}
                                    onValueChange={(v) =>
                                        setData('course_id', v)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All programs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All programs
                                        </SelectItem>
                                        {courses.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name}
                                                {c.code ? ` (${c.code})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : null}
                        <div className="space-y-2">
                            <Label>Event</Label>
                            <Select
                                value={data.event_id}
                                onValueChange={(val) =>
                                    setData('event_id', val)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All events" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All events
                                    </SelectItem>
                                    {events.map((e) => (
                                        <SelectItem
                                            key={e.id}
                                            value={String(e.id)}
                                        >
                                            {e.title ?? `Event #${e.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Start date</Label>
                            <Input
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End date</Label>
                            <Input
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Search</Label>
                            <Input
                                onKeyDown={handleKeyDown}
                                onChange={handleSearchChange}
                                placeholder="Search by name, email, or username..."
                                value={data.search}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={submit}
                            disabled={isFiltering}
                        >
                            Search
                        </Button>
                        <Button variant="ghost" onClick={reset}>
                            Reset
                        </Button>
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Username
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Role
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Total IN
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Total OUT
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Days Present
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Events
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {report.data.length > 0 ? (
                                report.data.map((row, idx) => (
                                    <TableRow
                                        key={row.user.id ?? idx}
                                        className="text-sm"
                                    >
                                        <TableCell className="text-sm">
                                            {row.user.name ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {row.user.username ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {row.user.role ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {row.total_in}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {row.total_out}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {row.days_present}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {row.events
                                                .filter(Boolean)
                                                .join(', ') || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <Pagination data={report as any} />
                </div>
            </div>
        </AppLayout>
    );
}
