import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Button from "@mui/material/Button";
import SaveToCollectionDialog from "../collections/SaveToCollectionDialog";
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
  const [saveOpen, setSaveOpen] = useState(false);

  return (
    <>
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        {/* Top row — method + url + send */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", p: 1.5 }}>
          <MethodSelector />
          <UrlInput />
          <SendButton />
          <Button
            variant="outlined"
            size="small"
            startIcon={<BookmarkBorderIcon sx={{ fontSize: 15 }} />}
            onClick={() => setSaveOpen(true)}
            sx={{
              fontSize: 12,
              textTransform: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Save
          </Button>
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
          <BodyEditor />
        </TabPanel>
      </Paper>
      <SaveToCollectionDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
      />
    </>
  );
}
