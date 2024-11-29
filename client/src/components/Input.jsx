import { IconButton, Stack, Typography } from "@mui/material";
import { forwardRef, useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

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
		const [isVisible, setIsVisible] = useState(false);

		return (
			<Stack position="relative">
				{label && (
					<Typography
						variant="body1"
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
				) : type === "password" ? (
					<>
						<input
							type={isVisible ? "text" : "password"}
							ref={ref}
							name={name}
							id={name}
							placeholder={placeholder}
							className={error ? "error" : ""}
							{...props}
							style={{
								paddingRight: "40px"
							}}
						/>
						<IconButton
							onClick={() => setIsVisible(!isVisible)}
							sx={{
								position: "absolute",
								right: 0,
								top: "22px"
							}}
							color="text.secondary">
							{isVisible ? (
								<VisibilityOutlinedIcon />
							) : (
								<VisibilityOffOutlinedIcon />
							)}
						</IconButton>
					</>
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
						variant="subtitle2"
						component="span"
						className={error ? "helperText-error" : ""}>
						{helperText}
					</Typography>
				)}
			</Stack>
		);
	}
);
export default Input;
