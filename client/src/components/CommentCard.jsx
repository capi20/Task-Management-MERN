import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	IconButton,
	Stack,
	Typography
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const CommentCard = ({
	_id,
	author,
	text,
	updatedAt,
	commentHandler,
	editHandler,
	deleteHandler
}) => {
	return (
		<Card elevation={1}>
			<CardHeader
				avatar={
					<Avatar aria-label="author">
						{author.substring(0, 1).toUpperCase()}
					</Avatar>
				}
				title={
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center">
						<Typography variant="body1" color="text.secondary">
							{author}
							<br />
							<Typography variant="subtitle2" component="span">
								{new Date(updatedAt).toLocaleString()}
							</Typography>
						</Typography>
						<Stack direction="row" gap={1}>
							<IconButton onClick={() => editHandler(_id, text)}>
								<EditOutlinedIcon />
							</IconButton>
							<IconButton onClick={() => deleteHandler(_id)}>
								<DeleteOutlineOutlinedIcon />
							</IconButton>
						</Stack>
					</Stack>
				}
			/>
			<CardContent>
				<Typography variant="body1">{text}</Typography>
			</CardContent>
		</Card>
	);
};
export default CommentCard;
