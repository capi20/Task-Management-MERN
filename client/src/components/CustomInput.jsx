import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { forwardRef } from "react";

export const InputStyleOverride = {
	width: "100%",
	marginTop: "30px",

	"& label": {
		top: "-30px",
		transform: "none"
	},
	"& input, & .MuiSelect-select": {
		padding: "12px 14px"
	},
	"& .MuiFormHelperText-root": {
		marginLeft: 0,
		marginRight: 0
	},
	"& fieldset legend": {
		display: "none"
	}
};

const StyledInput = styled(TextField)({ ...InputStyleOverride });

const CustomInput = forwardRef(({ children, ...props }, ref) => {
	return (
		<>
			{children ? (
				<StyledInput
					{...props}
					ref={ref}
					variant="outlined"
					fullWidth
					margin="normal"
					slotProps={{
						inputLabel: {
							shrink: true
						}
					}}>
					{children}
				</StyledInput>
			) : (
				<StyledInput
					{...props}
					ref={ref}
					variant="outlined"
					fullWidth
					slotProps={{
						inputLabel: {
							shrink: true
						}
					}}
				/>
			)}
		</>
	);
});

export default CustomInput;
