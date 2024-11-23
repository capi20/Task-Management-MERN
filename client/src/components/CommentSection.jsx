import { Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import CommentCard from "./CommentCard";
import Input from "./Input";
import { useEffect, useRef, useState } from "react";
import { serverInstance } from "../axiosInstances";
import { useAppContext } from "../context/appContext";

const CommentSection = ({ taskId, commentList }) => {
	const [commentInput, setCommentInput] = useState("");
	const [comments, setComments] = useState(commentList || []);
	const { setOpenLoader, alertHandler } = useAppContext();
	const [commentClicked, setCommentClicked] = useState("");
	const commentRef = useRef(null);

	const [anchorEl, setAnchorEl] = useState(null);
	const openMenu = Boolean(anchorEl);

	useEffect(() => {
		setComments(commentList);
	}, [commentList]);

	const handleMenuClick = (event, id) => {
		setAnchorEl(event.currentTarget);
		setCommentClicked(id);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const commentHandler = async (actionType) => {
		try {
			setOpenLoader(true);
			const data = {
				text: commentInput,
				taskId: actionType === "add" ? taskId : "",
				commentId: actionType === "edit" ? commentClicked : ""
			};

			if (actionType === "add") {
				const res = await serverInstance.post(`tasks/comments`, data);
				alertHandler(true, "Added comment successfully!", "success");
				setCommentInput("");
				setComments([res.data, ...comments]);
			} else if (actionType === "edit") {
				const res = await serverInstance.put(`tasks/comments`, data);
				alertHandler(true, "Edit comment successfully!", "success");
			} else if (actionType === "delete") {
				await serverInstance.delete(
					`tasks/${taskId}/comments/${commentClicked}`
				);
				setComments((prev) =>
					prev.filter((p) => p._id !== commentClicked)
				);
				alertHandler(true, "Comment deleted successfully", "success");
			}
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
				<Input
					ref={commentRef}
					type="textarea"
					placeholder="Write a comment"
					rows={6}
					value={commentInput}
					onChange={(e) => setCommentInput(e.target.value)}
				/>
				<Button
					disabled={!commentInput || commentInput === ""}
					variant="contained"
					onClick={() => commentHandler("add")}>
					Add Comment
				</Button>
				{comments.length > 0 && (
					<Stack gap={3}>
						{comments.map((comment) => (
							<CommentCard
								key={comment._id}
								{...comment}
								handleMenuClick={handleMenuClick}
							/>
						))}
					</Stack>
				)}
			</Stack>
			{comments.length > 0 && (
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
					{/* <MenuItem
						onClick={() => {
							commentRef.current.focus();
							// commentHandler("edit");
							handleMenuClose();
						}}>
						Edit
					</MenuItem> */}
					<MenuItem
						onClick={() => {
							commentHandler("delete");
							handleMenuClose();
						}}>
						Delete
					</MenuItem>
				</Menu>
			)}
		</>
	);
};
export default CommentSection;
