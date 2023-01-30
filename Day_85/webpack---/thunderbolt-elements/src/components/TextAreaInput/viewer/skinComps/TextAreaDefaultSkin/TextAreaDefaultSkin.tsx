import * as React from 'react';
import {
  ITextAreaInputProps,
  ITextAreaInputImperativeActions,
} from '../../../TextAreaInput.types';
import TextAreaInputBase from '../../TextAreaInputBase';

const TextAreaDefaultSkin: React.ForwardRefRenderFunction<
  ITextAreaInputImperativeActions,
  ITextAreaInputProps
> = (props, ref) => (
  <TextAreaInputBase
    isResponsive={false}
    ref={ref}
    {...props}
  ></TextAreaInputBase>
);

export default React.forwardRef(TextAreaDefaultSkin);
