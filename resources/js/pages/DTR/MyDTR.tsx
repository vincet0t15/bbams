import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useState } from 'react';
import { Calendar, Clock, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

dayjs.extend(customParseFormat);

type LogEntry = {
    datetime: string;
    type: 'in' | 'out';
};

type DTRLog = {
    date?: string;
    am_in?: string;
    am_out?: string;
    pm_in?: string;
    pm_out?: string;
    late_minutes?: number;
    logs?: LogEntry[];
    hasUnmatched?: boolean;
};

type DTRData = {
    student_id: string | number;
    student_name: string;
    records: DTRLog[];
    forTheMonthOf: string;
    totalOut: number;
    totalIn: number;
    previousLogs?: LogEntry[];
    PrevForTheMonth?: string;
    PrevTotalIn?: number;
    PreveTotalOut?: number;
};

type Event = {
    id: number;
    title: string | null;
};

type Props = {
    dtr: DTRData;
    events: Event[];
    filters: {
        event_id?: string;
        month?: string;
    };
    user: {
        id: number;
        name: string;
        account_type: string;
    };
};

function formatLate(totalLateMinutes: number) {
    const total = Math.abs(totalLateMinutes || 0);
    const h = Math.floor(total / 60);
    const m = total % 60;
    return { h, m };
}

function flattenLogs(records: DTRLog[]): LogEntry[] {
    return records.flatMap((r) => r.logs || []);
}

export default function MyDTR({ dtr, events, filters, user }: Props) {
    const [selectedEvent, setSelectedEvent] = useState(
        filters.event_id || 'all',
    );
    const [selectedMonth, setSelectedMonth] = useState(
        filters.month || dayjs().format('YYYY-MM'),
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My DTR', href: '/my-dtr' },
    ];

    const handleFilter = () => {
        router.get(
            '/my-dtr',
            {
                ...(selectedEvent !== 'all' && { event_id: selectedEvent }),
                month: selectedMonth,
            },
            { preserveState: true, replace: true },
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const totalLate = dtr.records.reduce(
        (sum, r) => sum + (r.late_minutes || 0),
        0,
    );
    const late = formatLate(totalLate);
    const allLogs = flattenLogs(dtr.records);
    const hasUnmatched = dtr.records.some((r) => Boolean(r.hasUnmatched));
    const showPrevious = (dtr.previousLogs?.length ?? 0) > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My DTR" />
            <div className="min-h-screen bg-background p-4 text-foreground print:bg-white print:p-0">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3 print:hidden">
                    <div>
                        <div className="text-2xl font-semibold">
                            Daily Time Record
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Preview and print CS Form No. 48
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="shrink-0"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                </div>

                {/* Filters */}
                <Card className="mb-4 print:hidden">
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>
                            Select event and month to view your DTR
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="min-w-[200px] flex-1">
                                <label className="mb-2 block text-sm font-medium">
                                    Event
                                </label>
                                <Select
                                    value={selectedEvent}
                                    onValueChange={setSelectedEvent}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Events" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Events
                                        </SelectItem>
                                        {events.map((event) => (
                                            <SelectItem
                                                key={event.id}
                                                value={event.id.toString()}
                                            >
                                                {event.title ||
                                                    'Untitled Event'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="min-w-[200px] flex-1">
                                <label className="mb-2 block text-sm font-medium">
                                    Month
                                </label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) =>
                                        setSelectedMonth(e.target.value)
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button onClick={handleFilter}>
                                    Apply Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* DTR Screen View */}
                <Card className="print:hidden">
                    <CardHeader className="border-b">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <CardTitle className="truncate">
                                    {dtr.student_name}
                                </CardTitle>
                                <CardDescription>
                                    For the month of: {dtr.forTheMonthOf}
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">
                                    Total IN: {dtr.totalIn}
                                </Badge>
                                <Badge variant="secondary">
                                    Total OUT: {dtr.totalOut}
                                </Badge>
                                <Badge
                                    variant={
                                        totalLate > 0
                                            ? 'destructive'
                                            : 'outline'
                                    }
                                >
                                    Late: {late.h}h {late.m}m
                                </Badge>
                                {hasUnmatched ? (
                                    <Badge variant="destructive">
                                        Unmatched logs
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Matched</Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="form">
                            <TabsList>
                                <TabsTrigger value="form">DTR Form</TabsTrigger>
                                <TabsTrigger value="logs">Raw Logs</TabsTrigger>
                                {showPrevious && (
                                    <TabsTrigger value="previous">
                                        Previous Logs
                                    </TabsTrigger>
                                )}
                            </TabsList>

                            <TabsContent value="form" className="mt-2">
                                <div className="overflow-x-auto rounded-md border">
                                    <table className="w-full min-w-[720px] border-collapse text-center text-sm">
                                        <thead className="bg-muted/50">
                                            <tr className="border-b">
                                                <th className="border-r px-2 py-2">
                                                    Day
                                                </th>
                                                <th className="border-r px-2 py-2">
                                                    AM In
                                                </th>
                                                <th className="border-r px-2 py-2">
                                                    AM Out
                                                </th>
                                                <th className="border-r px-2 py-2">
                                                    PM In
                                                </th>
                                                <th className="border-r px-2 py-2">
                                                    PM Out
                                                </th>
                                                <th className="border-r px-2 py-2">
                                                    Late (H)
                                                </th>
                                                <th className="px-2 py-2">
                                                    Late (M)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dtr.records.map(
                                                (record, index) => {
                                                    const lateMinutes =
                                                        record.late_minutes ||
                                                        0;
                                                    const lateParts =
                                                        formatLate(lateMinutes);
                                                    return (
                                                        <tr
                                                            key={index}
                                                            className="border-b"
                                                        >
                                                            <td className="border-r px-2 py-2">
                                                                {record.date
                                                                    ? dayjs(
                                                                          record.date,
                                                                      ).format(
                                                                          'YYYY-MM-DD',
                                                                      )
                                                                    : '-'}
                                                            </td>
                                                            <td className="border-r px-2 py-2">
                                                                {record.am_in ||
                                                                    ''}
                                                            </td>
                                                            <td className="border-r px-2 py-2">
                                                                {record.am_out ||
                                                                    ''}
                                                            </td>
                                                            <td className="border-r px-2 py-2">
                                                                {record.pm_in ||
                                                                    ''}
                                                            </td>
                                                            <td className="border-r px-2 py-2">
                                                                {record.pm_out ||
                                                                    ''}
                                                            </td>
                                                            <td className="border-r px-2 py-2">
                                                                {lateMinutes
                                                                    ? lateParts.h
                                                                    : ''}
                                                            </td>
                                                            <td className="px-2 py-2">
                                                                {lateMinutes
                                                                    ? lateParts.m
                                                                    : ''}
                                                            </td>
                                                        </tr>
                                                    );
                                                },
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>

                            <TabsContent value="logs" className="mt-2">
                                <div className="overflow-x-auto rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[140px]">
                                                    Date
                                                </TableHead>
                                                <TableHead className="w-[90px]">
                                                    Time
                                                </TableHead>
                                                <TableHead>Type</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {allLogs.length ? (
                                                allLogs.map((entry, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>
                                                            {dayjs(
                                                                entry.datetime,
                                                            ).format(
                                                                'YYYY-MM-DD',
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {dayjs(
                                                                entry.datetime,
                                                            ).format('HH:mm')}
                                                        </TableCell>
                                                        <TableCell className="uppercase">
                                                            {entry.type}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={3}
                                                        className="py-6 text-center text-muted-foreground"
                                                    >
                                                        No logs.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            {showPrevious && (
                                <TabsContent value="previous" className="mt-2">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">
                                            Month:{' '}
                                            {dtr.PrevForTheMonth ?? 'Previous'}
                                        </Badge>
                                        <Badge variant="secondary">
                                            Total IN: {dtr.PrevTotalIn ?? 0}
                                        </Badge>
                                    </div>
                                    <div className="overflow-x-auto rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[140px]">
                                                        Date
                                                    </TableHead>
                                                    <TableHead className="w-[90px]">
                                                        Time
                                                    </TableHead>
                                                    <TableHead>Type</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(dtr.previousLogs || []).map(
                                                    (entry, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                {dayjs(
                                                                    entry.datetime,
                                                                ).format(
                                                                    'YYYY-MM-DD',
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {dayjs(
                                                                    entry.datetime,
                                                                ).format(
                                                                    'HH:mm',
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="uppercase">
                                                                {entry.type}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Print Layout - CS Form No. 48 */}
                <div className="print-container hidden border border-b-2 border-black p-2 print:block print:border-none print:p-0">
                    <div className="grid grid-cols-3 gap-6 pb-6">
                        <div className="w-[430px] font-sans text-sm text-gray-900">
                            <div>
                                <span className="font-bold">
                                    CIVIL SERVICE FORM No. 48
                                </span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold">
                                    DAILY TIME RECORD
                                </span>
                            </div>
                            <div className="mt-2 text-center">
                                <div>
                                    <span className="font-bold uppercase">
                                        {dtr.student_name}
                                    </span>
                                    <br />
                                    <span>(Name)</span>
                                </div>
                            </div>
                            <div className="mt-3 flex">
                                <span className="mr-2 italic">
                                    For the month of:
                                </span>
                                <span className="font-extrabold underline">
                                    {dtr.forTheMonthOf}
                                </span>
                            </div>

                            <div className="mb-2 grid grid-cols-2 gap-4">
                                <span className="italic">
                                    Official hours for arrival and departure
                                </span>
                                <div className="flex w-full flex-col">
                                    <div className="flex w-full gap-2">
                                        <span className="whitespace-nowrap italic">
                                            (Regular days:
                                        </span>
                                        <div className="flex-1 border-b border-black" />
                                    </div>
                                    <div className="flex w-full gap-2">
                                        <span className="whitespace-nowrap italic">
                                            (Saturdays:
                                        </span>
                                        <div className="flex-1 border-b border-black" />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-center text-sm">
                                    <thead>
                                        <tr className="border-2 border-black">
                                            <th
                                                rowSpan={2}
                                                className="border-2 border-black px-2 py-2"
                                            >
                                                DAY
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="border-2 border-black px-1 py-1"
                                            >
                                                A.M.
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="border-2 border-black px-1 py-1"
                                            >
                                                P.M.
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="border-2 border-black px-1 py-1"
                                            >
                                                UNDERTIME
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="border-2 border-black px-1 py-1">
                                                Arrival
                                            </th>
                                            <th className="border-2 border-black px-1 py-1">
                                                Departure
                                            </th>
                                            <th className="border-2 border-black px-1 py-1">
                                                Arrival
                                            </th>
                                            <th className="border-2 border-black px-1 py-1">
                                                Departure
                                            </th>
                                            <th className="border-2 border-black px-1 py-1">
                                                Hours
                                            </th>
                                            <th className="border-2 border-black px-1 py-1">
                                                Minutes
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: 31 }, (_, i) => {
                                            const currentDay = i + 1;
                                            const log =
                                                dtr.records.find(
                                                    (r) =>
                                                        r.date &&
                                                        dayjs(r.date).date() ===
                                                            currentDay,
                                                ) || {};
                                            const minutes =
                                                log.late_minutes || 0;
                                            const h = Math.floor(
                                                Math.abs(minutes) / 60,
                                            );
                                            const m = Math.abs(minutes) % 60;
                                            const day = log.date
                                                ? dayjs(log.date).day()
                                                : -1;

                                            return (
                                                <tr key={currentDay}>
                                                    <td className="border-2 border-black px-2 py-1">
                                                        {currentDay}
                                                    </td>
                                                    <td className="border-2 border-black px-2 py-1">
                                                        {log.am_in
                                                            ? log.am_in
                                                            : day === 6
                                                              ? 'SAT'
                                                              : day === 0
                                                                ? 'SUN'
                                                                : ''}
                                                    </td>
                                                    <td className="border-2 border-black px-2 py-1">
                                                        {log.am_out || ''}
                                                    </td>
                                                    <td className="border-2 border-black px-2 py-1">
                                                        {log.pm_in || ''}
                                                    </td>
                                                    <td className="border-2 border-black px-2 py-1">
                                                        {log.pm_out || ''}
                                                    </td>
                                                    <td className="border-2 border-black px-2 py-1">
                                                        {minutes ? h : ''}
                                                    </td>
                                                    <td className="border-2 border-black px-2 py-1">
                                                        {minutes ? m : ''}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="mt-2 font-bold">
                                    <span className="text-start">
                                        TOTAL_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                                        _
                                    </span>
                                    <span className="ml-[100px]">
                                        {Math.floor(Math.abs(totalLate) / 60)}
                                    </span>
                                    <span className="ml-[50px]">
                                        {Math.abs(totalLate) % 60}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <span>CERTIFY</span>
                                    <span className="italic">
                                        {' '}
                                        on my honor that the above is a true and
                                        correct report of the hours of work
                                        performed, record of which was made
                                        daily at the time of arrival at and
                                        departure from office.
                                    </span>
                                </div>

                                <div className="mt-16 flex flex-col justify-between space-y-2">
                                    <div className="w-full border-b border-black" />
                                    <div className="w-full border-b-2 border-black font-bold" />
                                </div>

                                <div className="mt-4">
                                    <span className="italic">
                                        Verified as to the prescribed office
                                        hours.
                                    </span>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <div className="w-1/2 text-center">
                                        <div className="w-full border-t-2 border-black" />
                                        <span className="mt-1 block text-sm">
                                            In Charge
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-2 text-center">
                                    <span className="italic">
                                        (See Instruction on the back)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
