import Home from "./pages/Home";
import NewTask from "./pages/NewTask";
import { Route, Routes } from "react-router-dom";
import TaskDetails from "./pages/TaskDetails";
import { AppProvider } from "./context/appContext";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import CustomAlert from "./components/CustomAlert";
import TaskReminders from "./pages/Reminders";

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
					<Route index element={<Home />} />
					<Route path="/newTask" element={<NewTask />} />
					<Route path="/task/:id" element={<TaskDetails />} />
					<Route path="/reminders" element={<TaskReminders />} />
				</Route>
				<Route path="/login" element={<Login />} />
			</Routes>
			<CustomAlert />
		</AppProvider>
	);
}

export default App;
