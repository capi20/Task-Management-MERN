import axios from "axios";
import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import { Grid2 as Grid, Stack } from "@mui/material";

const Home = () => {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		async function getAllTasks() {
			try {
				let res = await axios("http://localhost:5000/api/tasks");
				setTasks(res.data);
			} catch (error) {}
		}
		getAllTasks();
	}, []);

	return (
		<Grid container spacing={3}>
			{tasks.map((task) => (
				<Grid size={6}>
					<TaskCard key={task._id} {...task} />
				</Grid>
			))}
		</Grid>
	);
};
export default Home;
