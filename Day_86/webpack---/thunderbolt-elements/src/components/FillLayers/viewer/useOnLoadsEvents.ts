import React, { useEffect } from 'react';
import { FillLayersProps } from '../FillLayers.types';

type LoadableProps = Pick<FillLayersProps, 'image'>;
type UseOnLoadProps = LoadableProps & Pick<FillLayersProps, 'onReady'>;

export const useOnLoadsEvents = ({ onReady, image }: UseOnLoadProps) => {
  useEffect(() => {
    if (onReady && !image) {
      onReady();
    }
  }, [onReady, image]);
  return {
    onImageLoad: (e: React.SyntheticEvent) => {
      if (image?.onLoad) {
        image.onLoad(e);
      }

      if (onReady) {
        onReady();
      }
    },
  };
};
