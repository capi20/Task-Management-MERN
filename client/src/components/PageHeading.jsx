import { Stack, Typography } from "@mui/material";

const PageHeading = ({ title, children }) => {
	return (
		<Stack
			direction="row"
			justifyContent="space-between"
			alignItems="center"
			my={{ xs: 3, sm: 5 }}>
			<Typography variant="h5" fontWeight={700}>
				{title}
			</Typography>
			{children}
		</Stack>
	);
};
export default PageHeading;
