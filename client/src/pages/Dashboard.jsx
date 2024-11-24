import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Home from "./Home";
import PageHeading from "../components/PageHeading";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import TaskStats from "./TaskStats";

const Dashboard = () => {
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const tabProps = (index) => {
		return {
			id: `simple-tab-${index}`,
			"aria-controls": `simple-tabpanel-${index}`
		};
	};
	return (
		<>
			<PageHeading title="Dashboard">
				<Link className="btn" to="/newTask">
					<AddIcon />
					New Task
				</Link>
			</PageHeading>
			<Tabs
				value={value}
				onChange={handleChange}
				aria-label="dashboard"
				sx={{ mb: 4 }}>
				<Tab label="Tasks" {...tabProps(0)} />
				<Tab label="Stats" {...tabProps(1)} />
			</Tabs>
			{value === 0 ? <Home /> : <TaskStats />}
		</>
	);
};
export default Dashboard;
