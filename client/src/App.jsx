import { Box } from "@mui/material";
import Home from "./pages/Home";
import NewTask from "./pages/NewTask";
import { Route, Routes } from "react-router-dom";
import TaskDetails from "./pages/TaskDetails";

function App() {
	return (
		<Box component="main" p={5}>
			<Routes>
				<Route path="/" Component={Home} />
				<Route path="/newTask" Component={NewTask} />
				<Route path="/task/:id" Component={TaskDetails} />
			</Routes>
		</Box>
	);
}

export default App;
