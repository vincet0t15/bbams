import { Head, router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { PaginatedDataResponse } from '@/types/pagination';

type UserRow = {
    id: number;
    name: string;
    email: string;
    username: string;
    role: string | null;
};

type Props = {
    userList: PaginatedDataResponse<UserRow>;
    events: { id: number; title: string | null }[];
    filters: {
        search?: string;
        role?: string;
    };
    defaultMonth: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'DTR', href: '/dtr' },
];

export default function DtrSelect({
    userList,
    events,
    filters,
    defaultMonth,
}: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
        role: filters.role || 'all',
        event_id: 'all',
        month: defaultMonth,
    });

    const [selected, setSelected] = useState<number[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);

    const toggleSelected = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const toggleAllOnPage = (checked: boolean) => {
        const ids = userList.data.map((u) => u.id);
        setSelected((prev) => {
            if (checked) {
                const next = new Set<number>(prev);
                ids.forEach((id) => next.add(id));

                return Array.from(next);
            }

            return prev.filter((id) => !ids.includes(id));
        });
    };

    const buildQuery = (overrides?: Partial<typeof data>) => {
        const current = { ...data, ...(overrides ?? {}) };
        const query: Record<string, string> = {};

        if (current.search) {
            query.search = current.search;
        }

        if (current.role && current.role !== 'all') {
            query.role = current.role;
        }

        if (current.event_id && current.event_id !== 'all') {
            query.event_id = current.event_id;
        }

        if (current.month) {
            query.month = dayjs(current.month).format('YYYY-MM');
        }

        return Object.keys(query).length ? query : undefined;
    };

    const submit = () => {
        setIsFiltering(true);
        router.get('/dtr', buildQuery(), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    const reset = () => {
        setData({
            search: '',
            role: 'all',
            event_id: 'all',
            month: defaultMonth,
        } as any);
        setSelected([]);
        router.get('/dtr', undefined, {
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

    const printSelected = () => {
        if (selected.length === 0) {
            return;
        }

        const params = new URLSearchParams();
        selected.forEach((uid) => params.append('user_ids[]', String(uid)));

        if (data.event_id && data.event_id !== 'all') {
            params.set('event_id', String(data.event_id));
        }

        if (data.month) {
            params.set('month', dayjs(data.month).format('YYYY-MM'));
        }

        const url = `/attendance-logs/print-dtr-batch?${params.toString()}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const allOnPageSelected =
        userList.data.length > 0 &&
        userList.data.every((u) => selected.includes(u.id));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="DTR - Select Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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

                            setData('role', val);
                            router.get('/dtr', buildQuery({ role: val }), {
                                preserveScroll: true,
                                preserveState: true,
                            });
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
                    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                                    {events.map((event) => (
                                        <SelectItem
                                            key={event.id}
                                            value={String(event.id)}
                                        >
                                            {event.title ??
                                                `Event #${event.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Month</Label>
                            <Input
                                type="month"
                                value={data.month}
                                onChange={(e) =>
                                    setData('month', e.target.value)
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
                        <Button
                            onClick={printSelected}
                            disabled={selected.length === 0}
                        >
                            Print Selected ({selected.length})
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[40px] font-bold text-primary">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={allOnPageSelected}
                                            onCheckedChange={(checked) =>
                                                toggleAllOnPage(
                                                    Boolean(checked),
                                                )
                                            }
                                            aria-label="Select all on page"
                                        />
                                    </div>
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Username
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Email
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Role
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userList.data.length > 0 ? (
                                userList.data.map((u) => (
                                    <TableRow key={u.id} className="text-sm">
                                        <TableCell className="text-sm">
                                            <Checkbox
                                                checked={selected.includes(
                                                    u.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSelected(u.id)
                                                }
                                                aria-label={`Select ${u.name}`}
                                            />
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {u.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {u.username}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {u.email}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {u.role ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
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
                    <Pagination data={userList} />
                </div>
            </div>
        </AppLayout>
    );
}
