import * as React from 'react';
import { getDataAttributes } from '../../../core/commons/utils';
import { AnchorProps } from '../Anchor.types';
import styles from './Anchor.scss';

const Anchor: React.FC<AnchorProps> = props => {
  const { id, name, urlFragment, className } = props;
  /**
   * .ignore-focus className has no docs and is part of the a11y focus ring feature. Implementation is made on TB:
     https://github.com/wix-private/thunderbolt/blob/master/packages/thunderbolt-becky/src/carmi/css.carmi.ts#L154

   * Adds to #siteContainer a css rule that adds box-shadow if child element is focused() and doesn't have the classes
     .has-custom-focus OR .ignore-focus
   */
  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={`${styles.root} ignore-focus ${className}`}
      tabIndex={-1}
      role="region"
      aria-label={name}
    >
      {urlFragment && <div id={urlFragment} />}
      <span className={styles.srOnly}>{name}</span>
    </div>
  );
};

export default Anchor;
