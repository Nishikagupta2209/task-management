import * as mockingoose from "mockingoose";
import User from "../models/User.js";
import { register, login } from "../controllers/authController.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

describe("Auth Controller Unit Tests", () => {
  let res, next;

  beforeAll(() => {
    // Set a dummy JWT secret for tests
    process.env.JWT_SECRET = "testsecret";
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock res object with chaining
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it("register → should create a user successfully", async () => {
    const req = { body: { email: "test@test.com", password: "Password123!" } };

    mockingoose(User).toReturn(null, "findOne"); // user doesn't exist
    mockingoose(User).toReturn(req.body, "save"); // save returns user

    await register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully" });
    expect(next).not.toHaveBeenCalled();
  });

  it("login → should return JWT token for valid credentials", async () => {
    const password = "Password123!";
    const hashedPassword = await bcrypt.hash(password, 10);
    const req = { body: { email: "test@test.com", password } };

    mockingoose(User).toReturn({
      _id: "123",
      email: "test@test.com",
      password: hashedPassword
    }, "findOne");

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: expect.any(String) })
    );
    expect(next).not.toHaveBeenCalled();
  });
});