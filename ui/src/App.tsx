import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import './styles/main.scss';
import Layout from './components/Layout/Layout';
import UserList from './components/Users/UserList';
import BookList from './components/Books/BookList';
import UserDetail from './pages/UserDetail';
import BookDetail from './pages/BookDetail';
import { store } from './store';
import { Outlet } from 'react-router-dom';

const LayoutWithOutlet = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWithOutlet />,
    children: [
      { path: '', element: <Navigate to="/books" replace /> },
      {
        path: 'books',
        children: [
          { path: '', element: <BookList /> },
          { path: ':id', element: <BookDetail /> }
        ]
      },
      {
        path: 'users',
        children: [
          { path: '', element: <UserList /> },
          { path: ':id', element: <UserDetail /> }
        ]
      }
    ]
  }
]);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App; 