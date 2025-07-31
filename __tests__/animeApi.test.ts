import axios from 'axios';
import { fetchAnime } from '../src/utils/animeApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchAnime', () => {
  it('calls the correct endpoint and returns data', async () => {
    const fakeData = { data: { data: [{ mal_id: 123, title: 'Test' }] } };
    mockedAxios.get.mockResolvedValueOnce(fakeData);

    const result = await fetchAnime(1, 10);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.jikan.moe/v4/anime?page=1&genres=10',
    );
    expect(result).toEqual(fakeData.data.data); // <---- Fix here!
  });

  it('works without genreId', async () => {
    const fakeData = { data: { data: [{ mal_id: 456, title: 'NoGenre' }] } };
    mockedAxios.get.mockResolvedValueOnce(fakeData);

    const result = await fetchAnime(2);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.jikan.moe/v4/anime?page=2',
    );
    expect(result).toEqual(fakeData.data.data); // <---- Fix here!
  });
});
