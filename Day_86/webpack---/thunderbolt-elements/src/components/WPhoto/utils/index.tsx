import ZoomedImage from '../viewer/ZoomedImage';
import Image from '../../Image/viewer/Image';
import { IWPhotoProps } from '../WPhoto.types';

export const selectProperComponent = (selectedMode: string) =>
  selectedMode === 'zoomAndPanMode' ? ZoomedImage : Image;

export const getPropsForLink = ({
  onClickBehavior,
  className,
  link,
}: {
  onClickBehavior: string;
  className: string;
  link?: IWPhotoProps['link'];
}) => {
  const isPopUp = onClickBehavior === 'zoomMode';
  const isMagnification = onClickBehavior === 'zoomAndPanMode';
  const basicLinkProps = { className };

  return isPopUp || isMagnification
    ? basicLinkProps
    : { ...link, ...basicLinkProps };
};
