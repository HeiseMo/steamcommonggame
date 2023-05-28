import axios from 'axios';

export default async function handler(req, res) {
  const { username, type } = req.query;
  const API_KEY = process.env.REACT_APP_STEAM_API_KEY;

  try {
    let steamResponse;
    if (type === 'user') {
      if (!isNaN(username)) {
        console.log("is not a number")
        steamResponse = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${username}`);
      } else {
        const vanityUrlResponse = await axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${username}`);
        const resolvedSteamId = vanityUrlResponse.data.response.steamid;
        steamResponse = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${resolvedSteamId}`);
      }
    } else if (type === 'games') {
      if (!isNaN(username)) {
        steamResponse = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${username}&include_appinfo=1&format=json`);
      } else {
        const vanityUrlResponse = await axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${API_KEY}&vanityurl=${username}`);
        const resolvedSteamId = vanityUrlResponse.data.response.steamid;
        steamResponse = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${resolvedSteamId}&include_appinfo=1&format=json`);
      }
    } else {
      throw new Error('Invalid API type');
    }

    const steamData = steamResponse.data.response;
    res.json({ steamData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data from the Steam API' });
  }
}