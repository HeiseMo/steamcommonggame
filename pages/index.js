import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../src/app/components/Header';
import Footer from '../src/app/components/Footer';
import Search from '../src/app/components/Search';
import Results from '../src/app/components/Results';
import { getCommonGames } from '../services/Api';
import '../src/app/globals.css';
import '../src/app/main.css';

export default function Home() {
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (players) => {
    setLoading(true);
    setError('');
    try {
      // Extract Steam IDs from player objects
      const steamIds = players.map(player => player[0].steamid);
      const commonGames = await getCommonGames(steamIds);
      setGames(commonGames);
    } catch (error) {
      console.error('Error finding common games:', error);
      setError('Failed to find common games. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Steam Common Games Finder</title>
        <meta name="description" content="Find games that you and your Steam friends have in common" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="app-wrapper">
        <Header />
        
        <main className="main">
          <Search onSubmit={handleSearch} />
          
          {error && (
            <div className="container">
              <div className="error-message">
                <span className="error-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.5 7C10.5 6.17157 11.1716 5.5 12 5.5C12.8284 5.5 13.5 6.17157 13.5 7C13.5 7.82843 12.8284 8.5 12 8.5C11.1716 8.5 10.5 7.82843 10.5 7ZM11 10C11 9.44772 11.4477 9 12 9C12.5523 9 13 9.44772 13 10V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V10Z" fill="currentColor" />
                  </svg>
                </span>
                <span className="error-text">{error}</span>
              </div>
            </div>
          )}
          
          <Results games={games} isLoading={loading} />
        </main>
        
        <Footer />
      </div>
    </>
  );
}