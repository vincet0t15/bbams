import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    Trash2,
    LayoutGrid,
    Settings,
    Shield,
    Users,
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
            title: 'General',
            children: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ],
        },
        {
            title: 'Management',
            children: [
                {
                    title: 'Accounts',
                    href: usersIndex.url(),
                    icon: Users,
                },
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
                {
                    title: 'Events',
                    href: '/events',
                    icon: CalendarDays,
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
        </Sidebar>
    );
}
