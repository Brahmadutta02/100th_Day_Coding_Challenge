import * as React from 'react';

import classNames from 'classnames';
import type { TranslationGetter } from '@wix/editor-elements-types/thunderbolt';
import { ISkipToContentButtonProps } from '../SkipToContentButton.types';
import { getDataAttributes } from '../../../core/commons/utils';
import style from './style/SkipToContentButton.st.scss';
import {
  A11Y_BUTTON_LABEL_TRANS_FEATURE,
  A11Y_BUTTON_LABEL_TRANS_KEY,
  A11Y_BUTTON_LABEL_TRANS_DEFAULT_VAL,
} from './constants';

const getButtonLabel = (translate: TranslationGetter | undefined) => {
  return translate
    ? translate(
        A11Y_BUTTON_LABEL_TRANS_FEATURE,
        A11Y_BUTTON_LABEL_TRANS_KEY,
        A11Y_BUTTON_LABEL_TRANS_DEFAULT_VAL,
      )
    : A11Y_BUTTON_LABEL_TRANS_DEFAULT_VAL;
};

const SkipToContentButton: React.FC<ISkipToContentButtonProps> = props => {
  const { id, className, translate } = props;
  const [isHeaderContainFocusableElements, setHeaderContainFocusableElements] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const header = document.querySelector('header');

    if (!header) {
      setHeaderContainFocusableElements(false);
    } else {
      setHeaderContainFocusableElements(
        Array.from(
          header.querySelectorAll(
            'a[href], button, input, textarea, select, summary, details, iframe, object, embed, [contenteditable], [tabindex]:not([tabindex="-1"])',
          ),
        ).some(
          element =>
            !(
              element.hasAttribute('disabled') ||
              element.getAttribute('aria-hidden') === 'true' ||
              element.getAttribute('aria-disabled') === 'true'
            ),
        ),
      );
    }
  }, []);

  const scrollToMain = () => {
    const mainEl =
      (document.querySelector('[data-main-content]') as HTMLElement) ||
      (document.querySelector(
        '[data-main-content-parent]>section:first-of-type',
      ) as HTMLElement);
    mainEl?.focus();
  };

  const buttonLabel = getButtonLabel(translate);

  if (!isHeaderContainFocusableElements) {
    return null;
  }

  return (
    <button
      id={id}
      {...getDataAttributes(props)}
      key={id}
      className={classNames(
        className,
        style.skipToContentButton,
        'has-custom-focus',
      )}
      tabIndex={0}
      onClick={scrollToMain}
    >
      {buttonLabel}
    </button>
  );
};

export default SkipToContentButton;
