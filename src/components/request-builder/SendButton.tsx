"use client";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import { useRequestStore } from "../../store/requestStore";

export default function SendButton() {
  const sendRequest = useRequestStore((state) => state.sendRequest);
  const isLoading = useRequestStore((state) => state.isLoading);
  const url = useRequestStore((state) => state.url);

  const disabled = isLoading || !url.trim();

  return (
    <Button
      variant="contained"
      onClick={sendRequest}
      disabled={disabled}
      startIcon={
        isLoading ? (
          <CircularProgress size={14} color="inherit" />
        ) : (
          <SendIcon sx={{ fontSize: 16 }} />
        )
      }
      sx={{
        minWidth: 100,
        fontWeight: 600,
        fontSize: 13,
        textTransform: "none",
        whiteSpace: "nowrap",
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
      }}
    >
      {isLoading ? "Sending…" : "Send"}
    </Button>
  );
}
