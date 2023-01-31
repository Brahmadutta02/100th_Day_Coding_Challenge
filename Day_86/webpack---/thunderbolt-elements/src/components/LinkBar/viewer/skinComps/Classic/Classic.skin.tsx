import * as React from 'react';
import { LinkBarPropsNoStyle } from '../../../LinkBar.types';
import styles from '../../style/ClassicLinkBar.scss';
import LinkBar from '../../LinkBar';

const ClassicLinkBar: React.FC<LinkBarPropsNoStyle> = props => {
  return <LinkBar {...props} styles={styles} />;
};

export default ClassicLinkBar;
