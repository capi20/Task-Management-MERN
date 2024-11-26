import { Button, Stack } from "@mui/material";
import PageHeading from "../components/PageHeading";
import { useForm } from "react-hook-form";
import { useAppContext } from "../context/appContext";
import Input from "../components/Input";
import { EMAIL_ERROR, PASSWORD_ERROR } from "../constants";
import { serverInstance } from "../axiosInstances";

const Profile = () => {
	const { user, alertHandler, setUserData } = useAppContext();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting }
	} = useForm({
		defaultValues: {
			name: user?.name,
			email: user?.email,
			password: ""
		}
	});

	const onsubmit = async (data) => {
		const { name, password } = data;
		try {
			const res = await serverInstance.put(`auth/updateUser`, {
				name,
				password
			});
			setUserData({ email: res.data.email, name: res.data.name });
			alertHandler(true, res.data.message, "success");
		} catch (error) {
			alertHandler(true, error.response.data.message, "error");
		}
	};

	return (
		<>
			<PageHeading title="Profile" />
			<Stack gap={3} width={{ xs: "auto", sm: 400 }} m="auto">
				<Input
					label="Name"
					{...register("name", {
						required: true
					})}
					error={errors.name}
				/>
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
					disabled={true}
				/>
				<Input
					type="password"
					label="Password"
					{...register("password", {
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
					{isSubmitting ? "Updating..." : "Update"}
				</Button>
			</Stack>
		</>
	);
};
export default Profile;
