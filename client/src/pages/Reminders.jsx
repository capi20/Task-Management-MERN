import React, { useEffect, useState } from "react";
import {
	List,
	ListItem,
	Typography,
	IconButton,
	Badge,
	Modal,
	Box,
	Stack
} from "@mui/material";
import { Link } from "react-router-dom";
import { REMINDER_NO_TASK, REMINDER_TASK } from "../constants";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: { xs: "80vw", sm: "500px" },
	maxHeight: 500,
	overflowY: "auto",
	bgcolor: "background.paper",
	p: 2,
	borderRadius: "10px"
};

const TaskReminders = () => {
	const [reminders, setReminders] = useState([]);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		const eventSource = new EventSource(
			"http://localhost:5000/api/tasks/reminders",
			{ withCredentials: true }
		);

		eventSource.onmessage = (event) => {
			const remindersData = JSON.parse(event.data);
			setReminders(remindersData);
			setSnackbarOpen(true);
		};

		eventSource.onerror = (err) => {
			console.error("Error with SSE:", err);
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, []);

	return (
		<>
			<IconButton color="inherit" onClick={handleOpen}>
				<Badge badgeContent={reminders.length} color="primary">
					<NotificationsOutlinedIcon />
				</Badge>
			</IconButton>
			<Modal open={open} onClose={handleClose}>
				<Box sx={style}>
					<Stack direction="row" gap={1} mb={1} alignItems="center">
						<Typography variant="h3" component="span">
							⏰
						</Typography>
						<Typography variant="h6" color="warning.light">
							{reminders.length > 0
								? REMINDER_TASK
								: REMINDER_NO_TASK}
						</Typography>
					</Stack>
					<List>
						{reminders.map((reminder) => (
							<ListItem key={reminder._id}>
								<Typography variant="body1">
									<Typography
										variant="body1"
										fontSize={18}
										component="span"
										fontWeight={700}>
										<Link
											to={`/task/${reminder._id}`}
											onClick={handleClose}
											style={{
												textDecoration: "underline"
											}}>
											{reminder.title}
										</Link>
									</Typography>{" "}
									-- {reminder.priority} priority --{" "}
									{reminder.status}
								</Typography>
							</ListItem>
						))}
					</List>
				</Box>
			</Modal>
		</>
	);
};

export default TaskReminders;
