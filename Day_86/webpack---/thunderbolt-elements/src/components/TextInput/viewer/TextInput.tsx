import * as React from 'react';
import classNames from 'classnames';
import { customCssClasses } from '@wix/editor-elements-common-utils';
import {
  ITextInputImperativeActions,
  ITextInputProps,
} from '../TextInput.types';
import {
  getAriaAttributes,
  HAS_CUSTOM_FOCUS_CLASSNAME,
} from '../../../core/commons/a11y';
import { getDataAttributes } from '../../../core/commons/utils';
import { InlineErrorMessage } from '../../../core/commons/inlineErrorMessage';
import semanticClassNames from '../TextInput.semanticClassNames';
import style from './style/TextInput.scss';
import {
  formatPhoneNumber,
  getUnformattedNumber,
  hasNonNumericChar,
  translateHtmlValidationMessage,
} from './utils';

const noop = () => {};

const TextInput: React.ForwardRefRenderFunction<
  ITextInputImperativeActions,
  ITextInputProps
> = (props, ref) => {
  const {
    skin,
    name,
    id,
    className = '',
    customClassNames = [],
    dataTestId,
    value,
    inputType = 'text',
    label,
    placeholder,
    readOnly,
    required,
    isDisabled,
    pattern,
    autoComplete,
    autoComplete_,
    maxLength,
    min,
    max,
    step,
    numberSpinnerHidden,
    shouldShowValidityIndication,
    isValid,
    autoFocus,
    prefix,
    phoneFormat = '',
    errorMessageType = 'tooltip',
    validateValue = noop,
    setValidityIndication = noop,
    onBlur = noop,
    onFocus = noop,
    onKeyPress = noop,
    onInput = noop,
    onValueChange = noop,
    onChange = noop,
    onClick = noop,
    onDblClick = noop,
    onMouseEnter = noop,
    onMouseLeave = noop,
    ariaAttributes,
    contentRef,
    translate,
    componentViewMode,
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

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
        } else {
          inputRef.current?.setCustomValidity(
            translateHtmlValidationMessage(message, {
              translate: props.translate,
              phoneFormat: props.phoneFormat,
            }),
          );
        }
      },
      getValidationMessage: () => {
        return inputRef.current?.validationMessage;
      },
    };
  });

  const [valueChanged, setValueChanged] = React.useState<boolean>();

  const formattedValue = React.useMemo(() => {
    return inputType === 'tel' && phoneFormat
      ? formatPhoneNumber(value, phoneFormat)
      : value;
  }, [value, phoneFormat, inputType]);

  const getOnChangeFn =
    ({
      shouldSetValidityIndication,
      shouldCallOnInput,
    }: {
      shouldSetValidityIndication: boolean;
      shouldCallOnInput: boolean;
    }) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value: eventValue } = event.target;
      let unformattedNumber = eventValue;

      if (phoneFormat) {
        const didDeleteChars = eventValue.length < formattedValue.length;

        unformattedNumber = getUnformattedNumber(
          eventValue,
          phoneFormat,
          didDeleteChars,
        );

        if (hasNonNumericChar(unformattedNumber)) {
          return;
        }
      }

      setValueChanged(true);
      onValueChange(unformattedNumber);
      validateValue();

      if (shouldSetValidityIndication) {
        setValidityIndication(false);
      }
      if (shouldCallOnInput) {
        onInput(event);
      }
    };

  const ssrInputValue = React.useRef({ value: '' });

  React.useEffect(() => {
    ssrInputValue.current.value = value;
  }, [value]);

  React.useEffect(() => {
    ssrInputValue.current.value = inputRef.current?.value || '';

    // Using setTimeout to bypass TB-4995
    setTimeout(() => {
      const onChangeFn = getOnChangeFn({
        shouldSetValidityIndication: false,
        shouldCallOnInput: false,
      });
      onChangeFn({
        target: { value: ssrInputValue.current.value },
      } as React.ChangeEvent<HTMLInputElement>);
    }, 0);
    // We want to run this useEffect only once after SSR has done loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onBlur: React.FocusEventHandler<HTMLInputElement> = event => {
    onBlur(event);
    if (valueChanged) {
      onChange({
        ...event,
        type: 'change',
      });
    }
    setValueChanged(false);
    setValidityIndication(true);
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

  const containerClasses = classNames(
    style[skin],
    className,
    customCssClasses(semanticClassNames.root, ...customClassNames),
    {
      [style.hasLabel]: !!label,
      [style.requiredIndication]: required,
      [style.validationIndication]: !!shouldShowValidityIndication,
    },
  );

  const getMaxLength = () => {
    let updatedMaxLength = maxLength === null ? undefined : maxLength;

    if (phoneFormat) {
      updatedMaxLength = phoneFormat.length;
    }

    return updatedMaxLength;
  };

  const getMinLength = () => (phoneFormat ? phoneFormat.length : undefined);

  const { 'aria-label': ariaLabel, ...restAriaAttributes } =
    getAriaAttributes(ariaAttributes);

  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      ref={contentRef}
      className={containerClasses}
      data-testid={dataTestId}
      onClick={_onClick}
      onDoubleClick={_onDblClick}
      onMouseEnter={_onMouseEnter}
      onMouseLeave={_onMouseLeave}
    >
      {!!label && (
        <label
          htmlFor={`input_${id}`}
          className={classNames(
            style.label,
            customCssClasses(semanticClassNames.inputLabel),
          )}
        >
          {label}
        </label>
      )}
      <div className={style.inputWrapper}>
        {prefix && <div className={style.prefix}>{prefix}</div>}
        <input
          name={name}
          ref={inputRef}
          id={`input_${id}`}
          className={classNames(
            style.input,
            HAS_CUSTOM_FOCUS_CLASSNAME,
            customCssClasses(semanticClassNames.inputEl),
            {
              [style.hideNumberSpinner]: numberSpinnerHidden,
            },
          )}
          type={inputType}
          value={formattedValue}
          onFocus={onFocus}
          onKeyDown={onKeyPress}
          onChange={getOnChangeFn({
            shouldSetValidityIndication: true,
            shouldCallOnInput: true,
          })}
          onBlur={_onBlur}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          aria-required={required}
          aria-invalid={shouldShowValidityIndication ? isValid : undefined}
          pattern={pattern}
          maxLength={getMaxLength()}
          minLength={getMinLength()}
          disabled={isDisabled}
          autoComplete={
            autoComplete ? 'on' : autoComplete_ ? autoComplete_ : undefined
          }
          step={step === null ? undefined : step}
          min={min === null ? undefined : min}
          max={max === null ? undefined : max}
          autoFocus={autoFocus}
          aria-label={ariaLabel || label ? ariaLabel : placeholder}
          {...restAriaAttributes}
        />
      </div>
      <InlineErrorMessage
        errorMessageType={errorMessageType}
        errorMessage={inputRef.current?.validationMessage}
        shouldShowValidityIndication={shouldShowValidityIndication}
        translate={translate}
        translations={{
          defualtErrorMessage: 'Text_Input_On_Stage_Error_Text_Label',
        }}
        componentViewMode={componentViewMode}
      />
    </div>
  );
};

export default React.forwardRef(TextInput);
