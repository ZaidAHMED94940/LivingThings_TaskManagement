
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import TodoList from './component/TodoList';
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/Register" element={<Register/>} />
          <Route path='/TodoList' element={<TodoList/>}/>
        </Routes>
    </Router>
  );
}

export default App;