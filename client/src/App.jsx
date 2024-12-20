import NewTask from "./pages/NewTask";
import { Navigate, Route, Routes } from "react-router-dom";
import TaskDetails from "./pages/TaskDetails";
import { AppProvider } from "./context/appContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import CustomAlert from "./components/CustomAlert";
import TaskReminders from "./pages/Reminders";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
	return (
		<AppProvider>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<AppLayout />
						</ProtectedRoute>
					}>
					<Route index element={<Dashboard />} />
					<Route path="/newTask" element={<NewTask />} />
					<Route path="/task/:id" element={<TaskDetails />} />
					<Route path="/reminders" element={<TaskReminders />} />
					<Route path="/profile" element={<Profile />} />
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
			<CustomAlert />
		</AppProvider>
	);
}

export default App;
