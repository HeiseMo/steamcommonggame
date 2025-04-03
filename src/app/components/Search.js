import React, { useState } from 'react';
import { getUserInfo } from '../../../services/Api';

function Search({ onSubmit }) {
  const [name, setName] = useState('');
  const [players, setPlayers] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError('');
  };

  const handleAddName = async () => {
    if (!name.trim()) {
      setError('Please enter a valid Steam ID or username');
      return;
    }

    setLoading(true);
    try {
      const playerInfo = await getUserInfo(name);
      
      if (!playerInfo || !playerInfo.players || playerInfo.players.length === 0) {
        setError('Could not find Steam user. Please check the ID/username and try again.');
        setLoading(false);
        return;
      }
      
      // Check if player is already added
      const isDuplicate = players.some(player => player[0].steamid === playerInfo.players[0].steamid);
      if (isDuplicate) {
        setError('This player has already been added.');
        setLoading(false);
        return;
      }

      setPlayers([...players, playerInfo.players]);
      setName('');
    } catch (error) {
      console.error('Error adding player:', error);
      setError('Failed to add player. Please check the ID/username and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddName();
    }
  };

  const handleDeleteName = (index) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleSubmit = () => {
    if (players.length === 0) {
      setError('Please add at least one player before searching');
      return;
    }
    onSubmit(players);
  };

  const getStatusClassName = (personastate) => {
    switch (personastate) {
      case 0: return 'status-offline';
      case 1: return 'status-online';
      case 2: return 'status-busy';
      case 3: return 'status-away';
      case 4: return 'status-snooze';
      case 5: return 'status-trade';
      default: return 'status-offline';
    }
  };

  const getStatusText = (personastate) => {
    switch (personastate) {
      case 0: return 'Offline';
      case 1: return 'Online';
      case 2: return 'Busy';
      case 3: return 'Away';
      case 4: return 'Snooze';
      case 5: return 'Looking to Trade';
      default: return 'Offline';
    }
  };

  return (
    <div className="search-section">
      <section className="hero">
        {/* Add decorative background elements */}
        <div className="hero-bg-circle-1"></div>
        <div className="hero-bg-circle-2"></div>
        
        <h1 className="hero-title">Find Common Games</h1>
        <p className="hero-subtitle">
          Discover which Steam games you and your friends own in common
        </p>
      </section>

      <div className="search-wrapper">
        <div className="search-input-container">
          <input 
            className="search-input"
            type="text" 
            placeholder="Enter Steam ID or Username" 
            value={name} 
            onChange={handleNameChange}
            onKeyDown={handleKeyDown} 
            disabled={loading}
            aria-label="Enter a Steam ID or username"
          />
          <button 
            className={`btn-add ${loading ? 'loading' : ''}`}
            onClick={handleAddName} 
            disabled={loading || !name.trim()}
          >
            {loading && <span className="btn-spinner"></span>}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="visually-hidden">Add Player</span>
          </button>
        </div>
          
        {error && (
          <div className="error-message">
            <span className="error-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM8.70711 7.29289C8.31658 6.90237 7.68342 6.90237 7.29289 7.29289C6.90237 7.68342 6.90237 8.31658 7.29289 8.70711L8.58579 10L7.29289 11.2929C6.90237 11.6834 6.90237 12.3166 7.29289 12.7071C7.68342 13.0976 8.31658 13.0976 8.70711 12.7071L10 11.4142L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L11.4142 10L12.7071 8.70711C13.0976 8.31658 13.0976 7.68342 12.7071 7.29289C12.3166 6.90237 11.6834 6.90237 11.2929 7.29289L10 8.58579L8.70711 7.29289Z" fill="currentColor" />
              </svg>
            </span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {players.length > 0 ? (
          <div className="selected-players-section">
            <h2 className="section-title">Selected Players</h2>
            <div className="player-tags">
              {players.map((player, index) => (
                <div 
                  className={`player-tag ${getStatusClassName(player[0].personastate)}`} 
                  key={index} 
                >
                  <img 
                    className="player-avatar"
                    src={player[0].avatarfull} 
                    alt={player[0].personaname} 
                    loading="lazy"
                  />
                  <div className="player-info">
                    <div className="player-name">{player[0].personaname}</div>
                    <div className="player-status">{getStatusText(player[0].personastate)}</div>
                  </div>
                  <button 
                    className="player-tag-remove" 
                    onClick={() => handleDeleteName(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    aria-label={`Remove ${player[0].personaname}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              className="search-button"
              onClick={handleSubmit}
              disabled={players.length === 0}
            >
              <span className="search-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Find Common Games
            </button>
          </div>
        ) : (
          <div className="empty-players-prompt">
            <p>Add Steam users to find games you have in common</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;