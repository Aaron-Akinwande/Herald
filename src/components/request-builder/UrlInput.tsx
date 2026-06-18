"use client";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import LinkIcon from "@mui/icons-material/Link";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useRequestStore } from "../../store/requestStore";
import { useEnvStore } from "../../store/envStore";

function findUnresolved(url: string, keys: string[]): string[] {
  const matches = url.match(/\{\{([^}]+)\}\}/g) ?? [];
  return matches.map((m) => m.slice(2, -2)).filter((k) => !keys.includes(k));
}

export default function UrlInput() {
  const url = useRequestStore((state) => state.url);
  const setUrl = useRequestStore((state) => state.setUrl);
  const sendRequest = useRequestStore((state) => state.sendRequest);
  const isLoading = useRequestStore((state) => state.isLoading);
  const variables = useEnvStore((state) => state.variables);

  const enabledKeys = variables
    .filter((v) => v.enabled && v.key.trim())
    .map((v) => v.key);

  const unresolved = findUnresolved(url, enabledKeys);
  const hasUnresolved = unresolved.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) sendRequest();
  };

  return (
    <TextField
      fullWidth
      size="small"
      placeholder="https://api.example.com/users  or  {{BASE_URL}}/users"
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
          endAdornment: hasUnresolved ? (
            <InputAdornment position="end">
              <Tooltip
                title={`Unresolved variable${unresolved.length > 1 ? "s" : ""}: ${unresolved.map((k) => `{{${k}}}`).join(", ")}`}
              >
                <WarningAmberIcon
                  sx={{
                    fontSize: 16,
                    color: "warning.main",
                    cursor: "default",
                  }}
                />
              </Tooltip>
            </InputAdornment>
          ) : null,
          sx: {
            fontFamily: "monospace",
            fontSize: 13,
            ...(hasUnresolved && {
              "& fieldset": { borderColor: "warning.main" },
              "&:hover fieldset": { borderColor: "warning.main" },
            }),
          },
        },
      }}
    />
  );
}
