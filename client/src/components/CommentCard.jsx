import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	Typography
} from "@mui/material";

const CommentCard = ({ author, text, updatedAt }) => {
	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar aria-label="author">
						{author.substring(0, 1).toUpperCase()}
					</Avatar>
				}
				title={author}
				subheader={new Date(updatedAt).toLocaleString()}
			/>
			<CardContent>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{text}
				</Typography>
			</CardContent>
		</Card>
	);
};
export default CommentCard;
