import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props {
  headers: Record<string, string>;
}

export default function ResponseHeaders({ headers }: Props) {
  const entries = Object.entries(headers);

  if (entries.length === 0) {
    return (
      <Typography className="text-[13px]!" color="text.disabled">
        No response headers.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      {entries.map(([key, value]) => (
        <Box key={key} sx={{ display: "flex", gap: 2, fontSize: 12 }}>
          <Box
            sx={{
              fontFamily: "monospace",
              color: "primary.main",
              minWidth: 200,
              fontWeight: 500,
            }}
          >
            {key}
          </Box>
          <Box
            sx={{
              fontFamily: "monospace",
              color: "text.secondary",
              wordBreak: "break-all",
            }}
          >
            {value}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
