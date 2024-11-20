import {
	Box,
	Card,
	CardContent,
	CardHeader,
	IconButton,
	Stack,
	Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { priorityList, statusList } from "../constants";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const TaskCard = ({
	_id,
	title,
	description,
	priority,
	status,
	dueDate,
	createdAt,
	updatedAt,
	creator,
	assignee,
	navigateTo,
	onTaskDelete
}) => {
	return (
		<Card>
			<CardHeader
				sx={{ pb: 0 }}
				title={
					<Stack direction="row" justifyContent="space-between">
						<Typography
							variant="h5"
							style={{ flex: 1 }}
							className="clip-text">
							{title}
						</Typography>
						<IconButton onClick={navigateTo}>
							<EditOutlinedIcon />
						</IconButton>
						<IconButton onClick={() => onTaskDelete(_id)}>
							<DeleteOutlineOutlinedIcon />
						</IconButton>
					</Stack>
				}
			/>
			<CardContent>
				<Stack gap={3}>
					<Typography
						variant="body"
						component="p"
						className="clip-text">
						{description}
					</Typography>
					<Stack direction="row" justifyContent="space-between">
						<Stack direction="row" gap={2}>
							<Typography
								variant="body"
								className={`priority ${
									priority === priorityList[0]
										? "low"
										: priority === priorityList[1]
										? "medium"
										: "high"
								}`}>
								{priority} Priority
							</Typography>
							<Typography
								variant="body"
								className={`status ${
									status === statusList[0]
										? "pending"
										: status === statusList[1]
										? "in-progress"
										: "completed"
								}`}>
								{status === "Todo" ? "Pending" : status}
							</Typography>
						</Stack>
						<Typography variant="body">
							Due: {new Date(dueDate).toLocaleDateString()}
						</Typography>
					</Stack>
					<Stack
						gap={0.5}
						direction="row"
						justifyContent="space-between">
						<Stack>
							<Typography variant="body2" color="grey">
								Created by: {creator}
							</Typography>
							<Typography variant="body2" color="grey">
								Assigned to: {assignee}
							</Typography>
						</Stack>
						<Stack alignItems="flex-end">
							<Typography variant="body2" color="grey">
								Created at:{" "}
								{new Date(createdAt).toLocaleDateString()}
							</Typography>
							<Typography variant="body2" color="grey">
								Last updated:{" "}
								{new Date(updatedAt).toLocaleDateString()}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};
export default TaskCard;
