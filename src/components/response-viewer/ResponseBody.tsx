import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";

interface Props {
  body: unknown;
}

function colorizeJson(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match))
          return `<span style="color:#185FA5">${match}</span>`;
        return `<span style="color:#1D9E75">${match}</span>`;
      }
      if (/true|false/.test(match))
        return `<span style="color:#854F0B">${match}</span>`;
      if (/null/.test(match))
        return `<span style="color:#A32D2D">${match}</span>`;
      return `<span style="color:#6B3F8A">${match}</span>`;
    },
  );
}

export default function ResponseBody({ body }: Props) {
  const [copied, setCopied] = useState(false);

  const formatted = JSON.stringify(body, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Copy button */}
      <Tooltip title={copied ? "Copied!" : "Copy"}>
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            color: "text.disabled",
            "&:hover": { color: "text.primary" },
          }}
        >
          {copied ? (
            <CheckIcon sx={{ fontSize: 15 }} />
          ) : (
            <ContentCopyIcon sx={{ fontSize: 15 }} />
          )}
        </IconButton>
      </Tooltip>

      {/* Syntax highlighted JSON */}
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 1,
          fontSize: 12,
          fontFamily: "monospace",
          lineHeight: 1.7,
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: colorizeJson(formatted) }}
      />
    </Box>
  );
}
