import { Box } from "@mui/material";
import Home from "./pages/Home";
import NewTask from "./pages/NewTask";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<Box component="main" p={5}>
			<Routes>
				<Route path="/" Component={Home} />
				<Route path="/newTask" Component={NewTask} />
			</Routes>
		</Box>
	);
}

export default App;
