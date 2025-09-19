import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";

const users = [
  { id: 1, name: "Mary Glenn", email: "mary@company.com", department: "Sales" },
  { id: 2, name: "John Doe", email: "john@company.com", department: "Marketing" },
  { id: 3, name: "Alice Brown", email: "alice@company.com", department: "Engineering" },
];

const UserList: React.FC = () => {
  return (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.id}
          secondaryAction={
            <Button variant="outlined" size="small" color="secondary">
              Mesaj Gönder
            </Button>
          }
        >
          <ListItemAvatar>
            <Avatar>{user.name.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={`${user.email} - ${user.department}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
