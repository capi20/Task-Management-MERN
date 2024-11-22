import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Header from "./Header";
import { serverInstance } from "../axiosInstances";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
	const { userLoading, user, setUserData, setUserLoading } = useAppContext();

	useEffect(() => {
		if (!user) {
			getCurrentUser();
		}
	}, []);

	serverInstance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response.status === 401) {
				logoutUser();
			}
			return Promise.reject(error);
		}
	);

	const logoutUser = async () => {
		setUserData(null);
		setUserLoading(false);
		try {
			await serverInstance.get("/auth/logout");
		} catch (error) {}
	};

	const getCurrentUser = async () => {
		try {
			const { data } = await serverInstance.get("/auth/getCurrentUser");

			setUserData(data);
		} catch (error) {
			if (error.response.status === 401) return;
			logoutUser();
		}

		setUserLoading(false);
	};

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
