import type {
  DefaultCompPlatformProps,
  DefaultContainerProps,
} from '@wix/editor-elements-types/thunderbolt';
import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { getDataAttributes } from '../../../core/commons/utils';
import { TestIds } from '../constants';

export type MeshContainerProps = DefaultCompPlatformProps &
  DefaultContainerProps & {
    wedges?: Array<string>;
    rotatedComponents?: Array<string>;
    fixedComponents?: Array<string>;
    extraClassName?: string;
    renderRotatedComponents?: (child: ReactElement) => ReactElement;
  };

const REPEATER_DELIMITER = '__';

const getTemplateId = (comp: ReactElement) =>
  comp.props.id.split(REPEATER_DELIMITER)[0];

const renderRotatedComponentsWrapper = (child: ReactElement): ReactElement => (
  <div
    key={`${child.props.id}-rotated-wrapper`}
    data-mesh-id={`${child.props.id}-rotated-wrapper`}
  >
    {child}
  </div>
);

type RenderChildrenProps = {
  wedges: Array<string>;
  rotatedComponents: Array<string>;
  childrenArray: Array<React.ReactNode>;
  renderRotatedComponents: (child: ReactElement) => ReactElement;
};

const renderChildren = (props: RenderChildrenProps) => {
  const { wedges, rotatedComponents, childrenArray, renderRotatedComponents } =
    props;
  const rotatedComponentsSet: Record<string, boolean> =
    rotatedComponents.reduce(
      (acc, rotatedComponent) => ({ ...acc, [rotatedComponent]: true }),
      {},
    );

  const renderedRotatedComponents = childrenArray.map(child =>
    rotatedComponentsSet[getTemplateId(child as React.ReactElement)]
      ? renderRotatedComponents(child as React.ReactElement)
      : child,
  );
  const renderedWedges = wedges.map(wedge => (
    <div key={wedge} data-mesh-id={wedge} />
  ));

  return [...renderedRotatedComponents, ...renderedWedges];
};

const MeshContainer: React.ComponentType<MeshContainerProps> = props => {
  const {
    id,
    className,
    wedges = [],
    rotatedComponents = [],
    children,
    fixedComponents = [],
    extraClassName = '',
    renderRotatedComponents = renderRotatedComponentsWrapper,
  } = props;
  const childrenArray = React.Children.toArray(children());

  const fixedChildren: Array<React.ReactNode> = [];
  const nonFixedChildren: Array<React.ReactNode> = [];

  childrenArray.forEach(comp =>
    fixedComponents.includes((comp as React.ReactElement).props.id)
      ? fixedChildren.push(comp)
      : nonFixedChildren.push(comp),
  );

  const meshChildren = renderChildren({
    childrenArray: nonFixedChildren,
    rotatedComponents,
    wedges,
    renderRotatedComponents,
  });

  return (
    <div
      {...getDataAttributes(props)}
      data-mesh-id={`${id}inlineContent`}
      data-testid={TestIds.inlineContent}
      className={classNames(className, extraClassName)}
    >
      <div
        data-mesh-id={`${id}inlineContent-gridContainer`}
        data-testid={TestIds.content}
      >
        {meshChildren}
      </div>
      {fixedChildren}
    </div>
  );
};

export default MeshContainer;
