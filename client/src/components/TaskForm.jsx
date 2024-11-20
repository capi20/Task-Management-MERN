import React from "react";
import { Box, Button, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageHeading from "./PageHeading";
import SectionWrapper from "./SectionWrapper";
import Input from "./Input";
import { priorityList, statusList, taskFields } from "../constants";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const TaskForm = ({ task }) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm();

	const location = useLocation();
	const isNew = location.pathname === "/newTask" ? true : false;
	console.log(location, isNew);
	useEffect(() => {
		onreset();
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

	return (
		<Box p={5} maxWidth="1200px" margin="auto">
			<SectionWrapper>
				<PageHeading title={isNew ? "New Task" : "Edit task"} />
				<Grid container spacing={3}>
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
						<Input
							label="Comment"
							{...register(taskFields.comment)}
						/>
					</Grid>
					<Grid size={2}>
						<Button
							fullWidth
							variant="contained"
							onClick={handleSubmit((data) => onsubmit(data))}>
							{isNew ? "Submit" : "Update"}
						</Button>
					</Grid>
					<Grid size={2}>
						<Button fullWidth variant="outlined" onClick={onreset}>
							Reset
						</Button>
					</Grid>
				</Grid>
			</SectionWrapper>
		</Box>
	);
};
export default TaskForm;
