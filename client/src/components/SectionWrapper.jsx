import { Paper } from "@mui/material";

const SectionWrapper = ({ children }) => {
	return (
		<Paper elevation={1} sx={{ padding: { xs: 3, sm: 4 } }}>
			{children}
		</Paper>
	);
};
export default SectionWrapper;
