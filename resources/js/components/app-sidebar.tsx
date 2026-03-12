import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    Trash2,
    LayoutGrid,
    Settings,
    Shield,
    Users,
    ClipboardList,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import courses from '@/routes/courses';
import { edit as editProfile } from '@/routes/profile';
import { index as usersIndex } from '@/routes/users';
import yearLevels from '@/routes/year-levels';
import type { NavGroup } from '@/types';

export function AppSidebar() {
    const { props } = usePage();
    const canManageRoles = Boolean(
        (props as any)?.auth?.permissions?.includes?.('roles.manage'),
    );

    const mainNavItems: NavGroup[] = [
        {
            title: 'Overview',
            children: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ],
        },
        {
            title: 'Attendance',
            children: [
                {
                    title: 'Events',
                    href: '/events',
                    icon: CalendarDays,
                },
                {
                    title: 'Attendance Logs',
                    href: '/attendance-logs',
                    icon: ClipboardList,
                },
            ],
        },
        {
            title: 'Academic Setup',
            children: [
                {
                    title: 'Courses',
                    href: courses.index.url(),
                    icon: BookOpen,
                },
                {
                    title: 'Year Levels',
                    href: yearLevels.index.url(),
                    icon: BookOpen,
                },
            ],
        },
        {
            title: 'Directory',
            children: [
                {
                    title: 'Students',
                    href: '/students',
                    icon: Users,
                },
                {
                    title: 'Faculty',
                    href: '/faculties',
                    icon: Users,
                },
                {
                    title: 'Staff',
                    href: '/staff',
                    icon: Users,
                },
            ],
        },
        {
            title: 'Administration',
            children: [
                {
                    title: 'Accounts',
                    href: usersIndex.url(),
                    icon: Users,
                },
                ...(canManageRoles
                    ? [
                        {
                            title: 'Permissions & Roles',
                            href: '/roles',
                            icon: Shield,
                        },
                        {
                            title: 'Bin',
                            href: '/bin',
                            icon: Trash2,
                        },
                    ]
                    : []),
            ],
        },
        {
            title: 'Settings',
            children: [
                {
                    title: 'Profile',
                    href: editProfile(),
                    icon: Settings,
                },
            ],
        },

    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-sm">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                >
                    <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/12 to-transparent" />
                    <div className="absolute -top-28 -left-28 size-72 rounded-full bg-primary/12 blur-3xl" />
                    <div className="absolute -right-40 -bottom-40 size-96 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="relative z-10 flex h-full w-full flex-col">
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    size="lg"
                                    className="h-auto py-3"
                                    asChild
                                >
                                    <Link href={dashboard()} prefetch>
                                        <AppLogo />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>

                    <SidebarContent>
                        <NavMain items={mainNavItems} />
                    </SidebarContent>

                    <SidebarFooter>
                        <NavUser />
                    </SidebarFooter>
                </div>
            </div>
        </Sidebar>
    );
}
