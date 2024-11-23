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
import CommentCard from "./CommentCard";
import { useAppContext } from "../context/appContext";
import { serverInstance } from "../axiosInstances";
import TaskLabels from "./TaskLabels";
import CommentSection from "./CommentSection";

const defaultValues = {
	[taskFields.title]: "",
	[taskFields.description]: "",
	[taskFields.status]: statusList[0],
	[taskFields.priority]: "",
	[taskFields.assignee]: "",
	[taskFields.dueDate]: ""
};

const TaskForm = ({
	task = {
		...defaultValues,
		labels: [],
		comments: []
	}
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm({
		defaultValues
	});

	const commentInput = watch(taskFields.comment);
	const location = useLocation();
	const navigate = useNavigate();
	const isNew = location.pathname === "/newTask" ? true : false;

	const [currentTask, setCurrentTask] = useState(task);
	const [labels, setLabels] = useState(task?.labels || []); // List of tags
	const [inputLabel, setInputLabel] = useState(""); // Input value for new tag
	const { alertHandler, setOpenLoader } = useAppContext();

	useEffect(() => {
		if (!isNew) {
			onreset(task);
			setCurrentTask(task);
			setLabels(task.labels || []);
		}
	}, [task]);

	const onsubmit = async (data) => {
		try {
			setOpenLoader(true);
			const res = isNew
				? await serverInstance.post("tasks", {
						...data,
						title: data.title.trim(),
						description: data.description.trim(),
						assignee: data.assignee.trim(),
						labels
				  })
				: await serverInstance.put(`tasks/${task._id}`, {
						...data,
						title: data.title.trim(),
						description: data.description.trim(),
						assignee: data.assignee.trim(),
						labels
				  });
			if (isNew) {
				alertHandler(true, "Task created successfully!", "success");
				navigate("/");
			} else {
				setCurrentTask(res.data);
				alertHandler(true, "Task updated successfully!", "success");
			}
		} catch (error) {
			alertHandler(true, error?.response?.data.message, "error");
		} finally {
			setOpenLoader(false);
		}
	};

	const onreset = (taskData) => {
		setValue(taskFields.title, taskData.title);
		setValue(taskFields.description, taskData.description);
		setValue(taskFields.status, taskData.status);
		setValue(taskFields.priority, taskData.priority);
		setValue(taskFields.assignee, taskData.assignee);
		setValue(taskFields.dueDate, taskData.dueDate);
		setLabels(taskData.labels);
		setInputLabel("");
	};

	return (
		<Stack margin="auto">
			<PageHeading title={isNew ? "New Task" : "Edit task"} />
			<SectionWrapper>
				<Grid container rowSpacing={3} spacing={3}>
					<Grid size={{ xs: 12, md: 8 }}>
						<Stack direction="row" gap={3} mb={3}>
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
									label="Priority"
									placeholder="Select priority"
									{...register(taskFields.priority, {
										required: true
									})}
									list={priorityList}
									error={errors[taskFields.priority]}
								/>
							</Box>
						</Stack>
						<Input
							type="textarea"
							rows={11}
							label="Description"
							{...register(taskFields.description, {
								required: true
							})}
							error={errors[taskFields.description]}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 4 }}>
						<Box mb={3}>
							<Input
								type="select"
								label="Status"
								{...register(taskFields.status)}
								list={statusList}
							/>
						</Box>
						<Box mb={3}>
							<Input
								label="Assignee"
								{...register(taskFields.assignee, {
									required: true
								})}
								error={errors[taskFields.assignee]}
							/>
						</Box>
						<Box mb={3}>
							<Input
								type="date"
								label="Due Date"
								{...register(taskFields.dueDate, {
									required: true
								})}
								error={errors[taskFields.dueDate]}
							/>
						</Box>
						<TaskLabels
							labels={labels}
							handleLabels={setLabels}
							inputLabel={inputLabel}
							handleInputLabel={setInputLabel}
						/>
					</Grid>
					<Grid size={{ xs: 4, sm: 3, md: 2 }}>
						<Button
							fullWidth
							variant="contained"
							onClick={handleSubmit((data) => onsubmit(data))}>
							{isNew ? "Create" : "Update"}
						</Button>
					</Grid>
					<Grid size={{ xs: 4, sm: 3, md: 2 }}>
						<Button
							fullWidth
							variant="outlined"
							onClick={() => onreset(currentTask)}>
							Reset
						</Button>
					</Grid>
				</Grid>
				{!isNew && (
					<CommentSection
						taskId={task?._id}
						commentList={task.comments || []}
					/>
				)}
			</SectionWrapper>
		</Stack>
	);
};
export default TaskForm;
