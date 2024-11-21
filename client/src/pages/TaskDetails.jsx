import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const TaskDetails = () => {
	const params = useParams();
	const [task, setTask] = useState([]);
	const { alertHandler } = useAppContext();

	useEffect(() => {
		async function getTask() {
			try {
				let res = await axios(
					`http://localhost:5000/api/tasks/${params.id}`
				);
				setTask(res.data);
			} catch (error) {
				alertHandler(true, error.response.data.message, "error");
			}
		}
		getTask();
	}, []);

	return <TaskForm task={task} />;
};
export default TaskDetails;
