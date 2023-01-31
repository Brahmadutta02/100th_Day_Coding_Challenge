import * as React from 'react';
import classNames from 'classnames';
import { ZoomedImageProps } from '../ZoomedImage.types';
import Image from '../../Image/viewer/Image';
import styles from './style/zoomedImage.scss';

const CANCEL_ZOOM_TIMEOUT = 1200;
let tick: boolean = false,
  moveX: number,
  moveY: number,
  zoomTimer: ReturnType<typeof setTimeout>;

const ZoomedImage: React.FC<ZoomedImageProps> = props => {
  const {
    width: imageWidth,
    height: imageHeight,
    className: skinStyle,
  } = props;

  const [isZoomed, setIsZoomed] = React.useState(false);
  const [positionOnZoomedImage, setPosition] = React.useState({ x: 0, y: 0 });
  const useRef = React.useRef<HTMLDivElement>(null);

  const toggleZoom = (ev: React.MouseEvent) => {
    const event = ev.nativeEvent;

    if (isZoomed) {
      setIsZoomed(false);
    } else if (!isZoomed && event && event.type === 'click') {
      setIsZoomed(true);

      const { offsetX, offsetY } = getCoordinatesOnTarget(
        event.clientX,
        event.clientY,
      );
      const { x, y } = getCoordinatesOnFullImage(offsetX, offsetY);
      setPosition({ x, y });
    }
  };

  const waitBeforeZoomOut = (ev: React.MouseEvent) => {
    zoomTimer = setTimeout(() => toggleZoom(ev), CANCEL_ZOOM_TIMEOUT);
  };

  const clearZoomTimer = () => {
    clearTimeout(zoomTimer);
  };

  const getCoordinatesOnFullImage = (x: number, y: number) => {
    const CONTAINER_WIDTH = useRef.current!.offsetWidth;
    const CONTAINER_HEIGHT = useRef.current!.offsetHeight;

    const percentageOffsetX = x / CONTAINER_WIDTH;
    const percentageOffsetY = y / CONTAINER_HEIGHT;

    return {
      x: percentageOffsetX * (imageWidth - CONTAINER_WIDTH),
      y: percentageOffsetY * (imageHeight - CONTAINER_HEIGHT),
    };
  };

  const getCoordinatesOnTarget = (clientX: number, clientY: number) => {
    const measurements = useRef.current!.getBoundingClientRect();

    return {
      offsetX: clientX - measurements.left,
      offsetY: clientY - measurements.top,
    };
  };

  const requestTick = (ev: React.MouseEvent) => {
    const event = ev.nativeEvent;

    const { offsetX, offsetY } = getCoordinatesOnTarget(
      event.clientX,
      event.clientY,
    );
    ({ x: moveX, y: moveY } = getCoordinatesOnFullImage(offsetX, offsetY));

    if (!tick) {
      requestAnimationFrame(drag);
    }
    tick = true;
  };

  const drag = () => {
    setPosition({ x: moveX, y: moveY });
    tick = false;
  };

  const zoomedInEventsHandlers = {
    onMouseLeave: waitBeforeZoomOut,
    onMouseEnter: clearZoomTimer,
    onMouseMove: requestTick,
  };

  const imageInlineStyles = isZoomed
    ? {
        transform: `translate(-${positionOnZoomedImage.x}px, -${positionOnZoomedImage.y}px)`,
        transitionTimingFunction: 'ease-out',
        transitionDuration: '0.2s',
        willChange: 'transform',
      }
    : {};

  const handlers = isZoomed
    ? { onClick: toggleZoom, ...zoomedInEventsHandlers }
    : { onClick: toggleZoom };

  const zoomedOverrides = isZoomed
    ? {
        containerWidth: props.width,
        containerHeight: props.height,
        skipMeasure: true,
      }
    : {
        skipMeasure: false,
      };

  return (
    <div
      {...handlers}
      className={classNames(
        styles.container,
        `${isZoomed ? styles.zoomOut : styles.zoomIn}`,
      )}
      ref={useRef}
    >
      <Image
        {...props}
        className={skinStyle}
        imageStyles={imageInlineStyles}
        {...zoomedOverrides}
      />
    </div>
  );
};

export default ZoomedImage;
