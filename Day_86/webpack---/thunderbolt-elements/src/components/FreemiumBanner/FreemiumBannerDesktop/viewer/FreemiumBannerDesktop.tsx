import classNamesFn from 'classnames';
import * as React from 'react';
import { WixLogo } from '../../common/assets/logos';
import Link from '../../../Link/viewer/Link';
import { TestIds } from '../../common/constants';
import { FreemiumBannerDesktopProps } from '../FreemiumBannerDesktop.types';
import { getDataAttributes } from '../../../../core/commons/utils';
import defaultTranslations from './constants';
import style from './style/FreemiumBannerDesktop.scss';

const defaultDirection = 'ltr';

const FreemiumBannerDesktop: React.FC<FreemiumBannerDesktopProps> = props => {
  const {
    id = 'WIX_ADS',
    translate,
    useOverlay = false,
    direction,
    href = '',
    classNames = [defaultDirection],
    translations = defaultTranslations,
    className,
  } = props;

  const anchorClassNames = classNamesFn(
    ...classNames.map(name => style[name]),
    style.desktopTop,
    'has-custom-focus',
  );

  const translatedBannerText =
    translate!(
      translations.NAMESPACE,
      translations.MAIN_TEXT_KEY,
      translations.MAIN_TEXT_DEFAULT,
    ) || '';

  const isWixLogoInText =
    translatedBannerText.indexOf(translations.wixLogoPlaceHolder) >= 0;
  let textBeforeLogo = translatedBannerText;
  let textAfterLogo = '';
  if (isWixLogoInText) {
    const textParts = translatedBannerText.split(
      translations.wixLogoPlaceHolder,
    );
    textBeforeLogo = textParts[0];
    textAfterLogo = textParts[1];
  }
  const buttonText = translate!(
    translations.NAMESPACE,
    translations.BUTTON_TEXT_KEY,
    translations.BUTTON_TEXT_DEFAULT,
  );

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={classNamesFn(className, style.desktop, style.freemiumBanner)}
    >
      {useOverlay ? (
        <div data-testid={TestIds.overlay} className={anchorClassNames} />
      ) : (
        <Link
          className={anchorClassNames}
          href={href}
          target="_blank"
          rel="nofollow"
        >
          <span className={style.contents}>
            <span className={style.text}>
              {textBeforeLogo}
              {isWixLogoInText && (
                <div
                  data-testid={TestIds.logo}
                  style={{ direction: 'ltr', display: 'inline-flex' }}
                >
                  <div>
                    <WixLogo rootClass={style.wixLogo} dotClass={style.dot} />
                  </div>
                  <div className={style.com}>.com</div>
                </div>
              )}
              {textAfterLogo}
            </span>
            <span className={`${style.button} ${style[direction]}`}>
              {buttonText}
            </span>
          </span>
        </Link>
      )}
    </div>
  );
};

export default FreemiumBannerDesktop;
