import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { routes } from "./routes";
import Spinner from "./ui/Spinner";
import GlobalStyles from "./styles/GlobalStyle";
import DarkModeContextProvider from "./context/DarkModeContextProvider";

const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const router = createBrowserRouter(
  [{ errorElement: <PageNotFound />, children: routes }],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransition: true,
      v7_partialHydration: true,
    },
  }
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.MODE === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
      <GlobalStyles />
      <Suspense fallback={<Spinner />}>
        <DarkModeContextProvider>
          <RouterProvider
            future={{ v7_startTransition: true }}
            router={router}
          />
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
          />
        </DarkModeContextProvider>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
