import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ResponseBody from "./ResponseBody";
import ResponseHeaders from "./ResponseHeaders";
import { useRequestStore } from "@/src/store/requestStore";

function StatusChip({ status }: { status: number }) {
  const color = status < 300 ? "success" : status < 400 ? "warning" : "error";

  return (
    <Chip
      label={status}
      color={color}
      size="small"
      sx={{ fontWeight: 700, fontSize: 12, height: 22 }}
    />
  );
}

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, index, value }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ p: 2 }}>
      {value === index && children}
    </Box>
  );
}

export default function ResponseViewer() {
  const response = useRequestStore((state) => state.response);
  const error = useRequestStore((state) => state.error);
  const isLoading = useRequestStore((state) => state.isLoading);
  const [tab, setTab] = useState(0);

  // Loading state
  if (isLoading) {
    return (
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, p: 3, textAlign: "center" }}
      >
        <Typography className="text-[13px]!" color="text.secondary">
          Sending request…
        </Typography>
      </Paper>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
          {error.status && <StatusChip status={error.status} />}
          {error.statusText && (
            <Typography className="text-[13px]!" color="text.secondary">
              {error.statusText}
            </Typography>
          )}
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography className="text-[13px]! font-mono!" color="error.main">
            {error.message}
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Empty state
  if (!response) {
    return (
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          bgcolor: "grey.50",
        }}
      >
        <Typography className="text-[13px]!" color="text.disabled">
          Enter a URL and hit Send to see the response here.
        </Typography>
      </Paper>
    );
  }

  // Response state
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      {/* Status bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5 }}>
        <StatusChip status={response.status} />
        <Typography className="text-[13px]!" color="text.secondary">
          {response.statusText}
        </Typography>
        <Typography className="text-[13px]!" color="text.secondary">
          {response.time}ms
        </Typography>
        <Typography className="text-[13px]!" color="text.secondary">
          {response.size}
        </Typography>
      </Box>

      <Divider />

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ px: 1, minHeight: 40 }}
        // TabIndicatorProps={{ style: { height: 2 } }}
      >
        <Tab
          label="Body"
          sx={{ fontSize: 12, minHeight: 40, textTransform: "none" }}
        />
        <Tab
          label="Headers"
          sx={{ fontSize: 12, minHeight: 40, textTransform: "none" }}
        />
      </Tabs>

      <Divider />

      <TabPanel value={tab} index={0}>
        <ResponseBody body={response.body} />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <ResponseHeaders headers={response.headers} />
      </TabPanel>
    </Paper>
  );
}
