import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Header from "./Header";

const ProtectedRoute = ({ children }) => {
	const { userLoading, user } = useAppContext();

	if (userLoading) {
		return (
			<>
				<Header />
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh"
					}}>
					<CircularProgress sx={{ color: "grey.700" }} />
				</Box>
			</>
		);
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	return children;
};
export default ProtectedRoute;
