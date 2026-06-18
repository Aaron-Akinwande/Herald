import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RestoreIcon from "@mui/icons-material/Restore";
import { HttpMethod, useRequestStore } from "@/src/store/requestStore";
import { useHistoryStore } from "@/src/store/historyStore";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "#1D9E75",
  POST: "#185FA5",
  PUT: "#854F0B",
  PATCH: "#6B3F8A",
  DELETE: "#A32D2D",
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function StatusBadge({ status }: { status?: number }) {
  if (!status) return null;
  const color = status < 300 ? "success" : status < 400 ? "warning" : "error";
  return (
    <Chip
      label={status}
      color={color}
      size="small"
      sx={{
        height: 18,
        fontSize: 10,
        fontWeight: 700,
        ".MuiChip-label": { px: 0.75 },
      }}
    />
  );
}

export default function HistoryPanel() {
  const entries = useHistoryStore((state) => state.entries);
  const removeEntry = useHistoryStore((state) => state.removeEntry);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const setMethod = useRequestStore((state) => state.setMethod);
  const setUrl = useRequestStore((state) => state.setUrl);
  const setBody = useRequestStore((state) => state.setBody);
  const restoreHeaders = useRequestStore((state) => state.restoreHeaders);

  const handleRestore = (entry: (typeof entries)[0]) => {
    setMethod(entry.method);
    setUrl(entry.url);
    setBody(entry.body);
    restoreHeaders(entry.headers);
  };

  // Empty state
  if (entries.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <RestoreIcon sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
        <Typography className="text-[13]!" color="text.disabled">
          No history yet — send a request to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
        }}
      >
        <Typography className="text-[12]! font-semibold" color="text.secondary">
          {entries.length} request{entries.length !== 1 ? "s" : ""}
        </Typography>
        <Tooltip title="Clear all history">
          <IconButton
            size="small"
            onClick={clearHistory}
            sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}
          >
            <DeleteSweepIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Entries */}
      {entries.map((entry, index) => (
        <Box key={entry.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1.25,
              cursor: "pointer",
              "&:hover": { bgcolor: "grey.50" },
              "&:hover .entry-actions": { opacity: 1 },
            }}
            onClick={() => handleRestore(entry)}
          >
            {/* Method badge */}
            <Typography
              className="text-[11]! font-bold"
              sx={{ minWidth: 52, color: METHOD_COLORS[entry.method] }}
            >
              {entry.method}
            </Typography>

            {/* URL */}
            <Typography
              className="text-[12]! font-mono"
              color="text.primary"
              sx={{
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {entry.url}
            </Typography>

            {/* Status + time */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
              }}
            >
              <StatusBadge status={entry.status} />
              <Typography className="text-[10]!" color="text.disabled">
                {formatTime(entry.timestamp)}
              </Typography>
            </Box>

            {/* Delete button — visible on hover */}
            <Box
              className="entry-actions"
              sx={{ opacity: 0, transition: "opacity 0.15s" }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEntry(entry.id);
                }}
                sx={{
                  color: "text.disabled",
                  "&:hover": { color: "error.main" },
                }}
              >
                <DeleteIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>
          </Box>

          {index < entries.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
}
