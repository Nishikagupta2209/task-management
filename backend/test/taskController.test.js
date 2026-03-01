import * as mockingoose from "mockingoose";
import Task from "../models/Task.js";
import { createTask, getTasks } from "../controllers/taskController.js";

describe("Task Controller Unit Tests", () => {
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("createTask → should create task successfully", async () => {
    const req = {
      body: {
        title: "Test Task",
        description: "Task description",
        priority: "Low",
        status: "To Do",
        dueDate: "2026-02-19",
      },
      user: { id: "123" },
    };

    // Mocking Task.prototype.save to simulate instance save
    const saveMock = jest.spyOn(Task.prototype, "save").mockResolvedValue({
      _id: "mockId123",
      ...req.body,
      userId: req.user.id,
    });

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Test Task" })
    );

    saveMock.mockRestore(); // restore original save after test
  });

  it("getTasks → should return tasks for user", async () => {
    const req = {
      query: {},
      user: { id: "123" },
    };

    const mockTasks = [
      { _id: "1", title: "Task 1", priority: "Low", status: "To Do", userId: "123" },
      { _id: "2", title: "Task 2", priority: "High", status: "In Progress", userId: "123" },
    ];

    mockingoose(Task).toReturn(mockTasks, "find");

    await getTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: "Task 1" }),
        expect.objectContaining({ title: "Task 2" }),
      ])
    );
  });
});