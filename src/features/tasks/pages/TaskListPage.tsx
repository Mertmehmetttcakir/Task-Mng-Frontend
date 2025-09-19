import React, { useEffect, useState, useMemo } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Stack,
  Typography,
  Divider,
  Modal,
  Box
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { taskStore } from "../../../stores/taskStore";
import TaskRow from "../components/TaskRow";
import TaskCreateForm from "../components/TaskCreateForm";
import TaskFilter from "../components/TaskFilter";
import CardNav from "../../../components/CardNav";

const navItems = [
  {
    label: "Görevler",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      { label: "Tüm Görevler", href: "/tasks", ariaLabel: "Tüm Görevler" },
      { label: "Yeni Görev", href: "#", ariaLabel: "Yeni Görev" }
    ]
  },
  {
    label: "Departmanlar",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [{ label: "Departman Listesi", href: "/departments", ariaLabel: "Departman Listesi" }]
  },
  {
    label: "Profil",
    bgColor: "#271E37",
    textColor: "#fff",
    links: [{ label: "Profilim", href: "/profile", ariaLabel: "Profilim" }]
  }
];

const TaskListPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const [editTask, setEditTask] = useState<any | null>(null);

  useEffect(() => {
    taskStore.loadAll();
  }, []);

  const rows = useMemo(() => {
    // Eğer store’da filteredTasks varsa onu kullanın; yoksa tasks
    // @ts-ignore
    return taskStore.filteredTasks ? taskStore.filteredTasks : taskStore.tasks;
  }, [taskStore.tasks /*, taskStore.departmentFilter, taskStore.statusFilter */]);

  if (taskStore.isLoading && taskStore.tasks.length === 0) {
    return (
      <Stack alignItems="center" mt={8}>
        <CircularProgress />
      </Stack>
    );
  }

  if (taskStore.error && taskStore.tasks.length === 0) {
    return (
      <Stack alignItems="center" mt={8} spacing={2}>
        <Alert severity="error">{taskStore.error}</Alert>
      </Stack>
    );
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <CardNav
        items={navItems}
        baseColor="#fff"
        menuColor="#0D0716"
        buttonBgColor="#0D0716"
        buttonTextColor="#fff"
        ease="power3.out"
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <Typography variant="h6">Görev Listesi</Typography>
        <TaskCreateForm />
      </Stack>

      <TaskFilter />

      <Divider sx={{ my: 2 }} />

      {taskStore.error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
            {taskStore.error}
        </Alert>
      )}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Başlık</TableCell>
            <TableCell>Açıklama</TableCell>
            <TableCell>Departman</TableCell>
            <TableCell>Durum</TableCell>
            <TableCell>Kullanıcı</TableCell>
            <TableCell>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((t: any) => (
            <TaskRow key={t.id} task={t} onEdit={() => setEditTask(t)} />
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>
                <Typography variant="body2" align="center">
                  Kayıt bulunamadı.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal open={!!editTask} onClose={() => setEditTask(null)}>
        <Box sx={{ p: 2, background: "#fff", margin: "80px auto", width: 480, borderRadius: 1 }}>
          {editTask && (
            <TaskCreateForm
              initialValues={editTask}
              isEdit
              onClose={() => setEditTask(null)}
            />
          )}
        </Box>
      </Modal>
    </Paper>
  );
});

export default TaskListPage;