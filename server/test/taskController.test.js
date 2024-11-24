// Import necessary dependencies
import { expect } from "chai";
import sinon from "sinon";
import supertest from "supertest";
import {
	createTask,
	checkDueDate,
	checkAssignee
} from "../controllers/taskController.js"; // Update the path
import app from "../server.js"; // Assuming express app is in `app.js`
import User from "../models/User.js"; // Assuming User model is in `models/User.js`
import Task from "../models/Task.js"; // Assuming Task model is in `models/Task.js`
import { BadRequestError, NotFoundError } from "../errors/index.js"; // Custom error classes
import { StatusCodes } from "http-status-codes";

// Test Suite for Task Creation
describe("Task Creation Tests", () => {
	let userFindOneStub;
	let taskSaveStub;

	beforeEach(() => {
		// Stub the User.findOne to mock the database lookup
		userFindOneStub = sinon.stub(User, "findOne");

		// Stub Task.save to mock saving the task to the database
		taskSaveStub = sinon.stub(Task.prototype, "save");
	});

	afterEach(() => {
		// Restore the stubs after each test
		sinon.restore();
	});

	describe("checkDueDate function", () => {
		it("should throw an error if the due date is in the past", () => {
			const pastDate = new Date();
			pastDate.setDate(pastDate.getDate() - 1); // Set date to yesterday

			expect(() => checkDueDate(pastDate)).to.throw(
				BadRequestError,
				"Due date can not be a past date."
			);
		});

		it("should not throw an error if the due date is today or in the future", () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 1); // Set date to tomorrow
			expect(() => checkDueDate(futureDate)).to.not.throw();
		});
	});

	describe("checkAssignee function", () => {
		it("should throw an error if the assignee is not found in the database", async () => {
			userFindOneStub.resolves(null); // Simulate no user found

			try {
				await checkAssignee("nonexistent@example.com");
			} catch (err) {
				expect(err).to.be.an.instanceof(NotFoundError);
				expect(err.message).to.equal(
					"Please provide a valid assignee email id"
				);
			}
		});

		it("should return assignee data if the user exists", async () => {
			const mockAssignee = {
				email: "assignee@example.com",
				name: "Assignee Name"
			};
			userFindOneStub.resolves(mockAssignee); // Simulate user found

			const assignee = await checkAssignee("assignee@example.com");
			expect(assignee).to.deep.equal(mockAssignee);
		});
	});

	describe("createTask function", () => {
		it("should successfully create a task when valid assignee and due date are provided", async () => {
			const mockAssignee = {
				email: "assignee@example.com",
				name: "Assignee Name"
			};
			userFindOneStub.resolves(mockAssignee); // Simulate valid assignee
			taskSaveStub.resolves(); // Mock task save

			const req = {
				body: {
					assignee: "assignee@example.com",
					dueDate: new Date().toISOString()
				},
				user: {
					userEmail: "creator@example.com",
					userName: "Creator Name",
					userId: "12345"
				}
			};

			const res = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub()
			};

			await createTask(req, res);

			expect(userFindOneStub.calledOnce).to.be.true;
			expect(taskSaveStub.calledOnce).to.be.true;
			expect(res.status.calledWith(201)).to.be.true;
			expect(res.json.calledOnce).to.be.true;
		});

		it("should return an error if the due date is in the past", async () => {
			const req = {
				body: {
					assignee: "assignee@example.com",
					dueDate: new Date(
						new Date().setDate(new Date().getDate() - 1)
					).toISOString() // Past date
				},
				user: {
					userEmail: "creator@example.com",
					userName: "Creator Name",
					userId: "12345"
				}
			};

			const res = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub()
			};

			try {
				await createTask(req, res);
			} catch (err) {
				expect(err).to.be.an.instanceof(BadRequestError);
				expect(err.message).to.equal(
					"Due date can not be a past date."
				);
			}
		});

		it("should return an error if the assignee does not exist", async () => {
			const req = {
				body: {
					assignee: "nonexistent@example.com",
					dueDate: new Date().toISOString()
				},
				user: {
					userEmail: "creator@example.com",
					userName: "Creator Name",
					userId: "12345"
				}
			};

			const res = {
				status: sinon.stub().returnsThis(),
				json: sinon.stub()
			};

			userFindOneStub.resolves(null); // Simulate assignee not found

			try {
				await createTask(req, res);
			} catch (err) {
				expect(err).to.be.an.instanceof(NotFoundError);
				expect(err.message).to.equal(
					"Please provide a valid assignee email id"
				);
			}
		});
	});
});
