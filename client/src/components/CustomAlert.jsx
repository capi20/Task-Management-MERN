import { Alert, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import { useAppContext } from "../context/appContext";

const CustomAlert = () => {
	const { alert, alertHandler, openLoader, setOpenLoader } = useAppContext();
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
			<Backdrop
				sx={(theme) => ({
					color: "#fff",
					zIndex: theme.zIndex.drawer + 1,
					marginTop: "76px"
				})}
				open={openLoader}
				onClick={() => setOpenLoader(false)}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
};
export default CustomAlert;
