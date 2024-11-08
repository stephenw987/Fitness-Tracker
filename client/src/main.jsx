import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import SearchWorkouts from './pages/SearchWorkouts';  // Import SearchWorkouts
import SavedWorkouts from './pages/SavedWorkouts';  // Import SavedWorkouts

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,  // Default route
        element: <SearchWorkouts />  // This will now be the default page
      },
      {
        path: '/saved',  // Route for saved workouts
        element: <SavedWorkouts />  // Page for viewing saved workouts
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
