import * as React from 'react';
import { ErrorSmall } from '@wix/wix-ui-icons-common/on-stage';
import { ErrorMessageType } from '@wix/editor-elements-types/components';
import { TranslationGetter } from '@wix/editor-elements-types/src/entries/thunderbolt';
import style from '../style/inlineErrorMessage.scss';

export interface InlineErrorMessageProps {
  errorMessage?: string;
  errorMessageType: ErrorMessageType;
  shouldShowValidityIndication: boolean;
  translate?: TranslationGetter;
  translations: {
    defualtErrorMessage: string;
  };
  componentViewMode?: string;
}

const errorMessageFallbackText = 'Error text displays here.';

export const InlineErrorMessage: React.FC<InlineErrorMessageProps> = ({
  errorMessage,
  errorMessageType,
  shouldShowValidityIndication,
  translate,
  translations: { defualtErrorMessage },
  componentViewMode,
}) => {
  const getOnStageErrorText = () => {
    return translate
      ? translate('wixui', defualtErrorMessage, errorMessageFallbackText)
      : errorMessageFallbackText;
  };

  const errorMessageText =
    componentViewMode === 'editor' ? getOnStageErrorText() : errorMessage;

  const hasInlineErrorMessage =
    errorMessageType === 'inline' &&
    shouldShowValidityIndication &&
    errorMessageText;

  return hasInlineErrorMessage ? (
    <div className={style.inlineErrorIndication}>
      <ErrorSmall className={style.iconErrorMessage} />
      <span className={style.txtErrMsg}>{errorMessageText}</span>
    </div>
  ) : null;
};
