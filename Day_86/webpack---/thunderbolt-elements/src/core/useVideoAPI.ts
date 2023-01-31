import React from 'react';
import { MediaContainerVideoAPI } from '../components/MediaContainers/MediaContainer/MediaContainer.types';

export function useVideoAPI(
  compRef: any,
  hasVideo: boolean,
  onStop?: (video: HTMLVideoElement) => void,
) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const videoAPI = React.useRef<MediaContainerVideoAPI | null>(null);

  if (hasVideo) {
    if (!videoAPI.current) {
      videoAPI.current = {
        play: () => videoRef.current?.play(),
        load: () => videoRef.current?.load(),
        pause: () => videoRef.current?.pause(),
        stop: () => {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;

            if (onStop) {
              onStop(videoRef.current);
            }
          }
        },
      };
    }
  } else {
    // no video remove video API
    videoAPI.current = null;
  }

  React.useImperativeHandle(compRef, () => {
    return videoAPI.current || { load() {}, stop() {} };
  });

  return videoRef;
}
