import { Navigate, useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();
  console.log('error', error.error.message);

  return <Navigate to="/" />
}
