"use client";
import RequestBuilder from "@/src/components/request-builder/RequestBuilder";
import ResponseViewer from "@/src/components/response-viewer/ResponseViewer";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h6"
          // fontWeight={700}
          sx={{ mb: 3, letterSpacing: "-0.3px" }}
        >
          API Tester
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <RequestBuilder />
          <ResponseViewer />
        </Box>
      </Container>
    </Box>
  );
}
