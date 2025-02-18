import { useLoaderData, Link } from "react-router-dom";
import { Box, Heading, List, ListItem, Button, Input, Select, Text, Image } from "@chakra-ui/react";
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
    return { error: "Failed to load events." };
  }
};

export function EventsPage() {
  const { events, categories, error } = useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  if (error) return <Text color="red.500">{error}</Text>;

  const eventsWithCategoryNames = events.map((event) => ({
    ...event,
    categories: event.categoryIds
      ? event.categoryIds.map(
          (id) => categories.find((cat) => cat.id === String(id))?.name || "Unknown"
        ).join(", ")
      : "Unknown",
  }));

  const uniqueCategories = [...new Set(categories.map((cat) => cat.name))];

  const filteredEvents = eventsWithCategoryNames.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (selectedCategory === "" || event.categories.includes(selectedCategory))
  );

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Heading mb={4}>List of Events</Heading>
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={4}
      />
      <Select
        placeholder="Filter by category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb={4}
      >
        {uniqueCategories.map((cat, index) => (
          <option key={index} value={cat}>{cat}</option>
        ))}
      </Select>
      <Button 
        as={Link} 
        to="/event/new" 
        colorScheme="blue"
        fontSize="lg"
        fontWeight="bold"
        mb={4}
      >
        Add New Event
      </Button>

      <List spacing={4}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <ListItem key={event.id} p={4} bg="gray.100" borderRadius="md" boxShadow="sm">
              <Link to={`/event/${event.id}`} style={{ textDecoration: "none", display: "block" }}>
                <Image src={event.image} alt={event.title} borderRadius="md" mb={2} />
                <Heading size="md">{event.title}</Heading>
                <Text>{event.description}</Text>
                <Text fontSize="sm" color="gray.600">
                  📍 {event.location} | 🕒 {event.startTime}
                </Text>
              </Link>
            </ListItem>
          ))
        ) : (
          <Text>No events found.</Text>
        )}
      </List>
    </Box>
  );
}
