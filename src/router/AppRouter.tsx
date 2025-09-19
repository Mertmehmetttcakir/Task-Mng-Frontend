import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import TaskListPage from "../features/tasks/pages/TaskListPage";
import { authStore } from "../stores/authStore";
import { observer } from "mobx-react";
import LoginForm from "../auth/LoginForm";

const PrivateRoute = observer(({children}: {children: React.ReactNode}) => {
const location = useLocation();
    if (!authStore.isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
});

export const AppRouter: React.FC = () => (
    <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/task"      
        element={
        <PrivateRoute>
          <TaskListPage />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<Navigate to="/task" />} />
  </Routes>
);