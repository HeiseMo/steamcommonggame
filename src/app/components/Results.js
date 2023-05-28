import React, { useState } from 'react';

function Results({ games }) {
  const [imageLoading, setImageLoading] = useState(true);

  if (!games || games.length === 0) {
    return <div>No common games found.</div>;
  }

  return (
    <div className='resultsContainer'>
      <div className='gameBox'>
        {games.map(game => (
          <a target='_blank' className='gameLink' href={`https://store.steampowered.com/app/${game.appid}`} key={game.appid}>
            <div className='gameInfo'>
            {game.imageError ? (
              <div className='brokenImageText'>{game.name}</div>
            ) : (
              <img
                src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
                alt={game.name}
                onLoad={() => setImageLoading(false)}
                onError={() => game.imageError = false}
              />
            )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Results;