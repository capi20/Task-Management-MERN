import React, { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { serverInstance } from "../axiosInstances";

const TaskDetails = () => {
	const params = useParams();
	const [task, setTask] = useState([]);
	const { alertHandler, setOpenLoader } = useAppContext();

	useEffect(() => {
		async function getTask() {
			try {
				setOpenLoader(true);
				let res = await serverInstance(`/tasks/${params.id}`);
				setTask(res.data);
			} catch (error) {
				alertHandler(true, error.response.data.message, "error");
			} finally {
				setOpenLoader(false);
			}
		}
		getTask();
	}, []);

	return <TaskForm task={task} />;
};
export default TaskDetails;
