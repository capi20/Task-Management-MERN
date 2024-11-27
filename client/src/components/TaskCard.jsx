import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Chip,
	IconButton,
	Stack,
	Typography
} from "@mui/material";
import { priorityList, statusList } from "../constants";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

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
	labels,
	handleMenuClick
}) => {
	return (
		<Card sx={{ height: "100%" }}>
			<CardHeader
				sx={{ pb: 0 }}
				title={
					<Typography
						variant="h6"
						style={{ flex: 1 }}
						component="p"
						className="clip-text">
						{title}
					</Typography>
				}
				action={
					<IconButton
						aria-label="task menu"
						onClick={(e) => handleMenuClick(e, _id)}>
						<MoreVertOutlinedIcon />
					</IconButton>
				}
			/>
			<CardContent>
				<Stack gap={2.5} justifyContent="space-between">
					<Typography
						variant="body1"
						component="p"
						className="clip-text">
						{description}
					</Typography>
					<Stack direction="row" justifyContent="space-between">
						<Stack direction="row" gap={2}>
							<Typography
								variant="body1"
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
								variant="body1"
								className={`status ${
									status === statusList[0]
										? "pending"
										: status === statusList[1]
										? "in-progress"
										: "completed"
								}`}>
								{status}
							</Typography>
						</Stack>
						<Typography variant="body1">
							Due: {new Date(dueDate).toLocaleDateString()}
						</Typography>
					</Stack>
					{labels.length > 0 && (
						<Stack direction="row" flexWrap="wrap" gap={1}>
							{labels.map((label) => (
								<Chip label={label} />
							))}
						</Stack>
					)}
					<Stack
						gap={0.5}
						direction="row"
						justifyContent="space-between">
						<Stack>
							<Typography variant="body2" color="grey">
								Created by: {creator.name}
							</Typography>
							<Typography variant="body2" color="grey">
								Assigned to: {assignee.name}
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
