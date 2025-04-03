import React, { useState } from 'react';

function Results({ games, isLoading }) {
  const [loadingImages, setLoadingImages] = useState({});

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Finding your common games...</p>
      </div>
    );
  }

  if (!games) {
    return null;
  }

  if (games.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8.5 14.5C8.5 14.5 9.5 16.5 12 16.5C14.5 16.5 15.5 14.5 15.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 10C9 10.5523 8.55228 11 8 11C7.44772 11 7 10.5523 7 10C7 9.44772 7.44772 9 8 9C8.55228 9 9 9.44772 9 10Z" fill="currentColor"/>
            <path d="M17 10C17 10.5523 16.5523 11 16 11C15.4477 11 15 10.5523 15 10C15 9.44772 15.4477 9 16 9C16.5523 9 17 9.44772 17 10Z" fill="currentColor"/>
          </svg>
        </div>
        <h2 className="empty-title">No Common Games Found</h2>
        <p className="empty-text">The selected Steam users don't have any games in common. Try selecting different users or check their privacy settings.</p>
      </div>
    );
  }

  const handleImageLoad = (gameId) => {
    setLoadingImages(prev => ({
      ...prev,
      [gameId]: false
    }));
  };

  const handleImageError = (gameId) => {
    setLoadingImages(prev => ({
      ...prev,
      [gameId]: false
    }));
  };

  return (
    <section className="results-section">
      <div className="container">
        <div className="results-header">
          <h2 className="results-title">Games You Have In Common</h2>
          <p className="results-subtitle">Found {games.length} game{games.length !== 1 ? 's' : ''} in common</p>
        </div>
        
        <div className="results-grid">
          {games.map(game => {
            const imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`;
            const hoursPlayed = Math.round(game.playtime_forever / 60);
            
            return (
              <a 
                href={`https://store.steampowered.com/app/${game.appid}`}
                className="game-card"
                key={game.appid}
                target="_blank" 
                rel="noopener noreferrer"
                title={`${game.name} - ${hoursPlayed} hours played`}
              >
                {hoursPlayed > 0 && (
                  <span className="game-playtime">
                    {hoursPlayed}h played
                  </span>
                )}
                
                {loadingImages[game.appid] !== false && (
                  <div className="game-loading">
                    <div className="loading-spinner" style={{ width: '32px', height: '32px' }}></div>
                  </div>
                )}
                
                <img
                  className="game-image"
                  src={imageUrl}
                  alt={game.name}
                  onLoad={() => handleImageLoad(game.appid)}
                  onError={() => handleImageError(game.appid)}
                  style={loadingImages[game.appid] === false ? {} : {opacity: 0}}
                  loading="lazy"
                />
                
                <div className="game-overlay">
                  <h3 className="game-title">{game.name}</h3>
                  <div className="game-meta">
                    <div className="game-stat">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6667 8H8.66667C8.29848 8 8 7.70152 8 7.33333V3.33333C8 2.59695 7.40305 2 6.66667 2C5.93029 2 5.33333 2.59695 5.33333 3.33333C5.33333 4.06971 5.93029 4.66667 6.66667 4.66667H7.33333M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>View on Steam</span>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Results;