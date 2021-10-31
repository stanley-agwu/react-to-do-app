import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import TodoItem from './TodoItem';
import AddItem from './AddItem';

const StyledTodo = styled.div`
  height: auto;
  max-width: 750px;
  margin: 0 auto;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.lightGrey};
  border-radius: 20px;

  h1 {
    font-size: 40px;
    color: ${({ theme }) => theme.darkestGrey};
    text-align: center;
    padding: 10px;
    text-shadow: 2px 4px 3px rgba(0, 0, 0, 0.3);
    margin-top: 0;
    margin-bottom: 40px;
  }

  @media (max-width: 767px) {
    width: 90%;
    min-width: 230px;
  }
`;

const StyledTodoList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 40px;
`;

const StyledFooter = styled.div`
  margin: 20px 0 40px;
  text-align: center;

  p {
    font-size: 12px;
    color: ${({ theme }) => theme.lightGrey};
  }
`;

const Todo = () => {
  const [todoItems, setTodoItems] = useState([]);

  useEffect(() => {
    // Load from storage
    if (typeof Storage !== 'undefined') {
      // localStorage supported.
      const todos = JSON.parse(localStorage.getItem('todoItems'));
      if (todos) {
        setTodoItems(todos);
      }
    } else {
      // Using cookies here :(
      let todos = document.cookie;
      if (todos !== '') {
        todos = todos.split('; ');
        const decodedTodos = [];
        todos.forEach((item) => {
          const splitItem = item.split('=');
          decodedTodos.push({
            date: splitItem[0],
            todo: splitItem[1],
          });
        });
        setTodoItems(decodedTodos);
      }
    }
  }, []);

  useEffect(() => {
    // save to storage
    if (typeof Storage !== 'undefined') {
      // localStorage supported.
      localStorage.setItem('todoItems', JSON.stringify(todoItems));
    } else {
      // Using cookies here :(
      const todos = todoItems;
      todos.forEach((item) => {
        document.cookie = `${item.date}=${item.todo}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      });
    }
  }, [todoItems]);

  const addItem = (todoText, dueDate, priority) => {
    const todos = todoItems;
    todos.push({ todo: todoText, dueDate, priority, date: new Date().getTime() });
    setTodoItems([...todos]);
  };

  const deleteItem = (item) => {
    const todos = todoItems.filter((todoItem) => item !== todoItem);
    setTodoItems(todos);
  };

  const editItem = (item, value) => {
    const todos = todoItems;
    const editTodo = todos.find((todoItem) => todoItem.date === item.date);
    editTodo.todo = value;
    setTodoItems([...todos]);
  };

  return (
    <StyledTodo className="wrapper">
      <h1>todos.</h1>
      <AddItem addItem={addItem} />
      <StyledTodoList>
        <ul>
          {todoItems
            .sort((a, b) => (b.date - a.date))
            .map((item) => (
              <TodoItem
                item={item}
                key={item.date}
                deleteItem={deleteItem}
                editItem={editItem}
              />
            ))}
        </ul>
      </StyledTodoList>
      <StyledFooter>
        <p>A simple Todo app made with React.</p>
        <p>
          It&#39;s ok to close the browser, all items will be saved locally.
        </p>
        <p>
          If you use Private browsing or Incognito mode, the app will be unable
          to save changes.
        </p>
      </StyledFooter>
    </StyledTodo>
  );
};

export default Todo;
