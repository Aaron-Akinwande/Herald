import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useCollectionStore } from "@/src/store/collectionStore";
import { useRequestStore } from "@/src/store/requestStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SaveToCollectionDialog({ open, onClose }: Props) {
  const collections = useCollectionStore((state) => state.collections);
  const addCollection = useCollectionStore((state) => state.addCollection);
  const addRequest = useCollectionStore((state) => state.addRequest);

  const method = useRequestStore((state) => state.method);
  const url = useRequestStore((state) => state.url);
  const headers = useRequestStore((state) => state.headers);
  const body = useRequestStore((state) => state.body);

  const [requestName, setRequestName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [mode, setMode] = useState<"existing" | "new">("existing");

  const canSave =
    requestName.trim() &&
    (mode === "existing" ? selectedCollection : newCollectionName.trim());

  const handleSave = () => {
    let targetId =
      mode === "existing" ? selectedCollection : newCollectionName.trim();
    console.log(targetId);
    if (mode === "new" && newCollectionName.trim()) {
      addCollection(newCollectionName.trim());
      // Get the newly created collection id
      const updated = useCollectionStore.getState().collections;
      targetId = updated[updated.length - 1].id;
    }

    addRequest(targetId, {
      name: requestName.trim(),
      method,
      url,
      headers,
      body,
    });

    // Reset
    setRequestName("");
    setSelectedCollection("");
    setNewCollectionName("");
    setMode("existing");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 15, fontWeight: 600 }}>
        Save Request
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "12px !important",
        }}
      >
        {/* Request name */}
        <TextField
          label="Request name"
          placeholder="e.g. Get all users"
          size="small"
          fullWidth
          value={requestName}
          onChange={(e) => setRequestName(e.target.value)}
          autoFocus
        />

        <Divider />

        {/* Collection selector */}
        {collections.length > 0 ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant={mode === "existing" ? "contained" : "outlined"}
              onClick={() => setMode("existing")}
              sx={{
                fontSize: 12,
                textTransform: "none",
                flex: 1,
                boxShadow: "none",
              }}
            >
              Existing collection
            </Button>
            <Button
              size="small"
              variant={mode === "new" ? "contained" : "outlined"}
              onClick={() => setMode("new")}
              sx={{
                fontSize: 12,
                textTransform: "none",
                flex: 1,
                boxShadow: "none",
              }}
            >
              New collection
            </Button>
          </Box>
        ) : (
          <Button
            size="small"
            variant={mode === "new" ? "contained" : "outlined"}
            onClick={() => setMode("new")}
            sx={{
              fontSize: 12,
              textTransform: "none",
              flex: 1,
              boxShadow: "none",
            }}
          >
            New collection
          </Button>
        )}

        {mode === "existing" && collections.length > 0 ? (
          <FormControl size="small" fullWidth>
            <InputLabel sx={{ fontSize: 13 }}>Collection</InputLabel>
            <Select
              label="Collection"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              sx={{ fontSize: 13 }}
            >
              {collections.map((c) => (
                <MenuItem key={c.id} value={c.id} sx={{ fontSize: 13 }}>
                  {c.name}
                  <Typography
                    className="text-[11]! ml-1!"
                    color="text.disabled"
                  >
                    {c.requests.length} request
                    {c.requests.length !== 1 ? "s" : ""}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            label="Collection name"
            placeholder="e.g. My APIs"
            size="small"
            fullWidth
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          size="small"
          onClick={onClose}
          sx={{ fontSize: 12, textTransform: "none", color: "text.secondary" }}
        >
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
            disabled={!canSave}
          onClick={handleSave}
          sx={{ fontSize: 12, textTransform: "none", boxShadow: "none" }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
