import React from "react";
import { useForm } from "react-hook-form";
import TaskForm from "../components/TaskForm";

const NewTask = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm();

	return (
		<TaskForm
			register={register}
			handleSubmit={handleSubmit}
			setValue={setValue}
			errors={errors}
		/>
	);
};
export default NewTask;
