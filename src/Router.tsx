import { createBrowserRouter } from 'react-router-dom';
import { Applayout } from './components/layouts/AppLayout';
import Dashboard from './pages/dashboard';
import NoMatch from './pages/NoMatch';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Applayout />,
      children: [
        {
          path: '',
          element: <Dashboard />,
        },
      ],
    },
    {
      path: '*',
      element: <NoMatch />,
    },
  ],
  {
    basename: '/',
  }
);
