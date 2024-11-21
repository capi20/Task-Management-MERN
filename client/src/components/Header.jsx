import { Box, Stack, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
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
				alignItems="center">
				<Typography variant="h5" fontWeight={700} letterSpacing={1}>
					<Link to="/">ZenTask</Link>
				</Typography>
				<Stack component="nav">
					<NavLink
						to="/newTask"
						className={({ isActive }) =>
							isActive ? "nav-link active" : "nav-link"
						}>
						New Task
					</NavLink>
				</Stack>
			</Stack>
		</Box>
	);
};
export default Header;
