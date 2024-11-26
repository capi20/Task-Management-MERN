import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import TaskReminders from "../pages/Reminders";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useAppContext } from "../context/appContext";

const Header = () => {
	const { logoutUser, user } = useAppContext();
	return (
		<Box
			width="100%"
			component="header"
			sx={{
				position: "fixed",
				top: 0,
				zIndex: 1,
				width: "100%",
				backgroundColor: "grey.700",
				color: "#fff"
			}}>
			<Stack
				className="app-layout"
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				py={2}>
				<Typography variant="h5" fontWeight={700} letterSpacing={1}>
					<Link to="/">ZenTask</Link>
				</Typography>
				<Stack direction="row" gap={2}>
					{user?.name && (
						<IconButton color="inherit">
							<AccountCircleOutlinedIcon />
						</IconButton>
					)}

					<TaskReminders />

					<IconButton color="inherit" onClick={logoutUser}>
						<LogoutIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Box>
	);
};
export default Header;
