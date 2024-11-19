import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputStyleOverride } from "./CustomInput";
import { forwardRef } from "react";

const StyledDatePicker = styled(DatePicker)({
	...InputStyleOverride
});

const CustomDatePicker = forwardRef(({ ...props }, ref) => {
	return (
		<StyledDatePicker
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
	);
});

export default CustomDatePicker;
