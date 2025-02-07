import { useLoaderData, Link } from "react-router-dom";
import { Box, Heading, List, ListItem, Button, Input, Select, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

export const loader = async () => {
  try {
    const [eventsResponse, categoriesResponse] = await Promise.all([
      fetch("http://localhost:3000/events"),
      fetch("http://localhost:3000/categories")
    ]);

    if (!eventsResponse.ok || !categoriesResponse.ok) {
      throw new Error("Failed to fetch events or categories");
    }

    const events = await eventsResponse.json();
    const categories = await categoriesResponse.json();
    return { events, categories };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export function EventsPage() {
  const { events, categories } = useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const eventsWithCategoryNames = events.map((event) => ({
    ...event,
    categories: event.categoryIds ? event.categoryIds.map(
      (id) => categories.find((cat) => cat.id === String(id))?.name || "Unknown"
    ) : ["Unknown"],
  }));

  const uniqueCategories = [...new Set(categories.map((cat) => cat.name))];

  const filteredEvents = eventsWithCategoryNames.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (selectedCategory === "" || event.categories.includes(selectedCategory))
  );

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="lg" maxW="600px" mx="auto">
      <Heading mb={4} color="primary.500" textAlign="center">List of Events</Heading>
      
      <VStack spacing={3} align="stretch">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="gray.100"
          color="gray.900"
          _placeholder={{ color: "gray.600" }}
        />
        <Select
          placeholder="Filter by category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          bg="gray.100"
          color="gray.900"
        >
          {uniqueCategories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </Select>
        <Button 
          as={Link} 
          to="/event/new" 
          bg="primary.500" 
          color="white" 
          fontSize="md"
          fontWeight="bold"
          px={4} 
          py={2}
          borderRadius="md"
          w="full"
          _hover={{ bg: "primary.600" }}
        >
          ➕ Add New Event
        </Button>
      </VStack>

      <List spacing={3} mt={6}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <ListItem 
              key={event.id} 
              p={3} 
              bg="gray.50" 
              borderRadius="md" 
              boxShadow="sm" 
              _hover={{ bg: "gray.100" }}
            >
              <Link to={`/event/${event.id}`} style={{ color: "#0077b6", fontWeight: "bold" }}>
                {event.title}
              </Link>
            </ListItem>
          ))
        ) : (
          <Text textAlign="center" color="gray.600">No events found.</Text>
        )}
      </List>
    </Box>
  );
}
