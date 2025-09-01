import React, { useEffect, useState } from "react";
import "./Home.css";
import {useNavigate} from "react-router-dom"
function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()
  const getAllUsers = async() => {
    const response = await fetch("http://localhost:3010/getAllUsers")
    const result = await response.json()
    if(response.status===202) setUsers(result.data)
    else {
      setUsers([])
      alert(result.message)
    }
  }
  useEffect(()=>{
    getAllUsers()
  },[])
  const handleClick = (id) => {
    navigate("/foodMenu/"+id)
  }

  return (
    <div className="users-container">
      <h2 className="page-title">Registered Users</h2>
      <div className="users-list">
        {users.length === 0 ? (
          <p className="empty-msg">No users registered yet.</p>
        ) : (
          users.map((user, index) => (
            <div onClick={()=>handleClick(user._id)} style={{cursor:"pointer"}} className="user-card" key={index}>
              <h3>{user.businessName}</h3>
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Phone:</b> {user.phone}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
