import * as React from 'react';
import {
  ITextAreaInputProps,
  ITextAreaInputImperativeActions,
} from '../../../TextAreaInput.types';
import TextAreaInputBase from '../../TextAreaInputBase';

const ResponsiveTextAreaDefaultSkin: React.ForwardRefRenderFunction<
  ITextAreaInputImperativeActions,
  ITextAreaInputProps
> = (props, ref) => (
  <TextAreaInputBase
    isResponsive={true}
    ref={ref}
    {...props}
  ></TextAreaInputBase>
);

export default React.forwardRef(ResponsiveTextAreaDefaultSkin);
