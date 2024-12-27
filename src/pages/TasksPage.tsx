import React, { useState, useEffect } from 'react';
// @ts-ignore
import axios from '../api';
import { Task } from '../types/Task';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="container mt-5">
      <h2>My Tasks</h2>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className="list-group-item">
            <strong>{task.title}</strong> - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
