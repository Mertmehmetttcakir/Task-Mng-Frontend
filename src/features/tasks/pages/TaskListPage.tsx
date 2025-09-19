import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { taskStore } from "../../../stores/taskStore";
import { useNavigate } from "react-router";
import TaskFilter from "../components/TaskFilter";
import TaskCreateForm from "../components/TaskCreateForm";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Button
} from "@mui/material";
import TaskRow from "../components/TaskRow";

import CardNav from "../../../components/CardNav";
  
  
const TaskListPage: React.FC = observer(() => {
  const navigate = useNavigate();
 const handleLogout = () => {
    navigate("/login");
};
  
  useEffect(() => {
    taskStore.loadAll();
  }, []);

  if (taskStore.isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (taskStore.error) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <Alert severity="error">{taskStore.error}</Alert>
      </Box>
    );
  }

  const navItems = [
  {
    label: "Görevler",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      { label: "Tüm Görevler", href: "/tasks", ariaLabel: "Tüm Görevler" },
      { label: "Yeni Görev", href: "/tasks/new", ariaLabel: "Yeni Görev Oluştur" }
    ]
  },
  {
    label: "Departmanlar",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [
      { label: "Departman Listesi", href: "/departments", ariaLabel: "Departman Listesi" }
    ]
  },
  {
    label: "Profil",
    bgColor: "#271E37",
    textColor: "#fff",
    links: [
      { label: "Profilim", href: "/profile", ariaLabel: "Profilim" }
    ]
  }
];

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
      <Box mt={8}>  
      <TaskFilter />
      </Box>
       <Box display="flex" justifyContent="flex-end" mb={2}>
  <TaskCreateForm />
</Box>
      <Typography variant="h6" gutterBottom>
        Tüm Görevler ({taskStore.tasks.length}) 
      </Typography>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Başlık</TableCell>
            <TableCell>Açıklama</TableCell>
            <TableCell>Departman</TableCell>
            <TableCell>Durum</TableCell>
            <TableCell>Oluşturan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {taskStore.tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </TableBody>
               <Box display="flex" justifyContent="flex-end" mt={2}>
      <Button variant="outlined" color="secondary" onClick={handleLogout}>
        Çıkış Yap
      </Button>
    </Box> 
      </Table>
    </Paper>
 
  );
});

export default TaskListPage;