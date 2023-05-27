/* 
  할 일 목록을 관리하고 렌더링하는 주요 컴포넌트입니다.
  상태 관리를 위해 `useState` 훅을 사용하여 할 일 목록과 입력값을 관리합니다.
  할 일 목록의 추가, 삭제, 완료 상태 변경 등의 기능을 구현하였습니다.
*/
import React, { useEffect, useState } from "react";
import TodoItem from "@/components/TodoItem";
import styles from "@/styles/TodoList.module.css";

import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

const todoCollection = collection(db, "todos");

// TodoList 컴포넌트를 정의합니다.
const TodoList = () => {
  // 상태를 관리하는 useState 훅을 사용하여 할 일 목록과 입력값을 초기화합니다.
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const getTodos = async () => {
    const q = query(todoCollection);
    const results = await getDocs(q);
    const newTodos = [];
    results.docs.forEach((doc) => {
      newTodos.push({ id: doc.id, ...doc.data() });
    });

    setTodos(newTodos);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async ()=> {
    if(input.trim() === "") return;
    const docRef = await addDoc(todoCollection, {
      text: input,
      completed: false,
    });
    setTodos([...todos, { id: docRef.id, text: input, completed: false }]);
    setInput("");
  };
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  // const [deletedTodos, setDeletedTodos] = useState([]);


  // addTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
  // const addTodo = () => {
  //   // 입력값이 비어있는 경우 함수를 종료합니다.
  //   if (input.trim() === "") return;
  //   // 기존 할 일 목록에 새로운 할 일을 추가하고, 입력값을 초기화합니다.
  //   // {
  //   //   id: 할일의 고유 id,
  //   //   text: 할일의 내용,
  //   //   completed: 완료 여부,
  //   // }
  //   // ...todos => {id: 1, text: "할일1", completed: false}, {id: 2, text: "할일2", completed: false}}, ..
  //   setTodos([...todos, { id: Date.now(), text: input, completed: false, date: selectedDate, time: selectedTime }]);
  //   setInput("");
  //   setSelectedDate(null);
  //   setSelectedTime(null);
  // };
  
  // 할일 추가했을 때 추가했다는 alert
  function handleButtonClick() {
  // Trigger the "added" event here
  alert("added");
  }


  // toggleTodo 함수는 체크박스를 눌러 할 일의 완료 상태를 변경하는 함수입니다.
  const toggleTodo = (id) => {
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
    // setTodos(
    //   // todos.map((todo) =>
    //   //   todo.id === id ? { ...todo, completed: !todo.completed } : todo
    //   // )
    //   // ...todo => id: 1, text: "할일1", completed: false
    //   todos.map((todo) => {
    //     return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
    //   })
    // );
    const newTodos = todos.map((todo) => {
      if(todo.id === id) {
        const todoDoc = doc(todoCollection, id);
        updateDoc(todoDoc, { completed: !todo.completed });
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });

    setTodos(newTodos);
  };

  
  // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
  // const deleteTodo = (id) => {
    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // setTodos(todos.filter((todo) => todo.id !== id));
    // 해당 id를 가진 할 일을 찾아 삭제합니다.
  // const deletedTodo = todos.find((todo) => todo.id === id);
  // // 삭제한 할 일을 "Deleted Todo" 란에 보이도록 추가합니다.
  // setDeletedTodos([...deletedTodos, deletedTodo]);
  //   setTodos(
  //     todos.filter((todo) => {
  //       return todo.id !== id;
  //     })
  //   );
  // };
  const deleteTodo = (id) => {
    const todoDoc = doc(todoCollection, id);
    deleteDoc(todoDoc);
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };

  // 할일 정렬
  const sortTodos = (todos) => {
    return todos.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + a.time);
      const dateB = new Date(b.date + 'T' + b.time);
      
      // 1. 마감일자를 우선순위로 정렬
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      
      // 2. 같은 마감일자인 할 일이 여러개일 경우 마감 시간을 고려하여 정렬
      if (a.time && b.time) {
        const timeA = parseInt(a.time.replace(':', ''));
        const timeB = parseInt(b.time.replace(':', ''));
        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;
      }
      
      // 3. 마감일자와 마감시간이 모두 같으면 입력된 순서대로 정렬
      return 0;
    });
  };


  
  // 컴포넌트를 렌더링합니다.
  return (
    <div className={styles.container}>
      <h1 className="text-xl mb-4 font-bold underline underline-offset-4 decoration-wavy text-blue-500">
        Todo List
      </h1>
      <div className={styles.inputContainer}></div>
      {"할 일 입력" /* 할 일을 입력받는 텍스트 필드입니다. */}
      <input
        type="text"
        // className={styles.itemInput}
        // -- itemInput CSS code --
        // input[type="text"].itemInput {
        //   width: 100%;
        //   padding: 5px;
        //   margin-bottom: 10px;
        // }
        className="shadow-lg w-full p-1 mb-4 border border-gray-300 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {/* 할 일의 마감 일자를 입력받는 필드입니다. */}
      <input
        type="date"
        className={styles.itemInput}
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)} 
        />
      {/* 할 일의 마감 시간을 입력받는 필드입니다. */}
      <input
        type="time"
        className={styles.itemInput}
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
      />
      {/* 할 일을 추가하는 버튼입니다. */}
      <div class="grid">
        <button
          // className={styles.addButton}
          // -- addButton CSS code --
          // button.addButton {
          //   padding: 5px;
          //   background-color: #0070f3;
          //   color: white;
          //   border: 1px solid #0070f3;
          //   border-radius: 5px;
          //   cursor: pointer;
          // }
          //
          // button.addButton:hover {
          //   background-color: #fff;
          //   color: #0070f3;
          // }
          className="w-40 justify-self-end p-1 mb-4 bg-pink-500 text-white border border-pink-500 rounded hover:bg-white hover:text-pink-500"
          onClick={() => {
            addTodo();
            handleButtonClick();
          }}
        >
          Add Todo
        </button>

      <div className="w-1/2 pr-4">
        <h2 className="text-lg font-medium mb-2">Todo List</h2>
        <ul>
          {sortTodos(todos)
            .filter((todo) => !todo.completed)
            .map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
              />
            ))}
        </ul>
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-lg font-medium mb-2">Completed Todo</h2>
        <ul>
          {sortTodos(todos)
            .filter((todo) => todo.completed)
            .map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={() => deleteTodo(todo.id)}
              />
            ))}
        </ul>
      </div>
      

      {/* {deletedTodos.length > 0 && (
  <div className={styles.deletedList}>
    <h2>Deleted Todos</h2>
    <ul>
      {deletedTodos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  </div>
)} */}


    </div>
  </div>
  );
};

export default TodoList;
