import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageHeading from "../components/PageHeading";
import SectionWrapper from "../components/SectionWrapper";
import axios from "axios";
import Input from "../components/Input";
import { priorityList, statusList, taskFields } from "../constants";

const NewTask = () => {
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors }
	} = useForm();

	const onsubmit = async (data) => {
		data.creator = "abc@abc.com";
		console.log(data);
		try {
			const res = await axios.post(
				"http://localhost:5000/api/tasks",
				data
			);
		} catch (error) {}
	};

	const onreset = () => {
		setValue(taskFields.title, "");
		setValue(taskFields.description, "");
		setValue(taskFields.status, "");
		setValue(taskFields.priority, "");
		setValue(taskFields.assignee, "");
		setValue(taskFields.dueDate, "");
	};

	return (
		<Box p={5} maxWidth="1200px" margin="auto">
			<SectionWrapper>
				<PageHeading title="New Task" />
				<Grid container spacing={3}>
					<Grid size={7}>
						<Input
							label="Title"
							{...register(taskFields.title, { required: true })}
							error={errors[taskFields.title]}
						/>
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
					<Grid size={5}>
						<Input
							type="select"
							label="Status"
							placeholder="Select status"
							{...register(taskFields.status, { required: true })}
							list={statusList}
							error={errors[taskFields.status]}
						/>
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
							Submit
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
export default NewTask;
