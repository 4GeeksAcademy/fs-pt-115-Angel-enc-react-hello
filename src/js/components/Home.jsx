import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const Home = () => {
    const [tarea, setTarea] = useState([]);
    const [nuevaTarea, setNuevaTarea] = useState("");
    const username = "Angel";

    const crearUsuario = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([])
            });

            if (response.ok) {
                console.log("Usuario creado");
                getTareas();
            } else {
                const data = await response.json();
                console.log("Error al crear usuario:", data.msg);
            }
        } catch (error) {
            console.log("Error al crear el usuario", error);
        }
    };

    const getTareas = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
            if (response.ok) {
                const data = await response.json();
                setTarea(data.todos || []);
            } else if (response.status === 404) {
                console.log("Usuario no existe, creando...");
                await crearUsuario();
            } else {
                console.log("Error al obtener tareas");
            }
        } catch (error) {
            console.log("Error al obtener las tareas", error);
        }
    };

    const crearTarea = async () => {
        if (!nuevaTarea.trim()) return;

        try {
            const nueva = {
                label: nuevaTarea.trim(),
                done: false
            };

            const response = await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nueva)
            });

            if (response.ok) {
                setNuevaTarea("");
                getTareas();
            } else {
                console.log("Error al crear la tarea");
            }
        } catch (error) {
            console.log("Error al crear la tarea", error);
        }
    };

    const borrarTarea = async (index) => {
        const tareaAEliminar = tarea[index];
        if (!tareaAEliminar?.id) return;

        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${tareaAEliminar.id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                getTareas();
            } else {
                console.log("Error al eliminar tarea");
            }
        } catch (error) {
            console.log("Error al eliminar tarea", error);
        }
    };

    const limpiarTodas = async () => {
        try {
            const deletes = tarea.map((t) =>
                fetch(`https://playground.4geeks.com/todo/todos/${t.id}`, {
                    method: "DELETE"
                })
            );
            await Promise.all(deletes);
            getTareas();
        } catch (error) {
            console.log("Error al eliminar todas las tareas", error);
        }
    };

    useEffect(() => {
        getTareas();
    }, []);

    return (
        <div className="container text-center mt-5 todo-container">
            <h1 className="title">Lista de tareas</h1>

            <input
                type="text"
                placeholder="Añadir tarea"
                className="form-control mb-3"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && crearTarea()}
            />

            <ul className="list-group shadow">
                {Array.isArray(tarea) && tarea.length === 0 ? (
                    <li className="list-group-item text-muted">No hay tareas</li>
                ) : (
                    tarea.map((t, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between align-items-center tarea-item">
                            {t.label}
                            <span onClick={() => borrarTarea(i)} style={{ cursor: "pointer" }}>
                                <i className="fa-solid fa-trash"></i>
                            </span>
                        </li>
                    ))
                )}
            </ul>

            <div className="text-center mt-3">
                {tarea.length > 0 && (
                    <>
                        <p className="text-muted">{tarea.length} tarea{tarea.length > 1 ? "s" : ""} restantes</p>
                        <button className="btn btn-danger btn-sm" onClick={limpiarTodas}>
                            Borrar todas
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;