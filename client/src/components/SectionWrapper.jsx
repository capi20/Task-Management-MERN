import { Paper } from "@mui/material";

const SectionWrapper = ({ children }) => {
	return (
		<Paper elevation={3} sx={{ padding: "30px 50px" }}>
			{children}
		</Paper>
	);
};
export default SectionWrapper;
