import React, { useState } from "react";
import "./Menu.css";
import { useEffect } from "react";
import {useNavigate} from "react-router-dom"
function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
  });
  const navigate = useNavigate()
  const getAllMenus = async() => {
    const auth = JSON.parse(localStorage.getItem("Authorization"))
    if(!auth || !auth.token) return navigate("/")
    const response = await fetch("http://localhost:3010/getAllMenus",{
      method:"get",
      headers:{
        "Content-Type":"application/json",
        "Authorization":auth.token
      }
    })
    const result = await response.json()
    if(response.status===202) setMenuItems(result.data)
    else {
      setMenuItems([])
      alert(result.message)
    }
  }
  useEffect(()=>{
    getAllMenus()
  },[])

  const handleChange = (e) => {
    if (e.target.name === "image" && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const auth = JSON.parse(localStorage.getItem("Authorization"))
    if(!auth || !auth.token) return navigate("/")

    const form = new FormData()
    form.append("name",formData.name)
    form.append("price",formData.price)
    form.append("category",formData.category)
    form.append("image",formData.image)

    const response = await fetch("http://localhost:3010/createMenu",{
      method:"post",
      body:form,
      headers:{
        "Authorization":auth.token
      }
    })
    const result = await response.json()
    alert(result.message)
    if(response.status===201) await getAllMenus()
    setFormData({ name: "", category: "", price: "", image: "" });
  };

  const handleDelete = async(id) => {
    const auth = JSON.parse(localStorage.getItem("Authorization"))
    if(!auth || !auth.token) return navigate("/")
    const response = await fetch("http://localhost:3010/deleteMenu/"+id,{
      method:"delete",
      headers:{
        "Content-Type":"application/json",
        "Authorization":auth.token
      }
    })
    const result = await response.json()
    alert(result.message)
    if(response.status===202){
      console.log(result.data);
      await getAllMenus()
    }
  };
  const handleEdit = async(id) => {
    
  }

  return (
    <div className="menu-container">
      {/* Upload Form */}
      <form className="menu-form" onSubmit={handleSubmit}>
        <h2 className="form-title">
           Add Menu Item
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">
          Add Item
        </button>
      </form>

      {/* Display Menu Items */}
      <div className="menu-list">
        {menuItems.length === 0 ? (
          <p className="empty-msg">No items added yet.</p>
        ) : (
          menuItems.map((item, index) => (
            <div className="menu-card" key={index}>
              {item.image && (
                <img src={"http://localhost:3010/"+item.image} alt={item.name} className="menu-img" />
              )}
              <h3>{item.name}</h3>
              <p><b>Category:</b> {item.category}</p>
              <p><b>Price:</b> ₹{item.price}</p>
              <div className="menu-actions">
                <button className="edit-btn" onClick={()=>handleEdit(item._id)}>
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Menu;
