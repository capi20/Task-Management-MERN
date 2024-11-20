import { Stack, Typography } from "@mui/material";
import SectionWrapper from "./SectionWrapper";
import { Link } from "react-router-dom";

const TaskCard = ({
	_id,
	title,
	description,
	priority,
	dueDate,
	createdAt,
	updatedAt
}) => {
	return (
		<SectionWrapper>
			<Stack
				direction="row"
				mb={2}
				alignItems="center"
				justifyContent="space-between">
				<Typography variant="h6" fontWeight={600}>
					<Link to={`/task/${_id}`}>{title}</Link>
				</Typography>
				<Typography
					variant="body"
					component="p"
					fontWeight={600}
					color={
						priority === "High"
							? "error"
							: priority === "Medium"
							? "warning"
							: "secondary"
					}>
					{priority}
				</Typography>
			</Stack>
			<Typography variant="body" component="p" mb={2}>
				{description}
			</Typography>
			<Typography
				variant="body2"
				component="p"
				color="grey"
				fontStyle="italic"
				mb={1}>
				Due Date: {new Date(dueDate).toLocaleDateString()}
			</Typography>
			<Typography
				variant="body2"
				component="p"
				color="grey"
				fontStyle="italic"
				mb={1}>
				Created At: {new Date(createdAt).toLocaleDateString()}
			</Typography>
			<Typography
				variant="body2"
				component="p"
				color="grey"
				fontStyle="italic">
				Last Updated: {new Date(updatedAt).toLocaleDateString()}
			</Typography>
		</SectionWrapper>
	);
};
export default TaskCard;
