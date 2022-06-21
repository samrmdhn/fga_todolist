import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
export default function Home() {
  const [activity, setActivity] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState([]);
  const [editInput, setEditInput] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("likedPost") !== null) {
      const listActivity = JSON.parse(
        window.localStorage.getItem("likedPost") || "[]"
      );
      setTodos(listActivity);
    }
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    setTodos([
      ...todos,
      {
        name: activity,
        id: Date.now(),
      },
    ]);

    const listActivity = JSON.parse(
      window.localStorage.getItem("likedPost") || "[]"
    );

    listActivity.push({ name: activity, id: Date.now() });

    window.localStorage.setItem("likedPost", JSON.stringify([...listActivity]));
    setActivity("");
  };

  const editHandler = (postId) => {
    const filteredPost = todos.findIndex((todo) => {
      return todo.id == postId;
    });
    const filteredTodos = todos[filteredPost];
    setEditId(filteredTodos);
  };

  const editHandlerSubmit = (e, todoId) => {
    e.preventDefault();
    //  console.log(postId);
    const cloneTodos = [...todos];
    console.log(cloneTodos);
    console.log(editInput);
    console.log(todoId);
    const filteredClone = cloneTodos.findIndex((cloneTodo) => {
      return cloneTodo.id == todoId;
    });
    cloneTodos[filteredClone].name = editInput;

    const listActivity = JSON.parse(
      window.localStorage.getItem("likedPost") || "[]"
    );

    listActivity[filteredClone] = {
      name: cloneTodos[filteredClone].name,
      id: cloneTodos[filteredClone].id,
    };

    window.localStorage.setItem("likedPost", JSON.stringify([...listActivity]));

    setTodos(cloneTodos);
    setEditInput("");
    setEditId("");

    console.log(cloneTodos);
  };

  const deleteHandler = (todoId) => {
    console.log(todoId);
    const filteredTodos = todos.filter((todo) => {
      return todo.id !== todoId;
    });

    setTodos(filteredTodos);

    const listActivity = JSON.parse(
      window.localStorage.getItem("likedPost") || "[]"
    );

    window.localStorage.setItem("likedPost", JSON.stringify(filteredTodos));
  };

  return (
    <div>
      <h3>MY TODO</h3>
      <form onSubmit={submitHandler}>
        <input
          value={activity}
          onChange={(e) => {
            setActivity(e.target.value);
          }}
          type="text"
          placeholder="Add to do.."
        />
        <button type="submit">Submit</button>
      </form>
      <h3>List my todos</h3>
      <ul>
        {todos.map((todo) => {
          return (
            <div key={todo.id}>
              <li>
                {editId.id == todo.id ? (
                  <>
                    <form
                      onSubmit={(e) => {
                        editHandlerSubmit(e, todo.id);
                      }}
                    >
                      <input
                        type="text"
                        value={editInput}
                        placeholder={`Editing to "${todo.name}"....`}
                        onChange={(e) => {
                          setEditInput(e.target.value);
                        }}
                      />
                      <button type="submit">Save changes</button>
                    </form>
                    <button
                      onClick={() => {
                        setEditId("");
                        setEditInput("");
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {todo.name}
                    <button
                      onClick={() => {
                        editHandler(todo.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteHandler(todo.id);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
