import { Chip, Box, Stack } from "@mui/material";
import Input from "./Input";

const TaskLabels = ({ labels, handleLabels, inputLabel, handleInputLabel }) => {
	// Add label when user presses Enter
	const handleAddLabel = (event) => {
		if (event.key === "Enter" && inputLabel.trim()) {
			if (!labels.includes(inputLabel.trim())) {
				handleLabels((prev) => [...prev, inputLabel.trim()]);
			}
			handleInputLabel("");
		}
	};

	// Remove label
	const handleDeleteLabel = (labelToDelete) => {
		handleLabels((prev) => prev.filter((label) => label !== labelToDelete));
	};

	return (
		<Box>
			<Input
				label="Add Label"
				value={inputLabel}
				onChange={(e) => handleInputLabel(e.target.value)}
				onKeyDown={handleAddLabel}
			/>
			<Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
				{labels.map((label, index) => (
					<Chip
						key={index}
						label={label}
						onDelete={() => handleDeleteLabel(label)}
						color="primary"
					/>
				))}
			</Stack>
		</Box>
	);
};

export default TaskLabels;
