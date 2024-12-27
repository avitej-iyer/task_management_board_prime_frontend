import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import api from '../api';
import { Task } from '../types/Task';

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]); // State to store tasks
    const [newTask, setNewTask] = useState({ title: '', description: '', status: '' }); // State for new task form
    const [error, setError] = useState<string | null>(null); // Error message state
    const navigate = useNavigate(); // React Router navigation hook

    // Fetch tasks when the component loads
    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            if (!token) {
                navigate('/'); // Redirect to login if no token found
                return;
            }

            try {
                // Make API request to fetch tasks
                const response = await api.get('/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(response.data); // Update tasks state with API response
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        };

        fetchTasks();
    }, [navigate]);

    // Handle new task form submission
    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        const token = localStorage.getItem('token'); // Retrieve token
        if (!token) {
            setError('You must be logged in to add a task.');
            return;
        }

        try {
            // Make API request to add a new task
            const response = await api.post(
                '/tasks',
                newTask,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, response.data]); // Add the new task to the tasks list
            setNewTask({ title: '', description: '', status: '' }); // Reset the form
        } catch (err: any) {
            console.error('Error adding task:', err);
            setError('Failed to add task. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>My Tasks</h2>

            {/* New Task Form */}
            <form onSubmit={handleAddTask} className="mb-4">
                <div className="mb-3">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label>Status</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary">Add Task</button>
            </form>

            {/* Tasks List */}
            <ul className="list-group">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <li key={task._id} className="list-group-item">
                            <h5>{task.title}</h5>
                            <p>{task.description}</p>
                            <p><strong>Status:</strong> {task.status}</p>
                        </li>
                    ))
                ) : (
                    <p>No tasks found. Add a new task!</p>
                )}
            </ul>
        </div>
    );
};

export default TasksPage;
