import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAppContext } from "../context/appContext";
import { serverInstance } from "../axiosInstances";
import { PieChart } from "@mui/x-charts";
import {
	Box,
	Checkbox,
	FormControlLabel,
	Grid2 as Grid,
	Stack,
	Typography
} from "@mui/material";

const TaskStats = () => {
	const [checked, setChecked] = useState(false);
	const [stats, setStats] = useState({});
	const { alertHandler, setOpenLoader, user } = useAppContext();

	useEffect(() => {
		async function getTasksStats() {
			try {
				setOpenLoader(true);
				let res = await serverInstance(
					checked
						? `/tasks/getStats?assignee=${user.email}`
						: "/tasks/getStats"
				);

				setStats(res.data || {});
			} catch (error) {
				alertHandler(true, error.response.data.message, "error");
			} finally {
				setOpenLoader(false);
			}
		}
		getTasksStats();
	}, [checked]);
	return (
		<Grid container>
			<Grid size={12} mb={3}>
				<FormControlLabel
					control={
						<Checkbox
							checked={checked}
							onChange={(e) => setChecked(e.target.checked)}
							inputProps={{
								"aria-label": "assigned to me"
							}}
						/>
					}
					label="Task assigned to me"
				/>
			</Grid>
			{stats.priority && (
				<Grid size={{ xs: 12, md: 6 }}>
					<Typography variant="h6" fontWeight={700}>
						Priority
					</Typography>
					<PieChart
						colors={["orange", "grey", "green"]}
						series={[
							{
								data: Object.keys(stats.priority).map(
									(item, index) => ({
										id: index,
										value: stats.priority[item],
										label: item
									})
								)
							}
						]}
						height={200}
					/>
				</Grid>
			)}
			{stats.status && (
				<Grid size={{ xs: 12, md: 6 }}>
					<Typography variant="h6" fontWeight={700}>
						Status
					</Typography>
					<PieChart
						series={[
							{
								data: Object.keys(stats.status).map(
									(item, index) => ({
										id: index,
										value: stats.status[item],
										label: item
									})
								)
							}
						]}
						height={200}
					/>
				</Grid>
			)}
		</Grid>
	);
};
export default TaskStats;
