import React from "react";
import { TableRow,TableCell } from "@mui/material";
import { AssignedDepartment, TaskStatus, TaskDto } from "../../../models/Task";

interface TaskRowProps {
    task: TaskDto;
}

const TaskRow: React.FC<TaskRowProps> = React.memo(({ task }) => (
    <TableRow>
        <TableCell>{task.id ?? "-"}</TableCell>
        <TableCell>{task.title ?? "-"}</TableCell>
        <TableCell>{task.description ?? "-"}</TableCell>
        <TableCell>{AssignedDepartment[task.assignedDepartment] ?? "-"}</TableCell>
        <TableCell>{TaskStatus[task.status] ?? "-"}</TableCell>
        <TableCell>{task.user.name ?? "-"}</TableCell>
    </TableRow>
  ));
    
export default TaskRow;
