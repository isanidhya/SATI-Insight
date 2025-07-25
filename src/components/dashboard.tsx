
'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DiscoverView } from './views/discover';
import { MyProfile } from './views/my-profile';
import { SupportView } from './views/support';
import { FeedbackView } from './views/feedback';
import { ImprovementsView } from './views/improvements';
import { Logo } from './icons';
import { Compass, UserCircle, LogOut, Sun, Moon, Settings, LifeBuoy, MessageSquareQuote, TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';

type View = 'discover' | 'my-profile' | 'feedback' | 'improvements' | 'support';

export function Dashboard() {
  const [activeView, setActiveView] = useState<View>('discover');
  const { user, logout } = useAuth();

  const viewTitles: Record<View, string> = {
    discover: 'Discover Talent',
    'my-profile': 'My Profile',
    feedback: 'Personalized Feedback',
    improvements: 'Improvement Roadmap',
    support: 'Support',
  };

  const renderView = () => {
    switch (activeView) {
      case 'my-profile':
        return <MyProfile />;
      case 'feedback':
        return <FeedbackView />;
      case 'improvements':
        return <ImprovementsView />;
      case 'support':
        return <SupportView />;
      case 'discover':
      default:
        return <DiscoverView />;
    }
  };
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              SATIInsight
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveView('discover')} isActive={activeView === 'discover'} tooltip="Discover">
                <Compass />
                <span>Discover</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveView('my-profile')} isActive={activeView === 'my-profile'} tooltip="My Profile">
                <UserCircle />
                <span>My Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveView('feedback')} isActive={activeView === 'feedback'} tooltip="Feedback">
                <MessageSquareQuote />
                <span>Feedback</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveView('improvements')} isActive={activeView === 'improvements'} tooltip="Improvements">
                    <TrendingUp />
                    <span>Improvements</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveView('support')} isActive={activeView === 'support'} tooltip="Support">
                <LifeBuoy />
                <span>Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-2xl font-semibold">{viewTitles[activeView]}</h1>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} data-ai-hint="person portrait" />
                    <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveView('my-profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveView('support')}>
                   <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {renderView()}
        </main>
      </div>
    </div>
  );
}


function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
