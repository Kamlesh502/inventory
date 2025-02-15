import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { appConfig } from '@/config/app';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export function Header() {
  const [mode, setMode] = useState<'admin' | 'user'>(() => {
    return localStorage.getItem('mode') === 'admin' ? 'admin' : 'user';
  });

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'user' : 'admin';
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  return (
    <header className='supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur'>
      <div className='container px-4 md:px-8 flex h-14 items-center'>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='flex items-center space-x-2'>
            <Label htmlFor='admin-mode'>Admin</Label>
            <Switch
              id='admin-mode'
              checked={mode === 'user'}
              onCheckedChange={handleModeChange}
            />
            <Label htmlFor='user-mode'>User</Label>
          </div>
          <nav className='flex items-center space-x-2'>
            <a
              href={appConfig.github.url}
              title={appConfig.github.title}
              target='_blank'
              rel='noreferrer'
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'w-9 px-0'
                )}
              >
                <Icons.gitHub className='h-4 w-4' />
                <span className='sr-only'>GitHub</span>
              </div>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
