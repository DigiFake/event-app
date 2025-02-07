import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Box, Heading, Input, Textarea, Button, Select, useToast } from "@chakra-ui/react";

export const loader = async ({ params }) => {
  const response = await fetch(`http://localhost:3000/events/${params.eventId}`);
  if (!response.ok) throw new Error("Failed to fetch event details");
  return response.json();
};

export function EditEventPage() {
  const event = useLoaderData();
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [category, setCategory] = useState(event.categoryIds?.[0] || "");

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedEvent = { 
      title, 
      description, 
      startTime, 
      endTime, 
      categoryIds: category ? [category] : [] 
    };

    const response = await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    });

    if (response.ok) {
      toast({
        title: "Event Updated",
        description: "Your changes have been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/event/${event.id}`);
    } else {
      toast({
        title: "Error",
        description: "Failed to update event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="lg" maxW="600px" mx="auto">
      <Heading mb={4} color="primary.500">Edit Event</Heading>
      <form onSubmit={handleSubmit}>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} mb={2} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} mb={2} />
        <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} mb={2} />
        <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} mb={2} />
        <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)} mb={2}>
          <option value="1">Sports</option>
          <option value="2">Games</option>
          <option value="3">Relaxation</option>
        </Select>
        <Button type="submit" colorScheme="blue">Save Changes</Button>
      </form>
    </Box>
  );
}
