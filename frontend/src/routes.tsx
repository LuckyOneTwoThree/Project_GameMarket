import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Trade from './pages/Trade';
import Assets from './pages/Assets';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Order from './pages/Order';
import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/trade',
        element: <Trade />
      },
      {
        path: '/assets',
        element: <Assets />
      },
      {
        path: '/wallet',
        element: <Wallet />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '/admin',
        element: <Admin />
      },
      {
        path: '/orders',
        element: <Order />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

export default router;