'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Bell, ChevronDown, LayoutDashboard, LogOut, Settings, ShieldAlert, ShieldCheck, HeartPulse, Archive, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, role, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // You can render a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  }

  const navItems = [
    { href: '/overview', label: 'Overview', icon: LayoutDashboard, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/health-api-shield', label: 'Health API Shield', icon: HeartPulse, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/med-x-box', label: 'MED x Box', icon: Archive, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/alerts', label: 'Alerts', icon: ShieldAlert, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/pii-reports', label: 'PII Reports', icon: ClipboardList, roles: ['Admin', 'Analyst'] },
    { href: '/settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
  ];

  const filteredNavItems = navItems.filter(item => role && item.roles.includes(role));

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold font-headline text-primary">MediSecureX2</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start items-center gap-2 p-2 h-auto w-full">
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Can add breadcrumbs here */}
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 space-y-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
