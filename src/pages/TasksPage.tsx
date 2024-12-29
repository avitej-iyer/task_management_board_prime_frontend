import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// @ts-ignore
import api from '../api';
import { Task } from '../types/Task';

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: '' });
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await api.get('/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    useEffect(() => {
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
            await api.put(
                `/tasks/${editTask._id}`,
                {
                    title: editTask.title,
                    description: editTask.description,
                    status: editTask.status,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchTasks();
            setEditTask(null);
        } catch (err: any) {
            console.error('Error updating task:', err);
            setError('Failed to update task. Please try again.');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to delete a task.');
                return;
            }

            try {
                await api.delete(`/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            } catch (err: any) {
                console.error('Error deleting task:', err);
                setError('Failed to delete task. Please try again.');
            }
        }
    };

    const handleDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) return; // If dropped outside a valid area, do nothing

        const reorderedTasks = Array.from(tasks);
        const [movedTask] = reorderedTasks.splice(source.index, 1);
        reorderedTasks.splice(destination.index, 0, movedTask);

        setTasks(reorderedTasks);
    };

    return (
        <div className="container mt-5">
            <h2>My Tasks</h2>

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

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="row">
                            {tasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="col-md-4 mb-4"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">{task.title}</h5>
                                                    <p className="card-text">{task.description || 'No description available.'}</p>
                                                    <p className="badge bg-info text-dark">{task.status}</p>
                                                </div>
                                                <div className="card-footer d-flex justify-content-between">
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => setEditTask({ ...task })}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteTask(task._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} className="me-2" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {editTask && (
                <div
                    className="modal"
                    style={{
                        display: 'block',
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        zIndex: 1000,
                        border: '1px solid #ccc',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <h4>Edit Task</h4>
                    <form onSubmit={handleUpdateTask}>
                        <div className="mb-3">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editTask.title}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, title: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                value={editTask.description || ''}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, description: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label>Status</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editTask.status}
                                onChange={(e) =>
                                    setEditTask({ ...editTask, status: e.target.value })
                                }
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
            )}
        </div>
    );
};

export default TasksPage;
