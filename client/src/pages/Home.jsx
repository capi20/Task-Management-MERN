import axios from "axios";
import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import { Button, Grid2 as Grid, Stack } from "@mui/material";
import PageHeading from "../components/PageHeading";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

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
		<>
			<PageHeading title="Dashboard">
				<Link to="/newTask" className="btn">
					<AddIcon />
					Add Task
				</Link>
			</PageHeading>
			<Grid container spacing={3}>
				{tasks.map((task) => (
					<Grid size={6}>
						<TaskCard key={task._id} {...task} />
					</Grid>
				))}
			</Grid>
		</>
	);
};
export default Home;
