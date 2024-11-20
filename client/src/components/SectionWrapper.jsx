import { Paper } from "@mui/material";

const SectionWrapper = ({ children }) => {
	return (
		<Paper elevation={3} sx={{ padding: "20px 40px" }}>
			{children}
		</Paper>
	);
};
export default SectionWrapper;
