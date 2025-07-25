import React, { useState } from "react";
import "../../styles/index.css";
//import '@fortawesome/fontawesome-free/css/all.min.css';


const Home = () => {
    const [tarea, setTarea]= useState([]); // Estado para la lista de tareas
    const [nuevaTarea, setNuevaTarea] = useState(""); // Estado para manejar lo que el usuario escribe

    // Función para manejar el "Enter" en el input
    const handleKeyUp = (e) => {
        if (e.key === "Enter" && nuevaTarea.trim() !== "") {
            setTarea([...tarea, nuevaTarea.trim()]);
            setNuevaTarea("");
        }
    };

    // Función para borrar una tarea
    const borrarTarea = (index) => {
        const actualizaTareas = tarea.filter((_, i) => i !== index);
        setTarea(actualizaTareas);
    };

    return (
        <div className="container text-center mt-5 todo-container">
            <h1 className="title">Lista de tareas.</h1>
            <input
                type="text"
                placeholder="No hay tareas, añadir tarea"
                className="form-control mb-3"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                id="tarea"
                name="tarea"
                onKeyUp={handleKeyUp}
            />
            <ul className="list-group shadow">
                {tarea.length === 0 ? (
                    <li className="list-group-item text-muted">No hay tareas, añadir tareas</li>
                ) : (
                    tarea.map((tarea, i) => (
                        <li
                            key={i}
                            className="list-group-item d-flex justify-content-between align-items-center tarea-item"
                        >
                            {tarea}
                            <span onClick={() => borrarTarea(i)}>
                                <i className="fa-solid fa-trash"></i>
                            </span>
                        </li>
                    ))
                )}
            </ul>
            <div className="text-center mt-2 text-muted">
                {tarea.length > 0 ? `${tarea.length} tarea${tarea.length > 1 ? "s" : ""} restantes` : ""}
            </div>
        </div>
    );
};
export default Home;
