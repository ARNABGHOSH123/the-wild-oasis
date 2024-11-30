import { Navigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

export const routes = [
  {
    lazy: () =>
      Promise.all([
        import("./ui/AppLayout"),
        import("./ui/ProtectedRoute"),
        import("./ui/ErrorFallback"),
      ]).then(
        ([AppLayoutModule, ProtectedRouteModule, ErrorFallbackModule]) => ({
          Component: (props) => (
            <ErrorBoundary
              FallbackComponent={ErrorFallbackModule.default}
              onReset={() => window.location.replace("/")}
            >
              <ProtectedRouteModule.default>
                <AppLayoutModule.default {...props} />
              </ProtectedRouteModule.default>
            </ErrorBoundary>
          ),
        })
      ),
    children: [
      {
        index: true,
        element: <Navigate replace to="dashboard" />,
      },
      {
        path: "dashboard",
        lazy: () =>
          import("./pages/Dashboard").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "bookings",
        lazy: () =>
          import("./pages/Bookings").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "bookings/:bookingId",
        lazy: () =>
          import("./pages/Booking").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "checkin/:bookingId",
        lazy: () =>
          import("./pages/Checkin").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "users",
        lazy: () =>
          import("./pages/Users").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "settings",
        lazy: () =>
          import("./pages/Settings").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "account",
        lazy: () =>
          import("./pages/Account").then((module) => ({
            Component: module.default,
          })),
      },
      {
        path: "cabins",
        lazy: () =>
          import("./pages/Cabins").then((module) => ({
            Component: module.default,
          })),
      },
    ],
  },
  {
    path: "login",
    lazy: () =>
      import("./pages/Login").then((module) => ({
        Component: module.default,
      })),
  },
];
