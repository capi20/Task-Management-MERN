import { Alert, Box, Snackbar } from "@mui/material";
import { useAppContext } from "../context/appContext";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppLayout = () => {
	return (
		<>
			<Header />
			<Box component="main" className="app-layout" pt={10} pb={5}>
				<Outlet />
			</Box>
		</>
	);
};
export default AppLayout;
