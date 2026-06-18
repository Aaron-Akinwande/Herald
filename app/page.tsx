"use client";
import CollectionsPanel from "@/src/components/collections/CollectionsPanel";
import EnvPanel from "@/src/components/env/EnvPanel";
import HistoryPanel from "@/src/components/history/HistoryPanel";
import RequestBuilder from "@/src/components/request-builder/RequestBuilder";
import ResponseViewer from "@/src/components/response-viewer/ResponseViewer";
import { Paper, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function Home() {
  const [sidebarTab, setSidebarTab] = useState(0);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h6"
          // fontWeight={700}
          sx={{ mb: 3, letterSpacing: "-0.3px" }}
        >
          Herald
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          {/* Sidebar — history */}
          <Paper
            variant="outlined"
            sx={{
              width: 300,
              flexShrink: 0,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Tabs
              value={sidebarTab}
              onChange={(_, v) => setSidebarTab(v)}
              sx={{
                px: 1,
                minHeight: 40,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
              // TabIndicatorProps={{ style: { height: 2 } }}
            >
              <Tab
                label="History"
                sx={{ fontSize: 12, minHeight: 40, textTransform: "none" }}
              />
              <Tab
                label="Collections"
                sx={{ fontSize: 12, minHeight: 40, textTransform: "none" }}
              />
              <Tab
                label="Environment"
                sx={{ fontSize: 12, minHeight: 40, textTransform: "none" }}
              />
            </Tabs>

            {sidebarTab === 0 && <HistoryPanel />}
            {sidebarTab === 1 && <CollectionsPanel />}
            {sidebarTab === 2 && <EnvPanel />}
          </Paper>

          {/* Main content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            <RequestBuilder />
            <ResponseViewer />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
