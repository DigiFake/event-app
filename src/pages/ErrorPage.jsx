import { useRouteError } from "react-router-dom";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <Box p={6} textAlign="center">
      <Heading color="red.500">Oops! Something went wrong.</Heading>
      <Text mt={4}>{error?.message || "An unexpected error occurred."}</Text>
      <Button as={Link} to="/" mt={6} colorScheme="primary">
        Go Back to Home
      </Button>
    </Box>
  );
}
