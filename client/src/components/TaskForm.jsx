import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageHeading from "./PageHeading";
import SectionWrapper from "./SectionWrapper";
import Input from "./Input";
import { priorityList, statusList, taskFields } from "../constants";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentCard from "./CommentCard";

const TaskForm = ({ task }) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm();

	const commentInput = watch(taskFields.comment);
	const location = useLocation();
	const navigate = useNavigate();
	const isNew = location.pathname === "/newTask" ? true : false;

	const [commentList, setCommentList] = useState([]);

	useEffect(() => {
		onreset();
		setCommentList(task?.comments || []);
	}, [task]);

	const onsubmit = async (data) => {
		try {
			const res = isNew
				? await axios.post("http://localhost:5000/api/tasks", {
						...data,
						creator: "test"
				  })
				: await axios.put(
						`http://localhost:5000/api/tasks/${task._id}`,
						data
				  );
			if (isNew) {
				navigate("/");
			}
		} catch (error) {}
	};

	const onreset = () => {
		setValue(taskFields.title, task?.title);
		setValue(taskFields.description, task?.description);
		setValue(taskFields.status, task?.status);
		setValue(taskFields.priority, task?.priority);
		setValue(taskFields.assignee, task?.assignee);
		setValue(taskFields.dueDate, task?.dueDate);
	};

	const onAddComment = async () => {
		try {
			const data = {
				author: "test",
				text: commentInput
			};
			const res = await axios.post(
				`http://localhost:5000/api/tasks/${task._id}/comments`,
				data
			);
			setValue(taskFields.comment, "");
			setCommentList([res.data, ...commentList]);
		} catch (error) {}
	};

	return (
		<Stack margin="auto">
			<PageHeading title={isNew ? "New Task" : "Edit task"} />
			<SectionWrapper>
				<Grid container spacing={3} mb={5}>
					<Grid size={8}>
						<Stack direction="row" gap={3}>
							<Box flex={1}>
								<Input
									label="Title"
									{...register(taskFields.title, {
										required: true
									})}
									error={errors[taskFields.title]}
								/>
							</Box>
							<Box flex={1}>
								<Input
									type="select"
									label="Status"
									placeholder="Select status"
									{...register(taskFields.status, {
										required: true
									})}
									list={statusList}
									error={errors[taskFields.status]}
								/>
							</Box>
						</Stack>
						<Input
							type="textarea"
							rows={13}
							label="Description"
							{...register(taskFields.description, {
								required: true
							})}
							error={errors[taskFields.description]}
						/>
					</Grid>
					<Grid size={4}>
						<Input
							type="select"
							label="Priority"
							placeholder="Select priority"
							{...register(taskFields.priority, {
								required: true
							})}
							list={priorityList}
							error={errors[taskFields.priority]}
						/>
						<Input
							label="Assignee"
							{...register(taskFields.assignee, {
								required: true
							})}
							error={errors[taskFields.assignee]}
						/>
						<Input
							type="date"
							label="Due Date"
							{...register(taskFields.dueDate, {
								required: true
							})}
							error={errors[taskFields.dueDate]}
						/>
					</Grid>
					<Grid size={2}>
						<Button
							fullWidth
							variant="contained"
							onClick={handleSubmit((data) => onsubmit(data))}>
							{isNew ? "Create" : "Update"}
						</Button>
					</Grid>
					<Grid size={2}>
						<Button fullWidth variant="outlined" onClick={onreset}>
							Reset
						</Button>
					</Grid>
				</Grid>
				{!isNew && (
					<>
						<Typography variant="h6" fontWeight={700}>
							Comments
						</Typography>
						<Stack gap={4} maxWidth={600}>
							<Input
								type="textarea"
								rows={6}
								label="Comment"
								{...register(taskFields.comment)}
							/>
							<Button
								disabled={!commentInput || commentInput === ""}
								variant="contained"
								onClick={onAddComment}>
								Add Comment
							</Button>
							{commentList.length > 0 && (
								<Stack gap={3} mt={4}>
									{commentList.reverse().map((comment) => (
										<CommentCard
											key={comment._id}
											{...comment}
										/>
									))}
								</Stack>
							)}
						</Stack>
					</>
				)}
			</SectionWrapper>
		</Stack>
	);
};
export default TaskForm;
