import * as React from 'react';
import {
  ITextAreaInputProps,
  ITextAreaInputImperativeActions,
} from '../TextAreaInput.types';
import { TextAreaInputSkinMap } from './skinMap';

const TextAreaInput: React.ForwardRefRenderFunction<
  ITextAreaInputImperativeActions,
  ITextAreaInputProps
> = (props, ref) => {
  const { skin } = props;

  const SkinComponent = TextAreaInputSkinMap[skin];

  return <SkinComponent ref={ref} {...props}></SkinComponent>;
};

export default React.forwardRef(TextAreaInput);
