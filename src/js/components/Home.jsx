import React, { useEffect, useState } from "react";
import "../../styles/index.css";
//import '@fortawesome/fontawesome-free/css/all.min.css';



const Home = () => {
    const [tarea, setTarea]= useState([]); // Estado para la lista de tareas
    const [nuevaTarea, setNuevaTarea] = useState(""); // Estado para manejar lo que el usuario escribe
    const [usuarioCreado, setUsuarioCreado] = useState(false); 
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

    const crearTarea= async () => {
        const response = await fetch("https://playground.4geeks.com/todo/todos/Angel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ label: nuevaTarea, done: false })
        });
        const data = response.json();
        console.log(data);
        setNuevaTarea(""); 
        getTareas(); 
    }
    const crearUsuario = async () => {
        try{
            const response = await fetch("https://playground.4geeks.com/todo/users/Angel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([])
            });
            if (!response.ok) {
                console.log("Error al crear el usuario");
                setUsuarioCreado(true);
                return;
            }
            console.log(response);
            const data = await response.json()
            console.log(data);
            setUsuarioCreado(true);
            getTareas();
        }catch (error) {
            console.log("Error al crear el usuario", error);
            setUsuarioCreado(true);
            }
        };

    const getTareas = async () => {
        try {
        const response = await fetch("https://playground.4geeks.com/todo/users/Angel");
        console.log(response);
        if (!response.ok) {
            console.log("No existe el usuario, crear usuario");
            if (!usuarioCreado) await crearUsuario();
            return;
            }
            const data = await response.json()
            console.log(data);
            setTarea(data.tareas || []); //Para asegurarme que data.tareas existe y es un array.
        } catch (error) {
            console.log("Error al obtener las tareas", error);
            if (!usuarioCreado) await crearUsuario();
        }
        
                
    }
    useEffect(() => {
        getTareas();
    }, []);

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
                onKeyUp={(e) =>{
                    if (e.key === "Enter") crearTarea();
                }}
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
