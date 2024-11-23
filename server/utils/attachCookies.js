const attachCookies = (res, token, expires = 24 * 60 * 60 * 1000) => {
	res.cookie("token", token, {
		httpOnly: true,
		expires: new Date(Date.now() + expires),
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production"
	});
};

export default attachCookies;
