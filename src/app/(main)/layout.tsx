'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/useAuth';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Bell, ChevronDown, LayoutDashboard, LogOut, Settings, ShieldAlert, ShieldCheck, HeartPulse, Archive, ClipboardList, FileText, BarChart, Rocket } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { auth } from '@/lib/firebase';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, role, loading, setUser, setRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const navItems = [
    { href: '/overview', label: 'Overview', icon: LayoutDashboard, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/health-api-shield', label: 'Health API Shield', icon: HeartPulse, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/med-x-box', label: 'MED x Box', icon: Archive, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/alerts', label: 'Alerts', icon: ShieldAlert, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/incidents', label: 'Incidents', icon: FileText, roles: ['Admin', 'Analyst'] },
    { href: '/ttps', label: 'TTPs', icon: BarChart, roles: ['Admin', 'Analyst'] },
    { href: '/pii-reports', label: 'PII Reports', icon: ClipboardList, roles: ['Admin', 'Analyst'] },
    { href: '/agents', label: 'Agents', icon: Rocket, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
  ];

  const filteredNavItems = navItems.filter(item => role && item.roles.includes(role));
  
  const getPageData = (path: string) => {
    return navItems.find(item => path.startsWith(item.href))
  }
  const currentPage = getPageData(pathname)

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setRole(null);
    localStorage.removeItem('medi-secure-x2-user');
    router.push('/login');
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="justify-between group-data-[collapsible=icon]:group-data-[state=collapsed]:justify-center">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
              <div className="bg-primary text-primary-foreground rounded-lg p-2">
                  <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
                <h1 className="text-xl font-semibold font-headline text-primary">MediSecureX2</h1>
              </div>
          </div>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto">
          <SidebarMenu className="gap-2">
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
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
                <div className="text-left group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden" />
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
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-sm px-4 shadow-sm">
            <div className="flex items-center gap-4">
              {currentPage && (
                <h1 className="text-lg font-semibold md:text-xl font-headline text-muted-foreground">{currentPage.label}</h1>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
              </Button>
              <ModeToggle />
            </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
