import { Box, Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { useState } from "react";
import { EMAIL_ERROR, PASSWORD_ERROR } from "../constants";
import { useAppContext } from "../context/appContext";
import { serverInstance } from "../axiosInstances";
import { useNavigate } from "react-router-dom";

const defaultValues = {
	name: "",
	email: "",
	password: ""
};

const Login = () => {
	const [isMember, setIsMember] = useState(true);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting }
	} = useForm({
		defaultValues
	});

	const { alertHandler, setUserData } = useAppContext();
	const navigate = useNavigate();

	const toggleMember = () => {
		setIsMember(!isMember);
		reset(defaultValues);
	};

	const onsubmit = async (data) => {
		try {
			const res = await serverInstance.post(
				`auth/${isMember ? "login" : "register"}`,
				data
			);
			setUserData({ email: res.email, name: res.name });
			navigate("/");
		} catch (error) {
			alertHandler(true, error.response.data.message, "error");
		}
	};

	return (
		<Stack p={5} height="90vh" justifyContent="center" alignItems="center">
			<Stack gap={3} width={{ xs: "auto", sm: 400 }}>
				<Typography variant="h4" mb={4} color="grey.700">
					Login to ZenTask
				</Typography>
				{!isMember && (
					<Input
						label="Name"
						{...register("name", {
							required: true
						})}
						error={errors.name}
					/>
				)}
				<Input
					label="Email"
					{...register("email", {
						required: true,
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: EMAIL_ERROR
						}
					})}
					helperText={errors.email?.message}
					error={errors.email}
				/>
				<Input
					type="password"
					label="Password"
					{...register("password", {
						required: true,
						minLength: !isMember && 8
					})}
					helperText={
						errors.password?.type === "minLength" && PASSWORD_ERROR
					}
					error={errors.password}
				/>
				<Button
					fullWidth
					disabled={isSubmitting}
					variant="contained"
					onClick={handleSubmit((data) => onsubmit(data))}>
					{isMember && (isSubmitting ? "Logging in..." : "Login")}
					{!isMember &&
						(isSubmitting ? "Registering..." : "Register")}
				</Button>

				<Typography align="center" color="text.secondary">
					{isMember ? "Not a member yet?" : "Already a member?"}

					<button
						type="button"
						onClick={toggleMember}
						className="member-btn">
						{isMember ? "Register" : "Login"}
					</button>
				</Typography>
			</Stack>
		</Stack>
	);
};
export default Login;
