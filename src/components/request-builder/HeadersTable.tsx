import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useRequestStore } from "@/src/store/requestStore";

export default function HeadersTable() {
  const headers = useRequestStore((state) => state.headers);
  const addHeader = useRequestStore((state) => state.addHeader);
  const updateHeader = useRequestStore((state) => state.updateHeader);
  const removeHeader = useRequestStore((state) => state.removeHeader);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {headers.length === 0 && (
        <Box sx={{ fontSize: 12, color: "text.disabled", py: 1 }}>
          No headers yet — click Add Header to get started.
        </Box>
      )}

      {headers.map((h) => (
        <Box key={h.id} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Checkbox
            checked={h.enabled}
            onChange={(e) => updateHeader(h.id, "enabled", e.target.checked)}
            size="small"
            sx={{ p: 0.5 }}
          />
          <TextField
            size="small"
            placeholder="Key"
            value={h.key}
            onChange={(e) => updateHeader(h.id, "key", e.target.value)}
            sx={{
              flex: 1,
              "& input": { fontFamily: "monospace", fontSize: 12 },
            }}
          />
          <TextField
            size="small"
            placeholder="Value"
            value={h.value}
            onChange={(e) => updateHeader(h.id, "value", e.target.value)}
            sx={{
              flex: 2,
              "& input": { fontFamily: "monospace", fontSize: 12 },
            }}
          />
          <IconButton
            size="small"
            onClick={() => removeHeader(h.id)}
            sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Box sx={{ pt: 0.5 }}>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addHeader}
          sx={{ fontSize: 12, textTransform: "none", color: "text.secondary" }}
        >
          Add Header
        </Button>
      </Box>
    </Box>
  );
}
