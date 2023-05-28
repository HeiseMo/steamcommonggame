import fetch from 'isomorphic-fetch';

// Get a user's Steam ID
export async function getSteamId(input) {
  if (Array.isArray(input) && input[0] && input[0].hasOwnProperty('steamid')) {
    return input[0].steamid;
  }

  const response = await fetch(`/api/steam?username=${input}&type=user`);
  const data = await response.json();
  console.log(data, "data")

  return data.steamData.players[0].steamid;
}

// Get all user information
export async function getUserInfo(steamId) {
  if (isNaN(steamId)) {
    const isNotaNum = await getSteamId(steamId);
    console.log(isNotaNum)
    const response = await fetch(`/api/steam?username=${isNotaNum}&type=user`);
    const data = await response.json();
    return data.steamData;
  }
  const response = await fetch(`/api/steam?username=${steamId}&type=user`);
  const data = await response.json();
  return data.steamData;
}

// Get the games a user owns
async function getOwnedGames(steamId) {
  const response = await fetch(`/api/steam?username=${steamId}&type=games`);
  const data = await response.json();
  return data.steamData.games;
}

// Find games two users both own
export async function findCommonGames(usernames) {
  const usernamesArray = Array.isArray(usernames) ? usernames : usernames.split(',');

  const steamIds = await Promise.all(
    usernamesArray.map(userArray => getSteamId(userArray))
  );

  const ownedGames = await Promise.all(steamIds.map(steamId => getOwnedGames(steamId)));

  const commonGames = ownedGames.reduce((common, games) => {
    return common.map(game => {
      const game2 = games.find(g => g.appid === game.appid);
      return game2 ? { ...game, playtime_forever: game2.playtime_forever } : game;
    }).filter(game => games.some(game2 => game2.appid === game.appid));
  }, ownedGames[0]);

  commonGames.sort((a, b) => b.playtime_forever - a.playtime_forever);

  return commonGames;
}
