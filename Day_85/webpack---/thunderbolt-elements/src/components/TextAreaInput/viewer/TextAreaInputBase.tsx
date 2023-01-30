import * as React from 'react';
import classNames from 'classnames';
import {
  ITextAreaInputBaseProps,
  ITextAreaInputImperativeActions,
} from '../TextAreaInput.types';
import {
  getAriaAttributes,
  HAS_CUSTOM_FOCUS_CLASSNAME,
} from '../../../core/commons/a11y';
import { getDataAttributes } from '../../../core/commons/utils';
import { InlineErrorMessage } from '../../../core/commons/inlineErrorMessage';
import style from './style/TextAreaInput.scss';

const noop = () => {};

const TextAreaInputBase: React.ForwardRefRenderFunction<
  ITextAreaInputImperativeActions,
  ITextAreaInputBaseProps
> = (props, ref) => {
  const {
    skin,
    id,
    className,
    value = '',
    label,
    placeholder,
    readOnly,
    required,
    isDisabled,
    maxLength,
    isResponsive,
    shouldShowValidityIndication,
    isValid,
    errorMessageType = 'tooltip',
    validateValue = noop,
    onValueChange = noop,
    setValidityIndication = noop,
    onBlur = noop,
    onFocus = noop,
    onKeyPress = noop,
    onInput = noop,
    onChange = noop,
    onClick = noop,
    onDblClick = noop,
    onMouseEnter = noop,
    onMouseLeave = noop,
    ariaAttributes,
    componentViewMode,
  } = props;

  const [valueChanged, setValueChanged] = React.useState<boolean>();

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(ref, () => {
    return {
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      setCustomValidity: message => {
        if (message.type === 'message') {
          inputRef.current?.setCustomValidity(message.message);
        }
      },
    };
  });

  const _onChange: React.ChangeEventHandler<HTMLTextAreaElement> = event => {
    onValueChange(event.currentTarget.value);
    validateValue();
    setValueChanged(true);
    setValidityIndication(false);
    event.type = 'input';
    onInput(event);
  };

  const _onBlur: React.FocusEventHandler<HTMLTextAreaElement> = event => {
    setValidityIndication(true);
    onBlur(event);
    if (valueChanged) {
      onChange({
        ...event,
        type: 'change',
      });
    }
    setValueChanged(false);
  };

  const _onClick: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onClick(event);
    }
  };

  const _onDblClick: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onDblClick(event);
    }
  };

  const _onMouseEnter: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onMouseEnter(event);
    }
  };

  const _onMouseLeave: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onMouseLeave(event);
    }
  };

  const hasLabel = !!label;

  const containerClasses = classNames(className, style[skin], {
    [style.hasLabel]: hasLabel,
    [style.requiredIndication]: required,
    [style.validationIndication]: !!shouldShowValidityIndication,
  });

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      className={containerClasses}
      onClick={_onClick}
      onDoubleClick={_onDblClick}
      onMouseEnter={_onMouseEnter}
      onMouseLeave={_onMouseLeave}
    >
      <label htmlFor={`textarea_${id}`} className={style.label}>
        {label}
      </label>
      <textarea
        ref={inputRef}
        id={`textarea_${id}`}
        className={classNames(style.textarea, HAS_CUSTOM_FOCUS_CLASSNAME)}
        rows={isResponsive ? 1 : undefined}
        value={value}
        onFocus={onFocus}
        onKeyDown={onKeyPress}
        onChange={_onChange}
        onBlur={_onBlur}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        aria-required={required}
        aria-invalid={shouldShowValidityIndication ? isValid : undefined}
        maxLength={maxLength === null ? undefined : maxLength}
        disabled={isDisabled}
        {...getAriaAttributes(ariaAttributes)}
      ></textarea>
      <InlineErrorMessage
        errorMessageType={errorMessageType}
        errorMessage={inputRef.current?.validationMessage}
        shouldShowValidityIndication={shouldShowValidityIndication}
        translate={props.translate}
        translations={{
          defualtErrorMessage: 'Text_Area_On_Stage_Error_Text_Label',
        }}
        componentViewMode={componentViewMode}
      />
    </div>
  );
};

export default React.forwardRef(TextAreaInputBase);
