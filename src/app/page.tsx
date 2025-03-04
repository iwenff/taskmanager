'use client'
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "../../ui/Input/Input";
import { Button } from "../../ui/Button/Button";
import { Card } from "../../ui/Card/Card";
import { CardContent } from "../../ui/Card/CardContetn";
import { format } from "util";


interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}


export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"Дате" | "Заголовку">("Дате");
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) return;
    setTasks([...tasks, { id: uuidv4(), ...newTask }]);
    setNewTask({ title: "", description: "", dueDate: "" });
  };

  const editTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)));
    setEditingTask(null);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "Дате"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : a.title.localeCompare(b.title)
    );

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Найти задачу"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button onClick={() => setSortBy(sortBy === "Дате" ? "Заголовку" : "Дате")}>
          Сортировать по {sortBy === "Дате" ? "Заголовку" : "Дате"}
        </Button>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Заголовок"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <Input
          placeholder="Описание"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />
        <Input
          type="date"
          value={newTask.dueDate}
          onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <Button onClick={addTask} className="mt-2">Добавить задачу</Button>
      </div>
      <div>
        {filteredTasks.map(task => (
          <Card key={task.id} className="mb-2">
            <CardContent className="p-4 flex justify-between">
              {editingTask?.id === task.id ? (
                <div>
                  <Input
                    value={editingTask.title}
                    onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                  <Input
                    value={editingTask.description}
                    onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={e => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  />
                  <Button onClick={() => editTask(task.id, editingTask)}>Сохранить</Button>
                </div>
              ) : (
                <div>
                  <h2 className="font-bold">{task.title}</h2>
                  <p>{task.description}</p>
                  <p className="text-sm text-gray-500">До: {format(new Date(task.dueDate))}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setEditingTask(task)}>Редактировать</Button>
                <Button onClick={() => deleteTask(task.id)}>Удалить</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
