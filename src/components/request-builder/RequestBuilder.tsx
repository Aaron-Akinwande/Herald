import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import MethodSelector from "./MethodSelector";
import UrlInput from "./UrlInput";
import SendButton from "./SendButton";
import HeadersTable from "./HeadersTable";
import BodyEditor from "./BodyEditor";

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

export default function RequestBuilder() {
  const [tab, setTab] = useState(0);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      {/* Top row — method + url + send */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", p: 1.5 }}>
        <MethodSelector />
        <UrlInput />
        <SendButton />
      </Box>

      <Divider />

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ px: 1, minHeight: 40 }}
        // TabIndicatorProps={{ style: { height: 2 } }}
        // slotProps={{ indicator: { sx: { height: 2 } } }}
        // className="h-2!"
      >
        <Tab
          label="Headers"
          sx={{ fontSize: 12, minHeight: 40, textTransform: "none" }}
        />
        <Tab
          label="Body"
          sx={{ fontSize: 12, minHeight: 40, textTransform: "none" }}
        />
      </Tabs>

      <Divider />

      <TabPanel value={tab} index={0}>
        <HeadersTable />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        {/* <Box
          sx={{
            fontFamily: "monospace",
            fontSize: 12,
            color: "text.disabled",
            p: 1,
          }}
        >
          JSON body editor coming soon — Phase 1 step 6
        </Box> */}
        <BodyEditor />
      </TabPanel>
    </Paper>
  );
}
