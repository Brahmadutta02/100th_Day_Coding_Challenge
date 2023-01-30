import React from 'react';
import { ITextAreaInputProps } from '../TextAreaInput.types';
import {
  TextAreaDefaultSkin,
  ResponsiveTextAreaDefaultSkin,
} from './skinComps';

export const TextAreaInputSkinMap: {
  [P in ITextAreaInputProps['skin']]: React.FC<ITextAreaInputProps>;
} = {
  TextAreaDefaultSkin,
  ResponsiveTextAreaDefaultSkin,
};
