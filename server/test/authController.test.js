import request from "supertest";
import app from "../server.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { expect } from "chai";
import sinon from "sinon";

const user = {
	name: "test",
	email: "test@test.com",
	password: "password"
};

describe("User register", () => {
	let createStub;

	beforeEach(() => {
		createStub = sinon.stub(User, "create");
	});

	afterEach(() => {
		createStub.restore();
	});

	it("should return 400 if mail, name or password is missing", async () => {
		const response = await request(app)
			.post("/api/auth/register")
			.send({ email: user.email });

		expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
		expect(response.body.message).to.match(/Please provide Name Password/);
	});

	it("should create a new user and return 201", async () => {
		createStub.resolves({
			name: user.name,
			email: user.email,
			password: user.password,
			createJWT: () => "token"
		});
		const response = await request(app).post("/api/auth/register").send({
			name: user.name,
			email: user.email,
			password: user.password
		});

		expect(response.status).to.equal(StatusCodes.CREATED);
		expect(response.body).to.have.property("name", user.name);
		expect(response.body).to.have.property("email", user.email);
	});
});

describe("User login", () => {
	let findOneStub;
	let selectStub;
	let comparePasswordStub;

	beforeEach(() => {
		comparePasswordStub = sinon.stub();
		selectStub = sinon.stub().returns({
			name: user.name,
			email: user.email,
			password: user.password,
			comparePassword: comparePasswordStub,
			createJWT: () => "token"
		});
		findOneStub = sinon
			.stub(User, "findOne")
			.returns({ select: selectStub });
	});

	afterEach(() => {
		findOneStub.restore();
	});

	it("should return 400 if email or password is missing", async () => {
		const response = await request(app)
			.post("/api/auth/login")
			.send({ email: user.email });

		expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
		expect(response.body.message).to.match(/Please provide Password/);
	});

	it("should return 401 if user is not found", async () => {
		selectStub.returns(null);

		const response = await request(app).post("/api/auth/login").send({
			email: user.email,
			password: user.password
		});

		expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
		expect(response.body.message).to.match(/Invalid Credentials/);
	});

	it("should return 401 if password is incorrect", async () => {
		comparePasswordStub.resolves(false);

		const response = await request(app).post("/api/auth/login").send({
			email: user.email,
			password: user.password
		});

		expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
		expect(response.body.message).to.match(/Invalid Credentials/);
	});

	it("should return 200 if credentials are correct", async () => {
		comparePasswordStub.returns(true);

		const response = await request(app).post("/api/auth/login").send({
			email: user.email,
			password: user.password
		});

		expect(response.body).to.have.property("name", user.name);
		expect(response.body).to.have.property("email", user.email);
	});
});

describe("User logout", () => {
	it("should clear the auth token", async () => {
		const response = await request(app).get("/api/auth/logout");

		expect(response.status).to.equal(StatusCodes.OK);
		expect(response.body.message).to.match(/Logged out successfully!/);
	});
});
