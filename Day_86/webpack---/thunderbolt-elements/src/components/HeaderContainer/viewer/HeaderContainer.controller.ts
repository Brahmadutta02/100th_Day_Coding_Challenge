import type { CSSProperties } from 'react';
import { withCompController } from '@wix/editor-elements-integrations';
import type {
  IHeaderContainerPreviewMapperProps,
  IHeaderContainerControllerProps,
} from '../HeaderContainer.types';
import { useDidMount } from '../../../providers/useDidMount';

export default withCompController<
  IHeaderContainerPreviewMapperProps,
  IHeaderContainerControllerProps
>(({ mapperProps, controllerUtils }) => {
  const { updateStyles } = controllerUtils;
  const { compId, marginTop, isMobileView, isFixed, ...restMapperProps } =
    mapperProps;

  /**
   * There is a special HeaderContainer edgecase that needs to be handled.
   * On mobile if the HeaderContainer is over 1/2 body height,
   * it should not be rendered as fixed, even if the user chose
   * this scrolling behaviour (otherwise it would cover the screen and break scrolling.
   */

  useDidMount(() => {
    const headerHeight =
      window!.document.getElementById(compId)?.clientHeight || 0;

    const isTooHighToBeFixedOnMobile =
      headerHeight >= window!.document.body.clientHeight / 2;

    if (isMobileView && isFixed && isTooHighToBeFixedOnMobile) {
      updateStyles({
        position: 'relative !important' as CSSProperties['position'],
        marginTop,
        top: 0,
      });
    }
  });

  return restMapperProps;
});
