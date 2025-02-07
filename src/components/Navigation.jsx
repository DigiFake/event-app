import { Link } from "react-router-dom";
import { Box, Flex, Button } from "@chakra-ui/react";

export default function Navigation() {
  return (
    <Box bg="primary.500" p={4} mb={4}>
      <Flex justify="space-between" align="center">
        <Flex>
          <Button variant="ghost" as={Link} to="/" mr={4} color="white">
            Events
          </Button>
          <Button variant="ghost" as={Link} to="/event/new" color="white">
            Add Event
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
