import React, { useState } from "react";
import { observer } from "mobx-react";
import { taskStore } from "../../../stores/taskStore";
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TaskStatus, AssignedDepartment } from "../../../models/Task";
import { TaskService } from "../../../api/TaskService";

const departmentOptions = [
  { value: AssignedDepartment.Sales, label: "Satış" },
  { value: AssignedDepartment.Marketing, label: "Pazarlama" },
  { value: AssignedDepartment.HR, label: "İnsan Kaynakları" },
];

const TaskCreateForm: React.FC = observer(() => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [departman, setDepartman] = useState(AssignedDepartment.HR);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setDepartman(AssignedDepartment.HR);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const newTask = await TaskService.create({
        title,
        description,
        assignedDepartment: departman,
        status: TaskStatus.Pending,
      });
      taskStore.tasks.push(newTask);
      handleClose();
    } catch (e: any) {
      setError(e.message || "Görev oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Yeni Görev Oluştur
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Yeni Görev Oluştur
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Başlık"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Açıklama"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                select
                label="Departman"
                value={departman}
                onChange={(e) => setDepartman(Number(e.target.value))}
                fullWidth
              >
                {departmentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {error && <Typography color="error">{error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              İptal
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? "Ekleniyor..." : "Ekle"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
});

export default TaskCreateForm;