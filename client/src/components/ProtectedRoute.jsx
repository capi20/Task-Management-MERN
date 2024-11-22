import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Box from "@mui/material/Box";
import Header from "./Header";
import { serverInstance } from "../axiosInstances";
import { useEffect } from "react";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
	const { userLoading, user, setUserData, setUserLoading, logoutUser } =
		useAppContext();

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
				<Loader />
			</>
		);
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	return children;
};
export default ProtectedRoute;
