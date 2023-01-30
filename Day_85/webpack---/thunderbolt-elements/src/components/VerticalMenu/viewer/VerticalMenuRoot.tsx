import * as React from 'react';
import type {
  LogicProps,
  VerticalMenuProps,
  VerticalMenuImperativeActions,
} from '../VerticalMenu.types';
import extendItemsWithSelectionProp from './utils/extendItemsWithSelectionProp';
import filterVisibleItems from './utils/filterVisibleItems';
import * as translations from './constants';
import VerticalMenuCommonSkin from './skinComps/VerticalMenuCommonSkin';

const VerticalMenuRoot: React.ForwardRefRenderFunction<
  VerticalMenuImperativeActions,
  VerticalMenuProps & LogicProps
> = (props, ref) => {
  const { translate, items = [], currentPageHref } = props;

  const visibleItems = React.useMemo(() => filterVisibleItems(items), [items]);
  const itemsWithSelectionProp = React.useMemo(
    () => extendItemsWithSelectionProp(currentPageHref, visibleItems),
    [currentPageHref, visibleItems],
  );

  const ariaLabel = translate!(
    translations.ARIA_LABEL_NAMESPACE,
    translations.ARIA_LABEL_KEY,
    translations.ARIA_LABEL_DEFAULT,
  );

  return (
    <VerticalMenuCommonSkin
      {...props}
      ref={ref}
      items={itemsWithSelectionProp}
      ariaLabel={ariaLabel}
    />
  );
};

export default React.forwardRef(VerticalMenuRoot);
