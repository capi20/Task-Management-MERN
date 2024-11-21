import React, { useContext, useState } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
	const [alert, setAlert] = useState({
		open: false,
		message: "",
		type: ""
	});

	const alertHandler = (open, message = "", type = "") => {
		setAlert({
			open,
			message,
			type
		});
	};

	return (
		<AppContext.Provider
			value={{
				alert,
				alertHandler
			}}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => {
	return useContext(AppContext);
};

export { AppProvider, useAppContext };
