import React from 'react'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Menu from './UserPages/Menu'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import FoodMenu from './Pages/FoodMenu'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/foodmenu/:id' element={<FoodMenu/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/menu' element={<Menu/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
