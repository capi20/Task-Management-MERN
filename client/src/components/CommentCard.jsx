import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	IconButton,
	Stack,
	Typography
} from "@mui/material";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

const CommentCard = ({ _id, author, text, updatedAt, handleMenuClick }) => {
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
						<IconButton onClick={(e) => handleMenuClick(e, _id)}>
							<MoreVertOutlinedIcon />
						</IconButton>
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
