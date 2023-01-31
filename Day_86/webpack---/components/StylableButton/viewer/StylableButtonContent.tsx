import { customCssClasses } from '@wix/editor-elements-common-utils';
import React, { ReactNode } from 'react';
import { TestIds } from '../constants';
import semanticClassNames from '../StylableButton.semanticClassNames';
import { classes, st } from './StylableButton.component.st.css';

const ButtonContent: React.FC<{
  icon?: ReactNode;
  label?: string;
  override?: boolean;
}> = props => {
  const { label, icon, override } = props;
  return (
    <div className={classes.container}>
      {label && (
        <span
          className={st(
            classes.label,
            customCssClasses(semanticClassNames.buttonLabel),
          )}
          data-testid={TestIds.buttonLabel}
        >
          {label}
        </span>
      )}
      {icon && (
        <span
          className={st(
            classes.icon,
            { override: !!override },
            customCssClasses(semanticClassNames.buttonIcon),
          )}
          aria-hidden="true"
          data-testid={TestIds.buttonIcon}
        >
          {icon}
        </span>
      )}
    </div>
  );
};
export default ButtonContent;
