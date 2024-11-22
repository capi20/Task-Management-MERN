import { Stack, Typography } from "@mui/material";
import { forwardRef } from "react";

const Input = forwardRef(
	(
		{
			type = "text",
			name,
			label,
			list,
			error,
			helperText,
			placeholder,
			...props
		},
		ref
	) => {
		return (
			<Stack gap={0.5}>
				{label && (
					<Typography
						variant="body"
						component="label"
						color="text.secondary"
						htmlFor={name}
						className={error ? "error" : ""}>
						{label}
					</Typography>
				)}
				{type === "textarea" ? (
					<textarea
						ref={ref}
						id={name}
						name={name}
						placeholder={placeholder}
						className={error ? "error" : ""}
						{...props}
					/>
				) : type === "select" ? (
					<select
						{...props}
						ref={ref}
						name={name}
						id={name}
						className={error ? "error" : ""}>
						{placeholder && (
							<option disabled value="">
								{placeholder}
							</option>
						)}
						{list.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				) : (
					<input
						type={type}
						ref={ref}
						name={name}
						id={name}
						placeholder={placeholder}
						className={error ? "error" : ""}
						{...props}
					/>
				)}
				{helperText && (
					<Typography
						variant="subtitle"
						className={error ? "helperText-error" : ""}>
						{helperText}
					</Typography>
				)}
			</Stack>
		);
	}
);
export default Input;
