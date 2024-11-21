import { Box, Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import { useState } from "react";
import { EMAIL_ERROR, PASSWORD_ERROR } from "../constants";
import { useAppContext } from "../context/appContext";
import axios from "axios";
import { serverInstance } from "../axiosInstances";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [isMember, setIsMember] = useState(true);
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting }
	} = useForm();
	const { alertHandler, setUserData } = useAppContext();
	const navigate = useNavigate();

	const toggleMember = () => {
		setIsMember(!isMember);
		setValue("name", "");
		setValue("email", "");
		setValue("password", "");
	};

	const onsubmit = async (data) => {
		try {
			const res = await serverInstance.post(
				`api/auth/${isMember ? "login" : "register"}`,
				data
			);
			setUserData({ email: res.email, name: res.name });
			navigate("/");
		} catch (error) {
			alertHandler(true, error.response.data.message, "error");
		}
	};

	return (
		<Stack height="100vh" justifyContent="center" alignItems="center">
			<Box minWidth={400}>
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
						minLength: 8
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

				<Typography mt={2} align="center" color="text.secondary">
					{isMember ? "Not a member yet?" : "Already a member?"}

					<button
						type="button"
						onClick={toggleMember}
						className="member-btn">
						{isMember ? "Register" : "Login"}
					</button>
				</Typography>
			</Box>
		</Stack>
	);
};
export default Login;
