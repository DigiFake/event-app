import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { EventsPage, loader as eventsLoader } from "./pages/EventsPage";
import { EventPage, loader as eventLoader } from "./pages/EventPage";
import { NewEventPage } from "./pages/NewEventPage";
import { EditEventPage, loader as editEventLoader } from "./pages/EditEventPage";
import ErrorPage from "./pages/ErrorPage";


const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#f4f4f4",  
        color: "#1a202c",           
        fontFamily: "Arial, sans-serif",
      },
      a: {
        color: "#0077b6",           
        _hover: {
          textDecoration: "underline",
        },
      },
    },
  },
  colors: {
    primary: {
      50: "#E3F2FD",
      100: "#BBDEFB",
      200: "#90CAF9",
      300: "#64B5F6",
      400: "#42A5F5",
      500: "#0077b6",  
      600: "#026aa7",
      700: "#01579b",
      800: "#003f77",
      900: "#002855",
    },
    secondary: {
      50: "#FFEBEE",
      100: "#FFCDD2",
      200: "#EF9A9A",
      300: "#E57373",
      400: "#EF5350",
      500: "#d62828",  
      600: "#ba181b",
      700: "#a4161a",
      800: "#72171b",
      900: "#5c0a02",
    },
    background: "#ffffff",
    card: "#ffffff",
    text: "#1a202c",
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <EventsPage />, loader: eventsLoader },
      { path: "/event/new", element: <NewEventPage /> },
      { path: "/event/:eventId", element: <EventPage />, loader: eventLoader },
      { path: "/event/:eventId/edit", element: <EditEventPage />, loader: editEventLoader },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
