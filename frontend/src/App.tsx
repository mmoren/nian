import { useErrorBoundary, withErrorBoundary } from "react-use-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { PropsWithChildren, ReactNode, Suspense } from "react";
import { Game } from "./Game";

interface ErrorBoundaryProps extends PropsWithChildren {
  onReset: () => void;
  fallback: (attrs: { reset: () => void }) => ReactNode;
}

const ErrorBoundary = withErrorBoundary(function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [error, resetError] = useErrorBoundary();
  if (error) {
    return <>{fallback({ reset: resetError })}</>
  }
  return <>{children}</>;
});

export default function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={({ reset: resetBoundary }) => (
            <div>
              There was an error!
              <button onClick={() => resetBoundary()}>Try again</button>
            </div>
          )}
        >
          <Suspense fallback={<>Loading</>}>
            <Game />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
