import axios from 'axios';

export const fetchAnime = async (page: number, genreId?: number) => {
  let url = `https://api.jikan.moe/v4/anime?page=${page}`;
  if (genreId) url += `&genres=${genreId}`;
  const response = await axios.get(url);
  return response.data.data;
};
