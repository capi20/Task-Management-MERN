import { useEffect, useMemo, useState } from "react";
import TaskCard from "../components/TaskCard";
import {
	Button,
	Checkbox,
	FormControlLabel,
	Grid2 as Grid,
	Menu,
	MenuItem,
	Pagination,
	Stack,
	Typography
} from "@mui/material";
import PageHeading from "../components/PageHeading";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { priorityList, statusList } from "../constants";
import { useAppContext } from "../context/appContext";
import { serverInstance } from "../axiosInstances";
import AddIcon from "@mui/icons-material/Add";
import Loader from "../components/Loader";

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
	const [checked, setChecked] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isSearch, setIsSearch] = useState(false);
	const [taskClicked, setTaskClicked] = useState("");
	const { alertHandler, user, setOpenLoader } = useAppContext();

	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = Boolean(anchorEl);

	const handleMenuClick = (event, id) => {
		setAnchorEl(event.currentTarget);
		setTaskClicked(id);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	useEffect(() => {
		async function getTasks(searchFlag) {
			try {
				setLoading(true);
				let searchTitle =
					debounceQuery !== "" ? `title=${debounceQuery}&` : "";
				let searchPriority =
					priority !== "" ? `priority=${priority}&` : "";
				let searchStatus = status !== "" ? `status=${status}&` : "";
				let searchDueDate = dueDate !== "" ? `dueDate=${dueDate}&` : "";
				let searchAssignee = checked ? `assignee=${user.name}&` : "";
				let res = await serverInstance(
					searchFlag
						? `tasks/search?page=${page}&limit=10&${searchTitle}${searchPriority}${searchStatus}${searchDueDate}${searchAssignee}`
						: `tasks?page=${page}&limit=10`
				);

				setTasks(res.data?.tasks || []);
				setTotalPages(res.data?.totalPages || 0);
				setLoading(false);
				if (searchFlag) {
					setIsSearch(true);
				}
			} catch (error) {
				setLoading(false);
				alertHandler(true, error.response.data.message, "error");
			}
		}
		if (
			debounceQuery !== "" ||
			priority !== "" ||
			status !== "" ||
			dueDate !== "" ||
			checked
		) {
			getTasks(true);
		} else {
			getTasks();
		}
	}, [reload, debounceQuery, priority, status, dueDate, page, checked]);

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
			setOpenLoader(true);
			let res = await serverInstance.delete(`tasks/${taskId}`);
			setReload(!reload);
			alertHandler(true, "Task deleted successfully!", "success");
		} catch (error) {
			alertHandler(true, error.response.data.message, "error");
		} finally {
			setOpenLoader(false);
		}
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
				<Link className="btn" to="/newTask">
					<AddIcon />
					New Task
				</Link>
			</PageHeading>

			{((!isSearch && tasks.length > 0) || isSearch) && (
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, md: 5 }}>
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
					<Grid pt={2.5} size={{ xs: 3, md: 1 }}>
						<Button variant="outlined" onClick={onClearFilter}>
							Clear
						</Button>
					</Grid>
					<Grid size={12} mb={3}>
						<FormControlLabel
							control={
								<Checkbox
									checked={checked}
									onChange={(e) =>
										setChecked(e.target.checked)
									}
									inputProps={{
										"aria-label": "assigned to me"
									}}
								/>
							}
							label="Task assigned to me"
						/>
					</Grid>
				</Grid>
			)}

			{tasks.length > 0 && !loading && (
				<>
					<Grid container spacing={2} mb={2}>
						{tasks.map((task) => (
							<Grid
								key={task._id}
								size={{ xs: 12, md: 6, xl: 4 }}>
								<TaskCard
									{...task}
									handleMenuClick={handleMenuClick}
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
			{!tasks.length && !loading && (
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
					{isSearch
						? "No task found for searched query."
						: "There is no task. Please click on add task to create a task."}
				</Typography>
			)}
			{loading && <Loader />}
			{tasks.length > 0 && (
				<Menu
					anchorEl={anchorEl}
					open={openMenu}
					onClose={handleMenuClose}
					transformOrigin={{
						vertical: "top",
						horizontal: "center"
					}}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left"
					}}>
					<MenuItem
						onClick={() => {
							navigate(`/task/${taskClicked}`);
						}}>
						Edit
					</MenuItem>
					<MenuItem
						onClick={() => {
							onTaskDelete(taskClicked);
							handleMenuClose();
						}}>
						Delete
					</MenuItem>
				</Menu>
			)}
		</>
	);
};
export default Home;
