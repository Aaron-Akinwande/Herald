import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import TuneIcon from "@mui/icons-material/Tune";
import { useEnvStore } from "../../store/envStore";
import { useRequestStore } from "../../store/requestStore";

function findUsedVars(url: string): string[] {
  return (url.match(/\{\{([^}]+)\}\}/g) ?? []).map((m) => m.slice(2, -2));
}

export default function EnvPanel() {
  const variables = useEnvStore((state) => state.variables);
  const addVariable = useEnvStore((state) => state.addVariable);
  const updateVariable = useEnvStore((state) => state.updateVariable);
  const removeVariable = useEnvStore((state) => state.removeVariable);
  const clearVariables = useEnvStore((state) => state.clearVariables);
  const url = useRequestStore((state) => state.url);

  const usedVars = findUsedVars(url);

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
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography className="text-[12]! font-semibold" color="text.secondary">
          {variables.length} variable{variables.length !== 1 ? "s" : ""}
        </Typography>
        {variables.length > 0 && (
          <Tooltip title="Clear all variables">
            <IconButton
              size="small"
              onClick={clearVariables}
              sx={{
                color: "text.disabled",
                "&:hover": { color: "error.main" },
              }}
            >
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Active URL vars hint */}
        {usedVars.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 0.5 }}>
            <Typography className="text-[11]! w-full!" color="text.disabled">
              Used in current URL:
            </Typography>
            {usedVars.map((k) => {
              const defined = variables.some((v) => v.enabled && v.key === k);
              return (
                <Chip
                  key={k}
                  label={`{{${k}}}`}
                  size="small"
                  color={defined ? "success" : "warning"}
                  variant="outlined"
                  sx={{ fontSize: 10, height: 20, fontFamily: "monospace" }}
                />
              );
            })}
          </Box>
        )}

        {/* Column headers */}
        {variables.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, px: 0.5 }}>
            <Box sx={{ width: 24 }} />
            <Typography
              className="text-[10]!"
              color="text.disabled"
              sx={{ flex: 1 }}
            >
              KEY
            </Typography>
            <Typography
              className="text-[10]!"
              color="text.disabled"
              sx={{ flex: 1.5 }}
            >
              VALUE
            </Typography>
            <Box sx={{ width: 28 }} />
          </Box>
        )}

        {/* Variable rows */}
        {variables.map((v) => {
          const isUsed = usedVars.includes(v.key);
          return (
            <Box
              key={v.id}
              sx={{ display: "flex", gap: 1, alignItems: "center" }}
            >
              <Checkbox
                checked={v.enabled}
                onChange={(e) =>
                  updateVariable(v.id, "enabled", e.target.checked)
                }
                size="small"
                sx={{ p: 0.5 }}
              />
              <TextField
                size="small"
                placeholder="KEY"
                value={v.key}
                onChange={(e) => updateVariable(v.id, "key", e.target.value)}
                sx={{
                  flex: 1,
                  "& input": { fontFamily: "monospace", fontSize: 11 },
                  ...(isUsed && {
                    "& fieldset": { borderColor: "success.main" },
                  }),
                }}
              />
              <TextField
                size="small"
                placeholder="value"
                value={v.value}
                onChange={(e) => updateVariable(v.id, "value", e.target.value)}
                sx={{
                  flex: 1.5,
                  "& input": { fontFamily: "monospace", fontSize: 11 },
                }}
              />
              <IconButton
                size="small"
                onClick={() => removeVariable(v.id)}
                sx={{
                  color: "text.disabled",
                  "&:hover": { color: "error.main" },
                }}
              >
                <DeleteIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          );
        })}

        {/* Empty state */}
        {variables.length === 0 && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <TuneIcon sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
            <Typography className="text-[13]!" color="text.disabled">
              No variables yet.
            </Typography>
            <Typography className="text-[12]!" color="text.disabled">
              Define a key like BASE_URL and use it as {"{{BASE_URL}}"} in your
              URL.
            </Typography>
          </Box>
        )}

        <Divider />

        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addVariable}
          sx={{
            fontSize: 12,
            textTransform: "none",
            color: "text.secondary",
            alignSelf: "flex-start",
          }}
        >
          Add Variable
        </Button>
      </Box>
    </Box>
  );
}
