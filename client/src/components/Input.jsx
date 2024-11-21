import { Stack } from "@mui/material";
import { forwardRef } from "react";

const Input = forwardRef(
	(
		{ type = "text", name, label, list, error, placeholder, ...props },
		ref
	) => {
		console.log(name, placeholder, list && list[0]);
		return (
			<Stack gap={1}>
				<label id={name} className={error ? "error mt-4" : "mt-4"}>
					{label}
				</label>
				{type === "textarea" ? (
					<textarea
						ref={ref}
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
						className={error ? "error" : ""}
						defaultValue={placeholder && ""}>
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
						placeholder={placeholder}
						className={error ? "error" : ""}
						{...props}
					/>
				)}
			</Stack>
		);
	}
);
export default Input;
