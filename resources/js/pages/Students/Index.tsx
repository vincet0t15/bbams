import { Head, router, useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import Pagination from '@/components/paginationData';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
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
import type { PaginatedDataResponse } from '@/types/pagination';
import type { Student } from '@/types/student';
import StudentCreateDialog from './create';
import StudentDeleteDialog from './delete';
import StudentEditDialog from './edit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Students',
        href: '/students',
    },
];

interface Props {
    studentList: PaginatedDataResponse<Student>;
    courses: { id: number; name: string; code: string }[];
    yearLevels: { id: number; name: string }[];
    filters: {
        search?: string;
        course_id?: string;
        year_level_id?: string;
    };
}

export default function StudentsIndex({
    studentList,
    courses,
    yearLevels,
    filters,
}: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selected, setSelected] = useState<Student | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
        course_id: filters.course_id || 'all',
        year_level_id: filters.year_level_id || 'all',
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const query: Record<string, string> = {};

            if (data.search) {
                query.search = data.search;
            }

            if (data.course_id && data.course_id !== 'all') {
                query.course_id = data.course_id;
            }

            if (data.year_level_id && data.year_level_id !== 'all') {
                query.year_level_id = data.year_level_id;
            }

            router.get(
                '/students',
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

    const handleEditClick = (row: Student) => {
        setSelected(row);
        setOpenEdit(true);
    };
    const handleDeleteClick = (row: Student) => {
        setSelected(row);
        setOpenDelete(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                        <CardHeader>
                            <CardTitle>Total Students</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">
                            {studentList.total ?? 0}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
                        <CardHeader>
                            <CardTitle>Programs</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">
                            {courses.length}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-400 to-rose-500 text-white">
                        <CardHeader>
                            <CardTitle>Year Levels</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">
                            {yearLevels.length}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
                        <CardHeader>
                            <CardTitle>Active</CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold">
                            {studentList.total ?? 0}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-2 border-green-100 bg-green-50">
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-medium">Quick Tip</div>
                            <div className="text-sm text-muted-foreground">
                                Click a student row to open their profile, edit
                                details, or manage records.
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="default"
                        size="sm"
                        className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => setOpenCreate(true)}
                    >
                        <PlusIcon />
                        <span className="rounded-sm lg:inline">Student</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input
                            onKeyDown={handleKeyDown}
                            onChange={handleSearchChange}
                            placeholder="Search by name, email, or student no..."
                            value={data.search}
                        />
                        <div className="hidden items-center gap-2 sm:flex">
                            <div className="w-52">
                                <Select
                                    value={data.course_id}
                                    onValueChange={(val) =>
                                        setData('course_id', val)
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
                                                {c.name} ({c.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-44">
                                <Select
                                    value={data.year_level_id}
                                    onValueChange={(val) =>
                                        setData('year_level_id', val)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All years" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All years
                                        </SelectItem>
                                        {yearLevels.map((yl) => (
                                            <SelectItem
                                                key={yl.id}
                                                value={String(yl.id)}
                                            >
                                                {yl.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            variant="default"
                            className="bg-sky-500 text-white hover:bg-sky-600"
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

                                if (
                                    data.year_level_id &&
                                    data.year_level_id !== 'all'
                                ) {
                                    query.year_level_id = data.year_level_id;
                                }

                                router.get(
                                    '/students',
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
                        <Button
                            variant="outline"
                            className="border-gray-200 text-muted-foreground"
                            onClick={() => {
                                setData({
                                    search: '',
                                    course_id: 'all',
                                    year_level_id: 'all',
                                } as any);
                                router.get('/students', undefined, {
                                    preserveScroll: true,
                                    preserveState: true,
                                });
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="rounded-tl-xl rounded-tr-xl bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Email
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Student No
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Program
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Year Level
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Section
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentList.data.length > 0 ? (
                                studentList.data.map((s) => (
                                    <TableRow key={s.id} className="text-sm">
                                        <TableCell className="text-sm">
                                            {s.user?.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {s.user?.email}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {s.student_no || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {s.course
                                                ? `${s.course.name} (${s.course.code})`
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {s.year_level?.name ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {s.section || '-'}
                                        </TableCell>
                                        <TableCell className="flex gap-2 text-sm">
                                            <span
                                                onClick={() =>
                                                    handleEditClick(s)
                                                }
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                            >
                                                Edit
                                            </span>
                                            <span
                                                onClick={() =>
                                                    handleDeleteClick(s)
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
                                    <TableCell colSpan={8} className="p-8">
                                        <div className="flex h-48 w-full items-center justify-center">
                                            <div className="text-center">
                                                <div className="mb-4 text-4xl text-muted-foreground">
                                                    👥
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    No students found
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Add your first student to
                                                    get started
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={studentList} />
                </div>
            </div>
            {openCreate && (
                <StudentCreateDialog
                    open={openCreate}
                    setOpen={setOpenCreate}
                    courses={courses}
                    yearLevels={yearLevels}
                />
            )}
            {openEdit && selected && (
                <StudentEditDialog
                    open={openEdit}
                    setOpen={setOpenEdit}
                    student={selected}
                    courses={courses}
                    yearLevels={yearLevels}
                />
            )}
            {openDelete && selected && (
                <StudentDeleteDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    student={selected}
                />
            )}
        </AppLayout>
    );
}
