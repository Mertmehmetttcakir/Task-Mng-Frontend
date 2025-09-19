import React, { useCallback } from "react";
import { TableRow, TableCell, Button, Chip, Menu, MenuItem } from "@mui/material";
import { AssignedDepartment, TaskStatus, TaskDto } from "../../../models/Task";
import { taskStore } from "../../../stores/taskStore";
import { statusMeta, allStatuses } from "../utils/statusMeta";

interface TaskRowProps {
    task: TaskDto;
    onEdit?: () => void;
}

const TaskRow: React.FC<TaskRowProps> = React.memo(({ task, onEdit }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const openMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const closeMenu = () => setAnchorEl(null);

    const handleStatusSelect = (newStatus: TaskStatus) => {
        closeMenu();
        if (newStatus !== task.status) {
            taskStore.updateTaskStatus(task.id, newStatus);
        }
    };

    const handleDelete = () => {
        if (window.confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
            taskStore.deleteTask(task.id);
        }
    };
    const handleEdit = () => onEdit && onEdit();

    return (
        <TableRow hover>
            <TableCell>{task.id ?? "-"}</TableCell>
            <TableCell>{task.title ?? "-"}</TableCell>
            <TableCell>{task.description ?? "-"}</TableCell>
            <TableCell>{AssignedDepartment[task.assignedDepartment] ?? "-"}</TableCell>
            <TableCell>
                <Chip
                  label={statusMeta[task.status].label}
                  color={statusMeta[task.status].color}
                  size="small"
                  onClick={openMenu}
                  sx={{ cursor: "pointer" }}
                />
                <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu}>
                    {allStatuses.map(s => (
                        <MenuItem
                          key={s}
                          selected={s === task.status}
                          onClick={() => handleStatusSelect(s)}
                          disabled={taskStore.isLoading}
                        >
                          {statusMeta[s].label}
                        </MenuItem>
                    ))}
                </Menu>
            </TableCell>
            <TableCell>{task.user?.name ?? "-"}</TableCell>
            <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={handleEdit}
                >
                  Düzenle
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleDelete}
                  sx={{ ml: 1 }}
                >
                  Sil
                </Button>
            </TableCell>
        </TableRow>
    );
});

export default TaskRow;
