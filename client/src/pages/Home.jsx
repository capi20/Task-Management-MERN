import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import TaskCard from "../components/TaskCard";
import {
	Button,
	Grid2 as Grid,
	Pagination,
	Stack,
	Typography
} from "@mui/material";
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
	const [dueDate, setDueDate] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	useEffect(() => {
		async function getTasks(isSearch) {
			try {
				let searchTitle =
					debounceQuery !== "" ? `title=${debounceQuery}&` : "";
				let searchPriority =
					priority !== "" ? `priority=${priority}&` : "";
				let searchStatus = status !== "" ? `status=${status}&` : "";
				let searchDueDate = dueDate !== "" ? `dueDate=${dueDate}` : "";
				let res = await axios(
					isSearch
						? `http://localhost:5000/api/tasks/search?page=${page}&limit=10&${searchTitle}${searchPriority}${searchStatus}${searchDueDate}`
						: `http://localhost:5000/api/tasks?page=${page}&limit=10`
				);
				setTasks(res.data?.tasks || []);
				setTotalPages(res.data?.totalPages || 0);
			} catch (error) {}
		}
		if (
			debounceQuery !== "" ||
			priority !== "" ||
			status !== "" ||
			dueDate !== ""
		) {
			getTasks(true);
		} else {
			getTasks();
		}
	}, [reload, debounceQuery, priority, status, dueDate, page]);

	const debounce = useMemo(() => {
		let timeoutId;

		return (value) => {
			value = value.slice(-1) === " " ? value.trim() + " " : value;
			setQuery(value);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				setdebounceQuery(value);
				setPage(1);
			}, 500);
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
		setDueDate("");
		setPage(1);
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
				status !== "" ||
				dueDate !== "") && (
				<>
					<Grid container spacing={3} mb={2}>
						<Grid size={{ xs: 12, md: 4 }}>
							<Input
								label="Search"
								placeholder="Search task"
								value={query}
								onChange={(e) => debounce(e.target.value)}
							/>
						</Grid>
						<Grid size={{ xs: 3, md: 2 }}>
							<Input
								type="select"
								label="Priority"
								placeholder="Select priority"
								list={priorityList}
								value={priority}
								onChange={(e) => {
									setPriority(e.target.value);
									setPage(1);
								}}
							/>
						</Grid>
						<Grid size={{ xs: 3, md: 2 }}>
							<Input
								type="select"
								label="Status"
								placeholder="Select status"
								list={statusList}
								value={status}
								onChange={(e) => {
									setStatus(e.target.value);
									setPage(1);
								}}
							/>
						</Grid>
						<Grid size={{ xs: 3, md: 2 }}>
							<Input
								type="date"
								label="Due Date"
								value={dueDate}
								onChange={(e) => {
									setDueDate(e.target.value);
									setPage(1);
								}}
							/>
						</Grid>
						<Grid
							container
							direction="column"
							justifyContent="flex-end"
							pb={0.5}
							size={{ xs: 3, md: 2 }}>
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
					<Stack alignItems="flex-end">
						<Pagination
							count={totalPages}
							page={page}
							onChange={handlePageChange}
						/>
					</Stack>
				</>
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
					{debounceQuery !== "" ||
					priority !== "" ||
					status !== "" ||
					dueDate !== ""
						? "No task found for searched query."
						: "There is no task. Please click on add task to create a task."}
				</Typography>
			)}
		</>
	);
};
export default Home;
