"use client";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LinkIcon from "@mui/icons-material/Link";
import { useRequestStore } from "../../store/requestStore";

export default function UrlInput() {
  const url = useRequestStore((state) => state.url);
  const setUrl = useRequestStore((state) => state.setUrl);
  const sendRequest = useRequestStore((state) => state.sendRequest);
  const isLoading = useRequestStore((state) => state.isLoading);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) sendRequest();
  };

  return (
    <TextField
      fullWidth
      size="small"
      placeholder="https://api.example.com/users"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      onKeyDown={handleKeyDown}
      autoFocus
      autoComplete="off"
      spellCheck={false}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon sx={{ fontSize: 16, color: "text.disabled" }} />
            </InputAdornment>
          ),
          sx: {
            fontFamily: "monospace",
            fontSize: 13,
          },
        },
      }}
    />
  );
}
