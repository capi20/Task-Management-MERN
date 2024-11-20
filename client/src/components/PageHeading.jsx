import { Stack, Typography } from "@mui/material";

const PageHeading = ({ title, children }) => {
	return (
		<Stack
			direction="row"
			justifyContent="space-between"
			alignItems="center"
			mb={3}>
			<Typography variant="h5" fontWeight={700}>
				{title}
			</Typography>
			{children}
		</Stack>
	);
};
export default PageHeading;
