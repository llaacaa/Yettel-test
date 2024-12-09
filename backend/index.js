const express = require("express");
const { Sequelize, DataTypes, where } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
const sequelize = new Sequelize("yettel-test", "root", "", {
  host: "localhost",
  dialect: "mysql", 
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.use(bodyParser.json());

const User = sequelize.define("User", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("basic", "admin"),
    allowNull: false,
    defaultValue: "basic",
  },
});

const Task = sequelize.define("Task", {
  body: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "jwtsecret", (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "jwtsecret", {
      expiresIn: "1h",
    });
    res.json({ token, isAdmin: user.role == "admin" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/tasks", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "basic")
      return res.status(403).json({ message: "Forbidden" });

    const { body } = req.body;
    const task = await Task.create({ body, userId: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role === "basic" && task.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    task.body = req.body.body;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (req.user.role === "basic" && task.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
        const user = await User.findOne({
            where: {id: req.user.id},
            attributes: ["id", "username", "firstName", "lastName", "email"],
          });
    
          res.json([user]);
    } else {
      const users = await User.findAll({
        attributes: ["id", "username", "firstName", "lastName", "email"],
      });

      res.json(users);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/tasks", authenticateToken, async (req, res) => {
  try {
    let { page = 1, limit = 10, order = "DESC" } = req.query;

    
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, Math.min(100, parseInt(limit))); 

  
    order = order.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const whereClause =
      req.user.role === "basic" ? { userId: req.user.id } : {};

    const tasks = await Task.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: (page - 1) * limit,
      order: [["createdAt", order]], 
    });

    res.json({
      tasks: tasks.rows,
      total: tasks.count,
      page: page,
      pages: Math.ceil(tasks.count / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

app.put("/users/:username", authenticateToken, async (req, res) => {
  try {
    console.log(req.params.username);
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.role === "basic" && req.params.username !== user.username) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { firstName, lastName, username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

(async () => {
  try {
    await sequelize.sync({ force: false });
    app.listen(3000, () => {
      console.log(`Server running on port 3000`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
