import { Head, router, useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { FilterProps } from '@/types/filter';
import type { PaginatedDataResponse } from '@/types/pagination';
import type { YearLevel } from '@/types/year-level';
import YearLevelCreateDialog from './create';
import YearLevelEditDialog from './edit';
import YearLevelDeleteDialog from './delete';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Year Levels',
        href: '/year-levels',
    },
];

interface Props {
    yearLevelList: PaginatedDataResponse<YearLevel>;
    courses: { id: number; name: string; code: string }[];
    filters: FilterProps & { course_id?: string };
}

export default function YearLevelsIndex({
    yearLevelList,
    courses,
    filters,
}: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selected, setSelected] = useState<YearLevel | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
        course_id: filters.course_id || 'all',
    });

    const courseOptions = useMemo(
        () =>
            [{ id: 'all', name: 'All courses', code: '' } as any].concat(
                courses as any,
            ),
        [courses],
    );

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const query: Record<string, string> = {};

            if (data.search) {
                query.search = data.search;
            }

            if (data.course_id && data.course_id !== 'all') {
                query.course_id = data.course_id;
            }

            router.get(
                '/year-levels',
                Object.keys(query).length ? query : undefined,
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleEditClick = (row: YearLevel) => {
        setSelected(row);
        setOpenEdit(true);
    };
    const handleDeleteClick = (row: YearLevel) => {
        setSelected(row);
        setOpenDelete(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Year Levels" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => setOpenCreate(true)}
                    >
                        <PlusIcon />
                        <span className="rounded-sm lg:inline">Year Level</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Select
                            value={data.course_id}
                            onValueChange={(val) => {
                                setData('course_id', val);
                                const query: Record<string, string> = {};

                                if (data.search) {
                                    query.search = data.search;
                                }

                                if (val && val !== 'all') {
                                    query.course_id = val;
                                }

                                router.get(
                                    '/year-levels',
                                    Object.keys(query).length
                                        ? query
                                        : undefined,
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courseOptions.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name === 'All courses'
                                            ? c.name
                                            : `${c.name} (${c.code})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            onKeyDown={handleKeyDown}
                            onChange={handleSearchChange}
                            placeholder="Search..."
                            value={data.search}
                        />
                        <Button
                            variant="outline"
                            onClick={() => {
                                const query: Record<string, string> = {};

                                if (data.search) {
                                    query.search = data.search;
                                }

                                if (
                                    data.course_id &&
                                    data.course_id !== 'all'
                                ) {
                                    query.course_id = data.course_id;
                                }

                                router.get(
                                    '/year-levels',
                                    Object.keys(query).length
                                        ? query
                                        : undefined,
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                );
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Year Level
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Course
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {yearLevelList.data.length > 0 ? (
                                yearLevelList.data.map((yl) => (
                                    <TableRow key={yl.id} className="text-sm">
                                        <TableCell className="text-sm">
                                            {yl.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {yl.course?.name} ({yl.course?.code}
                                            )
                                        </TableCell>
                                        <TableCell className="flex gap-2 text-sm">
                                            <span
                                                onClick={() =>
                                                    handleEditClick(yl)
                                                }
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                            >
                                                Edit
                                            </span>
                                            <span
                                                onClick={() =>
                                                    handleDeleteClick(yl)
                                                }
                                                className="cursor-pointer text-red-500 hover:text-orange-700 hover:underline"
                                            >
                                                Delete
                                            </span>
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
                    <Pagination data={yearLevelList} />
                </div>
            </div>
            {openCreate && (
                <YearLevelCreateDialog
                    open={openCreate}
                    setOpen={setOpenCreate}
                    courses={courses}
                />
            )}
            {openEdit && selected && (
                <YearLevelEditDialog
                    open={openEdit}
                    setOpen={setOpenEdit}
                    yearLevel={selected}
                    courses={courses}
                />
            )}
            {openDelete && selected && (
                <YearLevelDeleteDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    yearLevel={selected}
                />
            )}
        </AppLayout>
    );
}
