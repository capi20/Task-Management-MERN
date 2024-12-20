import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
		minlength: [3, "Name must be at least 3 characters long"],
		maxlength: 20,
		trim: true
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		validate: {
			validator: validator.isEmail,
			message: "Please provide a valid email"
		},
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		minlength: [8, "Password must be at least 8 characters long"],
		select: false
	}
});

UserSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
	return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME
	});
};

UserSchema.methods.comparePassword = async function (condidatePassword) {
	const isMatch = await bcrypt.compare(condidatePassword, this.password);
	return isMatch;
};

export default mongoose.model("User", UserSchema);
