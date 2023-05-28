import React, { useState } from 'react';
import Search from '../src/app/components/Search';
import Results from '../src/app/components/Results';
import { findCommonGames } from '../services/Api';
import '../src/app/main.css';

function Home() {
  const [games, setGames] = useState(null);

  const handleSearch = async (players) => {
    console.log('Players:', players); // Add this line to log the value of `players`
    const commonGames = await findCommonGames(players);
    console.log('Common Games:', commonGames); // Add this line to log the result
    setGames(commonGames);
  };

  return (
    <div className="App">
      <p>Steam Common Game Finder</p>
      <Search onSubmit={handleSearch} />
      <Results games={games} />
    </div>
  );
}

export default Home;