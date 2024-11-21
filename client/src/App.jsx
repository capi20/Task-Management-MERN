import { Alert, Box, Snackbar } from "@mui/material";
import Home from "./pages/Home";
import NewTask from "./pages/NewTask";
import { Route, Routes } from "react-router-dom";
import TaskDetails from "./pages/TaskDetails";
import Header from "./components/Header";
import { AppProvider, useAppContext } from "./context/appContext";
import AppLayout from "./components/AppLayout";

function App() {
	return (
		<AppProvider>
			<Header />
			<Box component="main" className="app-layout" mt={11}>
				<Routes>
					<Route path="/" Component={Home} />
					<Route path="/newTask" Component={NewTask} />
					<Route path="/task/:id" Component={TaskDetails} />
				</Routes>
			</Box>
			<AppLayout />
		</AppProvider>
	);
}

export default App;
