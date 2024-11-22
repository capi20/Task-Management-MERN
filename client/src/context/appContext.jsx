import React, { useContext, useState } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	const [alert, setAlert] = useState({
		open: false,
		message: "",
		type: ""
	});
	const [openLoader, setOpenLoader] = useState(false);
	const [user, setUser] = useState(null);
	const [userLoading, setUserLoading] = useState(true);

	const alertHandler = (open, message = "", type = "") => {
		setAlert({
			open,
			message,
			type
		});
	};

	const setUserData = (data) => {
		setUser(data);
	};

	const logoutUser = async () => {
		setUser(null);
		setUserLoading(false);
		try {
			await serverInstance.get("/auth/logout");
		} catch (error) {}
	};

	return (
		<AppContext.Provider
			value={{
				alert,
				user,
				userLoading,
				openLoader,
				alertHandler,
				setUserData,
				setUserLoading,
				logoutUser,
				setOpenLoader
			}}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => {
	return useContext(AppContext);
};

export { AppProvider, useAppContext };
