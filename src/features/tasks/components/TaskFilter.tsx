import React from "react";
import { observer } from "mobx-react";
import { taskStore } from "../../../stores/taskStore";
import {  MenuItem, TextField, Stack ,Paper} from "@mui/material";
import { AssignedDepartment , TaskStatus} from "../../../models/Task";

const departmentOptions = [
    { value: "", label: "Tümü" },
    { value: AssignedDepartment.Sales, label: "Satış" },
    { value: AssignedDepartment.Marketing, label: "Pazarlama" },
    { value: AssignedDepartment.HR, label: "İnsan Kaynakları" },
];
const statusOptions = [
    { value: "", label: "Tümü" },
    { value: TaskStatus.Pending, label: "Beklemede" },
    { value: TaskStatus.Rejected, label: "Reddedildi" },
    { value: TaskStatus.Completed, label: "Tamamlandı" },
];

const TaskFilter: React.FC = observer(() => {
    const [department, setDepartment] = React.useState("");
    const [status, setStatus] = React.useState("");


    const filteredTasks = taskStore.tasks.filter(task => {
        const depMatch = department === "" || task.assignedDepartment === Number(department);
        const statusMatch = status === "" || task.status === Number(status);
        return depMatch && statusMatch;
    });
    return (
        <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} mb={2}>
            <TextField
            select
                label="Departman"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                sx={{ minWidth: 150 }}
            >
                {departmentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
            select
                label="Durum"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ minWidth: 150 }}
            >
                {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            </Stack>
            </Paper>
    );
});

export default TaskFilter;