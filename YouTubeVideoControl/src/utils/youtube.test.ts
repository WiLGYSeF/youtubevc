import { YouTubePlayer360 } from 'objects/YtpcEntry/Ytpc360Entry';
import { getVideoIdByUrl, playerHas360Video } from './youtube';

describe('youtube', () => {
  it.each([
    ['https://www.youtube.com/watch?v=_BSSJi-sHh8', '_BSSJi-sHh8'],
    ['https://www.youtube.com/watch?v=_BSSJi-sHh8&t=14', '_BSSJi-sHh8'],
    ['https://www.youtubeabc.com/watch?v=_BSSJi-sHh8', '_BSSJi-sHh8'],
    ['https://www.youtube.com/watch?v=', ''],
    ['https://www.youtube.com/watch', null],
    ['abcdef', null],
  ])(
    'gets the video id from url',
    (url: string, expected: string | null) => {
      expect(getVideoIdByUrl(url)).toEqual(expected);
    },
  );

  it('checks if player has 360 video', () => {
    let ytPlayer = {
      getSphericalProperties: jest.fn(() => ({})),
    } as unknown as YouTubePlayer360;

    expect(playerHas360Video(ytPlayer)).toBeFalsy();

    ytPlayer = {
      getSphericalProperties: jest.fn(() => ({
        yaw: 0,
        pitch: 0,
        roll: 0,
        fov: 100,
      })),
    } as unknown as YouTubePlayer360;

    expect(playerHas360Video(ytPlayer)).toBeTruthy();
  });
});
