import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskBody, setEditingTaskBody] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [normalTasks, setNormalTasks] = useState([]);

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [taskBody, setTaskBody] = useState("");
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    order: "DESC",
  });

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: pagination,
      });
      setTotalPages(response.data.pages);
      setTasks(response.data.tasks);
      setNormalTasks(response.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAdmin", response.data.isAdmin);
      setIsAdmin(response.data.isAdmin);
      setUser(loginData);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, registerData);
      setRegisterData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      });
      alert("Registration successful. Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/tasks`,
        { body: taskBody },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTaskBody("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setEditingTaskBody(taskToEdit.body);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/tasks/${editingTaskId}`,
        { body: editingTaskBody },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEditingTaskId(null);
      setEditingTaskBody("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTasks([]);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFetchedUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    }
  };

  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleEditUser = (user) => {
    setEditUserId(user.username);
    setEditUserData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      password: "",
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/users/${editUserId}`, editUserData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("User updated successfully");
      setEditUserId(null);
      setEditUserData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      });
      if (user) {
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditUserData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    });
  };

  const [sortDirection, setSortDirection] = useState(null);

  function toggleSortDirection() {
    setSortDirection(prev => {
      if (prev == null) {
        return "asc";
      }
      if (prev == "asc") {
        return "dsc";
      }
      return null;
    })
    if (sortDirection !== null) {
      const temp = sortTasks([...normalTasks]);
      setTasks(temp);
    } else {
      setTasks(normalTasks);
    }
  }

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
  };
  


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ username: localStorage.getItem("username") });
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
      fetchTasks();
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [pagination, user]);

  return (
    <div>
      {user && (
        <div>
          <h1>Task Manager</h1>
          <h2>{isAdmin ? "All Users" : "Your prolife"}</h2>
          <ul>
            {fetchedUsers.map((user) =>
              editUserId === user.username ? (
                <li key={user.username}>
                  <form key={user.username} onSubmit={handleUpdateUser}>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={editUserData.firstName}
                      onChange={(e) =>
                        setEditUserData({
                          ...editUserData,
                          firstName: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={editUserData.lastName}
                      onChange={(e) =>
                        setEditUserData({
                          ...editUserData,
                          lastName: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      value={editUserData.username}
                      onChange={(e) =>
                        setEditUserData({
                          ...editUserData,
                          username: e.target.value,
                        })
                      }
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={editUserData.email}
                      onChange={(e) =>
                        setEditUserData({
                          ...editUserData,
                          email: e.target.value,
                        })
                      }
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </form>
                </li>
              ) : (
                <li key={user.id}>
                  {user.username} - {user.email}
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                </li>
              )
            )}
          </ul>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!user ? (
        <div>
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <button type="submit">Login</button>
          </form>

          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
              type="text"
              placeholder="First Name"
              value={registerData.firstName}
              onChange={(e) =>
                setRegisterData({ ...registerData, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={registerData.lastName}
              onChange={(e) =>
                setRegisterData({ ...registerData, lastName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Username"
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            <button type="submit">Register</button>
          </form>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>

          {!isAdmin && (
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="New task"
                value={taskBody}
                onChange={(e) => setTaskBody(e.target.value)}
              />
              <button type="submit">Create Task</button>
            </form>
          )}

          <h2>Tasks</h2>
          <button onClick={toggleSortDirection}>
            
            {sortDirection === null ? "" : sortDirection === "asc" ? "ASC by create date" : "DSC by create date"}
          </button>

          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {editingTaskId === task.id ? (
                  <form onSubmit={handleUpdateTask}>
                    <input
                      type="text"
                      value={editingTaskBody}
                      onChange={(e) => setEditingTaskBody(e.target.value)}
                    />
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      onClick={() => setEditingTaskId(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    {task.body}
                    <button onClick={() => handleEditTask(task.id)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>

          <div>
            <button
              disabled={pagination.page == 1}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(prev.page - 1, 1),
                }))
              }
            >
              Previous
            </button>
            <button
              disabled={pagination.page == totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
