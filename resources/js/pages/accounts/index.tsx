import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Pagination from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import users from '@/routes/users';
import type { BreadcrumbItem } from '@/types';
import type { FilterProps } from '@/types/filter';
import type { PaginatedDataResponse } from '@/types/pagination';

type AccountRow = {
    id: number;
    name: string;
    username: string;
    email: string;
    is_active: boolean;
    roles: string[];
};

type Props = {
    userList: PaginatedDataResponse<AccountRow>;
    roles: string[];
    filters: FilterProps;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accounts',
        href: users.index.url(),
    },
];

export default function AccountsIndex({ userList, roles, filters }: Props) {
    const { props } = usePage();
    const canManageRoles = Boolean(
        (props as any)?.auth?.permissions?.includes?.('roles.manage'),
    );
    const canUpdateAccounts = Boolean(
        (props as any)?.auth?.permissions?.includes?.('accounts.update'),
    );

    const [openAssign, setOpenAssign] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AccountRow | null>(null);

    const assignForm = useForm<{ roles: string[] }>({
        roles: [],
    });

    const { data, setData } = useForm({
        search: filters.search || '',
        role: filters.role || 'all',
    });

    const availableRoles = useMemo(() => roles, [roles]);

    const buildQuery = (values: { search: string; role: string }) => {
        const query: Record<string, string> = {};

        if (values.search) {
            query.search = values.search;
        }

        if (values.role && values.role !== 'all') {
            query.role = values.role;
        }

        return Object.keys(query).length ? query : undefined;
    };

    const openAssignDialog = (user: AccountRow) => {
        setSelectedUser(user);
        assignForm.setData('roles', user.roles ?? []);
        setOpenAssign(true);
    };

    const toggleRole = (role: string) => {
        const current = assignForm.data.roles;

        const classRoles = ['student', 'faculty', 'staff'];

        if (current.includes(role)) {
            assignForm.setData(
                'roles',
                current.filter((r) => r !== role),
            );

            return;
        }

        if (classRoles.includes(role)) {
            const filtered = current.filter((r) => !classRoles.includes(r));
            assignForm.setData('roles', [...filtered, role]);

            return;
        }

        assignForm.setData('roles', [...current, role]);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        Accounts ({userList.total})
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={data.role}
                            onValueChange={(value) => {
                                setData('role', value);
                                router.get(
                                    users.index.url(),
                                    buildQuery({
                                        search: data.search,
                                        role: value,
                                    }),
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                );
                            }}
                        >
                            <SelectTrigger className="w-44">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All roles</SelectItem>
                                {availableRoles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Search..."
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') {
                                    return;
                                }

                                router.get(
                                    users.index.url(),
                                    buildQuery(data),
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    },
                                );
                            }}
                        />
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.get(
                                    users.index.url(),
                                    buildQuery(data),
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                )
                            }
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
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Username
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Email
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Status
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Roles
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userList.data.length ? (
                                userList.data.map((user) => (
                                    <TableRow key={user.id} className="text-sm">
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {user.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                {user.roles?.length ? (
                                                    user.roles.map((r) => (
                                                        <Badge
                                                            key={`${user.id}-${r}`}
                                                            variant="secondary"
                                                        >
                                                            {r}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        No roles
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {canUpdateAccounts && (
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            user.is_active
                                                                ? 'outline'
                                                                : 'default'
                                                        }
                                                        onClick={() =>
                                                            router.put(
                                                                users.toggleStatus.url(
                                                                    user.id,
                                                                ),
                                                                {},
                                                                {
                                                                    preserveScroll: true,
                                                                    preserveState: true,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        {user.is_active
                                                            ? 'Deactivate'
                                                            : 'Activate'}
                                                    </Button>
                                                )}
                                                {canManageRoles && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openAssignDialog(
                                                                user,
                                                            )
                                                        }
                                                    >
                                                        Assign roles
                                                    </Button>
                                                )}
                                                {!canUpdateAccounts &&
                                                    !canManageRoles && (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No accounts found.
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

            <Dialog
                open={openAssign}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedUser(null);
                        assignForm.reset();
                    }

                    setOpenAssign(open);
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Assign Roles</DialogTitle>
                        <DialogDescription>
                            {selectedUser
                                ? `Update roles for ${selectedUser.name}`
                                : 'Update roles'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser ? (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Roles</div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {availableRoles.map((role) => (
                                        <label
                                            key={role}
                                            className="flex cursor-pointer items-center gap-2 text-sm"
                                        >
                                            <Checkbox
                                                checked={assignForm.data.roles.includes(
                                                    role,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleRole(role)
                                                }
                                            />
                                            <span>{role}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="text-sm text-destructive">
                                    {assignForm.errors.roles}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setOpenAssign(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={!selectedUser || assignForm.processing}
                            onClick={() => {
                                if (!selectedUser) {
                                    return;
                                }

                                assignForm.put(
                                    users.roles.update.url(selectedUser.id),
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => setOpenAssign(false),
                                    },
                                );
                            }}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
