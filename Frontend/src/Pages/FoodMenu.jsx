import React, { useEffect, useState } from "react";
import "./FoodMenu.css";
import {useParams} from "react-router-dom"
function FoodMenu() {
  const [data,setdata] = useState([]) 
  const [categories,setCategories] = useState([])
  const {id} = useParams() 
  const getAllButtons = async(id) => {
    const response = await fetch("http://localhost:3010/getAllButtons/"+id)
    const result = await response.json()
    if(response.status===202) setCategories(result.data)
    else {
      setCategories([])
      alert(result.message)
    }
  }
  const getAllItems = async(id) => {
    const response = await fetch("http://localhost:3010/getAllItems/"+id)
    const result = await response.json()
    if(response.status===202) setdata(result.data)
    else {
      setdata([])
      alert(result.message)
    }
  }
  const getAllItemsCategory = async(id,category) => {
    const response = await fetch("http://localhost:3010/getAllItems/"+id+"/"+category)
    const result = await response.json()
    if(response.status===202) setdata(result.data)
    else {
      setdata([])
      alert(result.message)
    }
  }
  useEffect(()=>{
    getAllButtons(id)
    getAllItems(id)
  },[id])
  const handleFilter = async(category) => {
    if(!id) return
    await getAllItemsCategory(id,category)
  }


  return (
    <div className="foodmenu-container">
      <h2 className="page-title">Food Menu</h2>
      <div className="category-buttons">
        <button className={`category-btn`} onClick={()=>getAllItems(id)}>All</button>
        {categories.map((cat, index) => (
          <button key={index} className={`category-btn`} onClick={()=>handleFilter(cat)}>{cat}</button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu-list">
        {data.length === 0 ? (
          <p className="empty-msg">No items available in this category.</p>
        ) : (
          data.map((item, index) => (
            <div className="menu-card" key={index}>
              <img src={"http://localhost:3010/"+item.image} alt={item.name} className="menu-img" />
              <h3>{item.name}</h3>
              <p><b>Category:</b> {item.category}</p>
              <p><b>Price:</b> ₹{item.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FoodMenu;
