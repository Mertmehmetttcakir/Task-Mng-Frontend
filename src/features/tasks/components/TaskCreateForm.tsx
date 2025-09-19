import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { observer } from "mobx-react-lite";
import { AssignedDepartment, TaskStatus, TaskDto } from "../../../models/Task";
import { taskStore } from "../../../stores/taskStore";

const departmentOptions = [
  { value: AssignedDepartment.Sales, label: "Satış" },
  { value: AssignedDepartment.Marketing, label: "Pazarlama" },
  { value: AssignedDepartment.HR, label: "İnsan Kaynakları" }
];

interface TaskCreateFormProps {
  initialValues?: Partial<TaskDto>;
  isEdit?: boolean;
  onClose?: () => void;
}

const TaskCreateForm: React.FC<TaskCreateFormProps> = observer(({ initialValues, isEdit, onClose }) => {
  // Edit modunda dışarıdan açıldığı için open başlangıcı condition’lı
  const [open, setOpen] = useState<boolean>(!!isEdit);
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [department, setDepartment] = useState<number>(
    initialValues?.assignedDepartment ?? AssignedDepartment.HR
  );
  const [error, setError] = useState("");

  // Edit modunda initialValues değişirse formu senkron tut
  useEffect(() => {
    if (isEdit) {
      setOpen(true);
      setTitle(initialValues?.title ?? "");
      setDescription(initialValues?.description ?? "");
      setDepartment(initialValues?.assignedDepartment ?? AssignedDepartment.HR);
    }
  }, [isEdit, initialValues]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDepartment(AssignedDepartment.HR);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    if (!isEdit) resetForm();
    if (onClose) onClose();
  };

  const handleOpenForCreate = () => {
    if (!isEdit) {
      setOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Başlık zorunlu.");
      return;
    }

    try {
      if (isEdit && initialValues?.id) {
        await taskStore.updateTask(initialValues.id, {
            title,
            description,
            assignedDepartment: department
        });
      } else {
        await taskStore.createTask({
          title,
          description,
          assignedDepartment: department,
          status: TaskStatus.Pending
        });
        resetForm();
      }
      handleClose();
    } catch (err: any) {
      setError(err.message || "İşlem başarısız.");
    }
  };

  return (
    <>
      {!isEdit && (
        <Button variant="contained" color="primary" onClick={handleOpenForCreate}>
          Yeni Görev
        </Button>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEdit ? "Görev Düzenle" : "Yeni Görev Oluştur"}
          <IconButton
            onClick={handleClose}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8 }}
            size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Başlık"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Açıklama"
                value={description}
                onChange={e => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                select
                label="Departman"
                value={department}
                onChange={e => setDepartment(Number(e.target.value))}
                fullWidth>
                {departmentOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
              {error && <Typography color="error">{error}</Typography>}
              {taskStore.error && <Typography color="error">{taskStore.error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>İptal</Button>
            <Button type="submit" variant="contained" disabled={taskStore.isLoading}>
              {isEdit ? "Güncelle" : "Ekle"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
});

export default TaskCreateForm;