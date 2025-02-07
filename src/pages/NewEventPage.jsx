import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Input, Textarea, Button, Select, useToast } from "@chakra-ui/react";

export function NewEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newEvent = { 
      title, 
      description, 
      startTime, 
      endTime, 
      categoryIds: selectedCategory ? [selectedCategory] : [] 
    };

    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      toast({
        title: "Event Added!",
        description: "Your event has been successfully created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } else {
      toast({
        title: "Error",
        description: "Failed to add event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="lg" maxW="600px" mx="auto">
      <Heading mb={4} color="primary.500">Add a New Event</Heading>
      <form onSubmit={handleSubmit}>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} mb={2} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} mb={2} />
        <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} mb={2} />
        <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} mb={2} />
        <Select placeholder="Select category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} mb={2}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Select>
        <Button type="submit" colorScheme="blue">Submit</Button>
      </form>
    </Box>
  );
}
