import React, { lazy } from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import App from "./App";
import ServiceWorkerUpdateService from "./components/ServiceWorkerUpdateService";
import { Auth0ProviderWithRedirectCallback } from "./components/util";
import Home from  "./components/Home";
import ErrorBoundary from "./components/ErrorBoundary";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

// route-based lazy loading of components according to https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting and https://react.dev/reference/react/lazy#load
const AddMeal = lazy(() => import('./components/Meals/AddMeal'));
const EditMeal = lazy(() => import('./components/Meals/EditMeal'));
const OwnMeals = lazy(() => import('./components/Meals/OwnMeals'));
const MealDetailView = lazy(() => import('./components/Meals/MealDetailView'));

const AddPlanItem = lazy(() => import('./components/Plans/AddPlanItem'));
const EditPlanItem = lazy(() => import('./components/Plans/EditPlanItem'));
const OwnPlans = lazy(() => import('./components/Plans/OwnPlans'));
const ShoppingList = lazy(() => import('./components/Plans/ShoppingList'));

const Social = lazy(() => import('./components/Social/Social'));
const ContactsContent = lazy(() => import('./components/Social/ContactsContent'));

const Settings = lazy(() => import('./components/Settings/Settings'));
const AdvancedSettings = lazy(() => import('./components/Settings/AdvancedSettings'));
const EditProfile = lazy(() => import('./components/Settings/EditProfile'));

const router = createBrowserRouter([
  {
    Component: Root,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'meals',
        children: [
          {
            index: true,
            element: <OwnMeals />,
          },
          {
            path: 'add',
            element: <AddMeal />,
          },
          {
            path: 'detail/:mealId',
            element: <MealDetailView />,
          },
          {
            path: 'edit/:mealId',
            element: <EditMeal />,
          },
        ]
      },
      {
        path: 'plans',
        children: [
          {
            index: true,
            element: <OwnPlans />,
          },
          {
            path: 'add',
            element: <AddPlanItem />,
          },
          {
            path: 'edit/:planItemId',
            element: <EditPlanItem />,
          },
          {
            path: 'shoppingList/:userId',
            element: <ShoppingList />,
          },
        ]
      },
      {
        path: 'social',
        children: [
          {
            index: true,
            element: <Social />,
          },
          {
            path: 'contact/:userId/:tab',
            element: <ContactsContent />,
          },
        ]
      },
      {
        path: 'settings',
        children: [
          {
            index: true,
            element: <Settings />,
          },
          {
            path: 'editProfile',
            element: <EditProfile />,
          },
          {
            path: 'advanced',
            element: <AdvancedSettings />,
          },
        ]
      },
    ],
  },
]);

function Root() {
  return <Auth0ProviderWithRedirectCallback domain={domain} clientId={clientId} redirectUri={window.location.origin}>
    <ServiceWorkerUpdateService />
    <App />
  </Auth0ProviderWithRedirectCallback>
}

ReactDOM.render(
  <RouterProvider router={router} />,
  document.getElementById('root')
);
