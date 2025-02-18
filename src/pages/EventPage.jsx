import { useLoaderData, useNavigate } from "react-router-dom";
import { Box, Heading, Text, Button, Stack, useToast, Image, Flex } from "@chakra-ui/react";

export const loader = async ({ params }) => {
  const [eventResponse, categoriesResponse, usersResponse] = await Promise.all([
    fetch(`http://localhost:3000/events/${params.eventId}`),
    fetch("http://localhost:3000/categories"),
    fetch("http://localhost:3000/users"),
  ]);

  if (!eventResponse.ok || !categoriesResponse.ok || !usersResponse.ok) {
    throw new Error("Failed to fetch event, categories, or users");
  }

  const event = await eventResponse.json();
  const categories = await categoriesResponse.json();
  const users = await usersResponse.json();

  return { event, categories, users };
};

export function EventPage() {
  const { event, categories, users } = useLoaderData();
  const navigate = useNavigate();
  const toast = useToast();

  const categoryNames = event.categoryIds
    ? event.categoryIds.map(
        (id) => categories.find((cat) => cat.id === String(id))?.name || "Unknown"
      ).join(", ")
    : "Unknown";

  const user = users.find((u) => u.id === String(event.createdBy));

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Event Deleted",
          description: "The event has been successfully removed.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete event.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={6} maxW="600px" mx="auto" bg="white" borderRadius="lg" boxShadow="lg">
      <Image src={event.image} alt={event.title} borderRadius="md" mb={4} />
      <Heading mb={2}>{event.title}</Heading>
      <Text>{event.description}</Text>
      <Text><strong>Start:</strong> {event.startTime}</Text>
      <Text><strong>End:</strong> {event.endTime}</Text>
      <Text><strong>Category:</strong> {categoryNames}</Text>

      {user && (
        <Flex align="center" mt={4} p={3} bg="gray.100" borderRadius="md">
          <Image src={user.image} alt={user.name} borderRadius="full" boxSize="50px" mr={4} />
          <Text fontSize="lg"><strong>Created by:</strong> {user.name}</Text>
        </Flex>
      )}

      <Stack direction="row" spacing={4} mt={4}>
        <Button colorScheme="blue" onClick={() => navigate(`/event/${event.id}/edit`)}>
          Edit Event
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete Event
        </Button>
      </Stack>
      <Button mt={4} onClick={() => navigate("/")} variant="outline">
        Back to Events
      </Button>
    </Box>
  );
}
