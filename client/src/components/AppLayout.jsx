import { Alert, Snackbar } from "@mui/material";
import { useAppContext } from "../context/appContext";

const AppLayout = () => {
	const { alert, alertHandler } = useAppContext();
	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={alert.open}
				action={null}
				autoHideDuration={3000}
				onClose={() => alertHandler(false)}>
				<Alert
					severity={alert.type}
					variant="filled"
					sx={{ width: "100%" }}>
					{alert.message}
				</Alert>
			</Snackbar>
		</>
	);
};
export default AppLayout;
