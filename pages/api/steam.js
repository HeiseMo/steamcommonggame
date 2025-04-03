import axios from 'axios';

export default async function handler(req, res) {
  const { username, type } = req.query;
  // Use the API key passed from the client or fallback to the environment variable
  const API_KEY = req.query.key || process.env.NEXT_PUBLIC_STEAM_API_KEY;

  if (!API_KEY) {
    return res.status(400).json({ error: 'Steam API key is required' });
  }

  try {
    let steamResponse;
    if (type === 'user') {
      if (!isNaN(username)) {
        steamResponse = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${username}`);
      } else {
        const vanityUrlResponse = await axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${username}`);
        
        if (!vanityUrlResponse.data.response || !vanityUrlResponse.data.response.steamid) {
          return res.status(404).json({ error: 'Steam user not found' });
        }
        
        const resolvedSteamId = vanityUrlResponse.data.response.steamid;
        steamResponse = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${resolvedSteamId}`);
      }
    } else if (type === 'games') {
      if (!isNaN(username)) {
        steamResponse = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${username}&include_appinfo=1&format=json`);
      } else {
        const vanityUrlResponse = await axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${username}`);
        
        if (!vanityUrlResponse.data.response || !vanityUrlResponse.data.response.steamid) {
          return res.status(404).json({ error: 'Steam user not found' });
        }
        
        const resolvedSteamId = vanityUrlResponse.data.response.steamid;
        steamResponse = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${resolvedSteamId}&include_appinfo=1&format=json`);
      }
    } else {
      return res.status(400).json({ error: 'Invalid API type' });
    }

    const steamData = steamResponse.data.response;
    
    if (!steamData || (type === 'user' && (!steamData.players || steamData.players.length === 0))) {
      return res.status(404).json({ error: 'Steam user not found or profile is private' });
    }

    res.json({ steamData });
  } catch (error) {
    console.error('Steam API Error:', error.message);
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ 
        error: 'API key error. Make sure your Steam API key is valid and properly configured.' 
      });
    }
    res.status(500).json({ 
      error: 'An error occurred while fetching data from the Steam API',
      message: error.message 
    });
  }
}