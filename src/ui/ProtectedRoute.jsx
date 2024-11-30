import styled from "styled-components";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../features/authentication/hooks/useUser";
import Spinner from "./Spinner";

const FullPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  background-color: var(--color-grey-50);
`;

export default function ProtectedRoute({ children }) {
  const { isFetchingUser, isAuthenticated } = useUser();
  const queryClient = useQueryClient();

  useEffect(
    function () {
      if (!isFetchingUser && !isAuthenticated) {
        queryClient.removeQueries();
      }
    },
    [isAuthenticated, isFetchingUser, queryClient]
  );

  if (isFetchingUser) {
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
