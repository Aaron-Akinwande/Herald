"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRequestStore } from "@/src/store/requestStore";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const PLACEHOLDER = JSON.stringify({ key: "value" }, null, 2);

function isValidJson(str: string): boolean {
  if (!str.trim()) return true;
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export default function BodyEditor() {
  const method = useRequestStore((state) => state.method);
  const body = useRequestStore((state) => state.body);
  const setBody = useRequestStore((state) => state.setBody);
  const [touched, setTouched] = useState(false);

  const disabled = method === "GET" || method === "DELETE";
  const hasError = touched && !isValidJson(body);

  // Disabled state
  if (disabled) {
    return (
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 1,
          p: 3,
          textAlign: "center",
          bgcolor: "grey.50",
        }}
      >
        <Typography className="text-[12px]!" color="text.disabled">
          {method} requests do not have a body.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Validation error */}
      {hasError && (
        <Alert severity="error" sx={{ fontSize: 12, py: 0.5 }}>
          Invalid JSON — fix the syntax before sending.
        </Alert>
      )}

      {/* Editor */}
      <Box
        sx={{
          border: "1px solid",
          borderColor: hasError ? "error.main" : "divider",
          borderRadius: 1,
          overflow: "hidden",
          transition: "border-color 0.2s",
        }}
      >
        <MonacoEditor
          height="240px"
          language="json"
          value={body || PLACEHOLDER}
          onChange={(val) => {
            setTouched(true);
            setBody(val ?? "");
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </Box>

      {/* Footer hints */}
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 0.5 }}>
        <Typography className="text-[11px]!" color="text.disabled">
          JSON only — set Content-Type: application/json in Headers
        </Typography>
        <Typography
          className="text-[11px]!"
          color={hasError ? "error.main" : "text.disabled"}
        >
          {hasError
            ? "Invalid JSON"
            : isValidJson(body) && body.trim()
              ? "Valid JSON ✓"
              : ""}
        </Typography>
      </Box>
    </Box>
  );
}
