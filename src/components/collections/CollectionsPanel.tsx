import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import { useState } from "react";
import {
  useCollectionStore,
  Collection,
  SavedRequest,
} from "@/src/store/collectionStore";
import { useRequestStore, HttpMethod } from "@/src/store/requestStore";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "#1D9E75",
  POST: "#185FA5",
  PUT: "#854F0B",
  PATCH: "#6B3F8A",
  DELETE: "#A32D2D",
};

function RequestRow({
  request,
  collectionId,
}: {
  request: SavedRequest;
  collectionId: string;
}) {
  const removeRequest = useCollectionStore((state) => state.removeRequest);
  const setMethod = useRequestStore((state) => state.setMethod);
  const setUrl = useRequestStore((state) => state.setUrl);
  const setBody = useRequestStore((state) => state.setBody);
  const restoreHeaders = useRequestStore((state) => state.restoreHeaders);

  const handleRestore = () => {
    setMethod(request.method);
    setUrl(request.url);
    setBody(request.body);
    restoreHeaders(request.headers);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        pl: 4,
        pr: 1,
        py: 0.75,
        cursor: "pointer",
        "&:hover": { bgcolor: "grey.50" },
        "&:hover .row-actions": { opacity: 1 },
      }}
      onClick={handleRestore}
    >
      <Typography
        className="text-[10]! font-bold!"
        sx={{ minWidth: 44, color: METHOD_COLORS[request.method] }}
      >
        {request.method}
      </Typography>
      <Typography
        className="text-[12]!"
        sx={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {request.name}
      </Typography>
      <Box
        className="row-actions"
        sx={{ opacity: 0, transition: "opacity 0.15s" }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            removeRequest(collectionId, request.id);
          }}
          sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}
        >
          <DeleteIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
    </Box>
  );
}

function CollectionRow({ collection }: { collection: Collection }) {
  const renameCollection = useCollectionStore(
    (state) => state.renameCollection,
  );
  const removeCollection = useCollectionStore(
    (state) => state.removeCollection,
  );

  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(collection.name);

  const handleRename = () => {
    if (name.trim()) renameCollection(collection.id, name.trim());
    setEditing(false);
  };

  return (
    <Box>
      {/* Collection header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          cursor: "pointer",
          "&:hover": { bgcolor: "grey.50" },
          "&:hover .col-actions": { opacity: 1 },
        }}
        onClick={() => !editing && setOpen((o) => !o)}
      >
        {open ? (
          <FolderOpenOutlinedIcon
            sx={{ fontSize: 16, color: "text.secondary" }}
          />
        ) : (
          <FolderOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        )}

        {editing ? (
          <TextField
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
            }}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            sx={{ flex: 1, "& input": { fontSize: 12, py: 0.5 } }}
          />
        ) : (
          <Typography className="text-[12]! font-semibold" sx={{ flex: 1 }}>
            {collection.name}
          </Typography>
        )}

        <Typography
          className="text-[10]!"
          color="text.disabled"
          sx={{ flexShrink: 0 }}
        >
          {collection.requests.length}
        </Typography>

        <Box
          className="col-actions"
          sx={{ opacity: 0, transition: "opacity 0.15s", display: "flex" }}
        >
          {editing ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRename();
              }}
            >
              <CheckIcon sx={{ fontSize: 14, color: "success.main" }} />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
              sx={{
                color: "text.disabled",
                "&:hover": { color: "text.primary" },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              removeCollection(collection.id);
            }}
            sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}
          >
            <DeleteIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Box>

        {open ? (
          <ExpandLessIcon sx={{ fontSize: 14, color: "text.disabled" }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 14, color: "text.disabled" }} />
        )}
      </Box>

      {/* Requests */}
      <Collapse in={open}>
        {collection.requests.length === 0 ? (
          <Typography
            className="text-[11]! pl-1! py-[0.75px]!"
            color="text.disabled"
          >
            No saved requests yet.
          </Typography>
        ) : (
          collection.requests.map((r) => (
            <RequestRow key={r.id} request={r} collectionId={collection.id} />
          ))
        )}
        <Divider sx={{ mt: 0.5 }} />
      </Collapse>
    </Box>
  );
}

export default function CollectionsPanel() {
  const collections = useCollectionStore((state) => state.collections);

  if (collections.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CollectionsBookmarkOutlinedIcon
          sx={{ fontSize: 32, color: "text.disabled", mb: 1 }}
        />
        <Typography className="text-[13]!" color="text.disabled">
          No collections yet — save a request to create one.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {collections.map((c) => (
        <CollectionRow key={c.id} collection={c} />
      ))}
    </Box>
  );
}
