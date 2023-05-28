import React, { useState, useEffect } from 'react';
import { getUserInfo } from '../../../services/Api';  // assuming api.js is in the same directory

function Search({ onSubmit }) {
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([]); 
  const [hoveredIndex, setHoveredIndex] = useState(null); // New state to keep track of hovered index
  const [notification, setNotification] = useState(null); // New state for displaying notifications

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAddName = async () => {
    console.log('Add Name:', name); // Add this line
    if (name.trim() !== '') {
      const userInfo = await getUserInfo(name);
      if (userInfo && userInfo.players && userInfo.players.length > 0) {
        const player = userInfo.players; 
        setPlayers([...players, player]);
        setName('');
        setNotification({ message: 'User found', color: 'green' });
      } else {
        setNotification({ message: 'User not found', color: 'red' });
      }
    }
  };

  const handleDeleteName = (index) => {
    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    setPlayers(updatedPlayers);
  };

  const handleSubmit = () => {
    onSubmit(players);
  };

  useEffect(() => {
    let timer;
    if (notification) {
      timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [notification]);

  const closeNotification = () => {
    setNotification(null);
  };

  const getStatusClassName = (personastate) => {
    switch (personastate) {
      case 0:
        return 'offline';
      case 1:
        return 'online';
      case 2:
        return 'busy';
      case 3:
        return 'away';
      case 4:
        return 'snooze';
      case 5:
        return 'trade';
      default:
        return '';
    }
  };

  return (
    <div className='searchContainer'>
      <div className="inputContainer">
        <input type="text" placeholder='steamId64(DEC) / customUrl Vanity Name' value={name} onChange={handleNameChange} />
        <button onClick={handleAddName}>Add</button>
      </div>
      <div className="namesContainer">
        {players.map((player, index) => (
          <div 
            className={`nameTag ${getStatusClassName(player[0].personastate)}`} 
            key={index} 
            style={index === hoveredIndex ? {backgroundColor: '#e74c3c'} : {}}
          >
            <img src={player[0].avatarfull}/>
            <p>{player[0].personaname}</p>
            <button 
              className='closeNameTag' 
              onTouchStart={() => handleDeleteName(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <button className='searchButton' onClick={handleSubmit}>Search</button>
      {notification && (
        <div className="notificationContainer" style={{ backgroundColor: notification.color }}>
        <div className="notificationBox">
            <p>{notification.message}</p>
            <button onTouchStart={closeNotification}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;