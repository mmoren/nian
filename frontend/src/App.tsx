import { useErrorBoundary, withErrorBoundary } from "react-use-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { PropsWithChildren, ReactNode, Suspense } from "react";
import { Game } from "./Game";
import { Box, Button, Center, Container, Heading, Spinner, Text, VStack } from "@chakra-ui/react";

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
            <Container h="100vh">
              <Center h="full">
                <VStack spacing={3}>
                  <Heading>
                    Ett fel inträffade
                  </Heading>
                  <Text>
                    Något gick åt pipan. Försök igen vettja.
                  </Text>
                  <Box padding={3}>
                    <Button onClick={() => resetBoundary()}>Försök igen</Button>
                  </Box>
                </VStack>
              </Center>
            </Container>
          )}
        >
          <Suspense
            fallback={
              <Center h="100vh">
                <Spinner/>
              </Center>
            }
          >
            <Game />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
