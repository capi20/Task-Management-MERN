import React, { useContext, useState } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	const [alert, setAlert] = useState({
		open: false,
		message: "",
		type: ""
	});
	const [user, setUser] = useState(true);
	const [userLoading, setUserLoading] = useState(false);

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

	return (
		<AppContext.Provider
			value={{
				alert,
				user,
				userLoading,
				alertHandler,
				setUserData
			}}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => {
	return useContext(AppContext);
};

export { AppProvider, useAppContext };
