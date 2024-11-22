import { CircularProgress, Stack } from "@mui/material";

const Loader = () => {
	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="center"
			minHeight="30vh">
			<CircularProgress sx={{ color: "grey.700" }} />
		</Stack>
	);
};
export default Loader;
