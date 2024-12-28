import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import api from '../api';
import { Task } from '../types/Task';

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: '' });
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await api.get('/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(response.data);
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }
        };

        fetchTasks();
    }, [navigate]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to add a task.');
            return;
        }

        try {
            const response = await api.post('/tasks', newTask, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks([...tasks, response.data]);
            setNewTask({ title: '', description: '', status: '' });
        } catch (err: any) {
            console.error('Error adding task:', err);
            setError('Failed to add task. Please try again.');
        }
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem('token');
        if (!token || !editTask) {
            setError('You must be logged in to edit a task.');
            return;
        }

        try {
            const response = await api.put(
                `/tasks/${editTask._id}`,
                {
                    title: editTask.title,
                    description: editTask.description,
                    status: editTask.status,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === response.data._id ? response.data : task))
            );
            setEditTask(null); // Close modal
        } catch (err: any) {
            console.error('Error updating task:', err);
            setError('Failed to update task. Please try again.');
        }
    };

    const handleDeleteTask = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await api.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    const handleDeleteTaskWithConfirmation = (id: string) => {
        if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            handleDeleteTask(id);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">My Tasks</h2>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Status"
                            value={newTask.status}
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">
                            Add Task
                        </button>
                    </div>
                </div>
            </form>

            {/* Task Grid */}
            <div className="row g-3">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task._id} className="col-md-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{task.title}</h5>
                                    <p className="card-text">{task.description || 'No description provided.'}</p>
                                    <span className="badge bg-info text-dark">{task.status}</span>
                                </div>
                                <div className="card-footer d-flex justify-content-between">
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setEditTask({ ...task })}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteTaskWithConfirmation(task._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No tasks found. Add a task above to get started!</p>
                )}
            </div>

            {/* Edit Task Modal */}
            {editTask && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Edit Task</h4>
                        <form onSubmit={handleUpdateTask}>
                            <div className="mb-3">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editTask.title}
                                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    value={editTask.description || ''}
                                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Status</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editTask.status}
                                    onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditTask(null)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksPage;
