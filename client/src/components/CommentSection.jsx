import { Button, Stack, Typography } from "@mui/material";
import CommentCard from "./CommentCard";
import { useEffect, useRef, useState } from "react";
import { serverInstance } from "../axiosInstances";
import { useAppContext } from "../context/appContext";

const CommentSection = ({ taskId, commentList }) => {
	const [commentInput, setCommentInput] = useState("");
	const [comments, setComments] = useState(commentList || []);
	const [commentClicked, setCommentClicked] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const { setOpenLoader, alertHandler } = useAppContext();
	const commentRef = useRef(null);

	useEffect(() => {
		setComments(commentList);
	}, [commentList]);

	const handleFocusAndScroll = () => {
		if (commentRef.current) {
			// Focus the textarea
			commentRef.current.focus();

			commentRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center" // Align it centrally
			});
		}
	};

	const editHandler = (commentId, commentText) => {
		handleFocusAndScroll();
		setIsEditing(true);
		setCommentClicked(commentId);
		setCommentInput(commentText);
	};

	const deleteHandler = (commentId) => {
		commentHandler("delete", commentId);
	};

	const getComments = async () => {
		try {
			const res = await serverInstance.get(`tasks/${taskId}/comments`);
			setComments(res.data);
		} catch (error) {
			alertHandler(true, error.response.data.message, "error");
		}
	};

	const commentHandler = async (actionType, commentId) => {
		try {
			setOpenLoader(true);
			const data = {
				text: commentInput,
				taskId: actionType === "add" ? taskId : "",
				commentId: actionType === "edit" ? commentId : ""
			};

			if (actionType === "add") {
				const res = await serverInstance.post(`tasks/comments`, data);
				alertHandler(true, "Comment added successfully!", "success");
				setCommentInput("");
			} else if (actionType === "edit") {
				const res = await serverInstance.put(`tasks/comments`, data);
				alertHandler(true, "Comment updated successfully!", "success");
				setCommentInput("");
				setIsEditing(false);
			} else if (actionType === "delete") {
				await serverInstance.delete(
					`tasks/${taskId}/comments/${commentId}`
				);
				alertHandler(true, "Comment deleted successfully", "success");
			}
			await getComments();
		} catch (error) {
			alertHandler(true, error.response.data.message, "error");
		} finally {
			setOpenLoader(false);
		}
	};

	return (
		<>
			<Typography variant="h6" fontWeight={700} mt={6} mb={2}>
				Comments
			</Typography>
			<Stack maxWidth={600} gap={3}>
				<textarea
					ref={commentRef}
					type="textarea"
					placeholder="Write a comment"
					rows={6}
					value={commentInput}
					onChange={(e) => setCommentInput(e.target.value)}
				/>
				{isEditing ? (
					<Stack direction="row" gap={3}>
						<Button
							disabled={!commentInput || commentInput === ""}
							variant="contained"
							onClick={() =>
								commentHandler("edit", commentClicked)
							}>
							Update
						</Button>
						<Button
							variant="outlined"
							onClick={() => {
								setIsEditing(false);
								setCommentInput("");
							}}>
							Cancel
						</Button>
					</Stack>
				) : (
					<Button
						disabled={!commentInput || commentInput === ""}
						variant="contained"
						onClick={() => commentHandler("add")}>
						Add Comment
					</Button>
				)}
				{comments.length > 0 && (
					<Stack gap={3}>
						{comments.map((comment) => (
							<CommentCard
								key={comment._id}
								{...comment}
								// handleMenuClick={handleMenuClick}
								commentHandler={commentHandler}
								editHandler={editHandler}
								deleteHandler={deleteHandler}
							/>
						))}
					</Stack>
				)}
			</Stack>
		</>
	);
};
export default CommentSection;
