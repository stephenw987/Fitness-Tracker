import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import AddWorkoutPage from './pages/AddWorkoutPage';
import SavedWorkouts from './pages/SavedWorkouts';

const router = createBrowserRouter([
  {
    path: '*', // This matches all sub-paths under /
    element: <App />,
    errorElement: <h1 className="display-2">Wrong page!</h1>,
    children: [
      {
        index: true, // This will be the default route
        element: <AddWorkoutPage />, // Home page or dashboard
      },
      {
        path: 'add-workout', // Add workout page
        element: <AddWorkoutPage />,
      },
      {
        path: 'saved-workouts', // Saved workouts page
        element: <SavedWorkouts />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

