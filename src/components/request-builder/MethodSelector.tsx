"use client";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useRequestStore, HttpMethod } from "../../store/requestStore";

const METHOD_STYLES: Record<HttpMethod, { color: string; bg: string }> = {
  GET: { color: "#1D9E75", bg: "#F0FDF8" },
  POST: { color: "#185FA5", bg: "#EFF6FF" },
  PUT: { color: "#854F0B", bg: "#FFFBEB" },
  PATCH: { color: "#6B3F8A", bg: "#FAF5FF" },
  DELETE: { color: "#A32D2D", bg: "#FEF2F2" },
};

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export default function MethodSelector() {
  const method = useRequestStore((state) => state.method);
  const setMethod = useRequestStore((state) => state.setMethod);

  const { color, bg } = METHOD_STYLES[method];

  const handleChange = (e: SelectChangeEvent) => {
    setMethod(e.target.value as HttpMethod);
  };

  return (
    <Select
      value={method}
      onChange={handleChange}
      size="small"
      sx={{
        minWidth: 110,
        fontWeight: 600,
        fontSize: 13,
        color,
        backgroundColor: bg,
        ".MuiOutlinedInput-notchedOutline": { borderColor: color },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: color },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: color,
        },
        ".MuiSvgIcon-root": { color },
      }}
    >
      {METHODS.map((m) => (
        <MenuItem
          key={m}
          value={m}
          sx={{
            fontWeight: 600,
            fontSize: 13,
            color: METHOD_STYLES[m].color,
          }}
        >
          {m}
        </MenuItem>
      ))}
    </Select>
  );
}
