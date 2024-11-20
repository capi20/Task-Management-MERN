import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import TaskCard from "../components/TaskCard";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import PageHeading from "../components/PageHeading";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { priorityList, statusList } from "../constants";

const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [reload, setReload] = useState(false);
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [debounceQuery, setdebounceQuery] = useState("");
	const [priority, setPriority] = useState("");
	const [status, setStatus] = useState("");

	useEffect(() => {
		async function getAllTasks(isSearch) {
			try {
				let searchTitle =
					debounceQuery !== "" ? `title=${debounceQuery}&` : "";
				let searchPriority =
					priority !== "" ? `priority=${priority}&` : "";
				let searchStatus = status !== "" ? `status=${status}` : "";
				let res = await axios(
					isSearch
						? `http://localhost:5000/api/tasks/search?${searchTitle}${searchPriority}${searchStatus}`
						: "http://localhost:5000/api/tasks"
				);
				setTasks(res.data);
			} catch (error) {}
		}
		if (debounceQuery !== "" || priority !== "" || status !== "") {
			getAllTasks(true);
		} else {
			getAllTasks();
		}
	}, [reload, debounceQuery, priority, status]);

	const debounce = useMemo(() => {
		let timeoutId;

		return (value) => {
			value = value.slice(-1) === " " ? value.trim() + " " : value;
			setQuery(value);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => setdebounceQuery(value), 500);
		};
	}, []);

	const onTaskDelete = async (taskId) => {
		try {
			let res = await axios.delete(
				`http://localhost:5000/api/tasks/${taskId}`
			);
			setReload(!reload);
		} catch (error) {}
	};

	const onClearFilter = () => {
		setQuery("");
		setdebounceQuery("");
		setPriority("");
		setStatus("");
	};

	return (
		<>
			<PageHeading title="Dashboard">
				<Link to="/newTask" className="btn">
					<AddIcon />
					Add Task
				</Link>
			</PageHeading>

			{(tasks.length > 0 ||
				debounceQuery !== "" ||
				priority !== "" ||
				status !== "") && (
				<Grid container spacing={3}>
					<Grid size={6}>
						<Input
							label="Search"
							placeholder="Search task"
							value={query}
							onChange={(e) => debounce(e.target.value)}
						/>
					</Grid>
					<Grid size={2}>
						<Input
							type="select"
							label="Priority"
							placeholder="Select priority"
							list={priorityList}
							value={priority}
							onChange={(e) => setPriority(e.target.value)}
						/>
					</Grid>
					<Grid size={2}>
						<Input
							type="select"
							label="Status"
							placeholder="Select status"
							list={statusList}
							value={status}
							onChange={(e) => setStatus(e.target.value)}
						/>
					</Grid>
					<Grid
						container
						direction="column"
						justifyContent="flex-end"
						alignItems="flex-end"
						pb={0.5}>
						<Button variant="outlined" onClick={onClearFilter}>
							Clear Filters
						</Button>
					</Grid>
					{tasks.length > 0 &&
						tasks.map((task) => (
							<Grid
								key={task._id}
								size={{ xs: 12, md: 6, xl: 4 }}>
								<TaskCard
									{...task}
									navigateTo={() =>
										navigate(`/task/${task._id}`)
									}
									onTaskDelete={onTaskDelete}
								/>
							</Grid>
						))}
				</Grid>
			)}
			{!tasks.length && (
				<Typography
					variant="h5"
					component="div"
					color="grey"
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "50vh"
					}}>
					{debounceQuery !== "" || priority !== "" || status !== ""
						? "No task found for searched query."
						: "There is no task. Please click on add task to create a task."}
				</Typography>
			)}
		</>
	);
};
export default Home;
