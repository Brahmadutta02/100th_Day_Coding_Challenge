import ColumnComponent from '@wix/thunderbolt-elements/src/components/Column/viewer/Column';
import FooterContainer_DefaultScreenComponent from '@wix/thunderbolt-elements/src/components/FooterContainer/viewer/skinComps/DefaultScreen/DefaultScreen.skin';
import GroupComponent from '@wix/thunderbolt-elements/src/components/Group/viewer/Group';
import HeaderContainer_DefaultScreenComponent from '@wix/thunderbolt-elements/src/components/HeaderContainer/viewer/skinComps/DefaultScreen/DefaultScreen.skin';
import HeaderContainer_DefaultScreenController from '@wix/thunderbolt-elements/src/components/HeaderContainer/viewer/HeaderContainer.controller';
import MediaContainerComponent from '@wix/thunderbolt-elements/src/components/MediaContainers/MediaContainer/viewer/MediaContainer';
import PageBackgroundComponent from '@wix/thunderbolt-elements/src/components/PageBackground/viewer/PageBackground';
import SiteButton_BasicButtonComponent from '@wix/thunderbolt-elements/src/components/SiteButton/viewer/skinComps/BaseButton/BasicButton.skin';
import SiteButton_TextOnlyButtonSkinComponent from '@wix/thunderbolt-elements/src/components/SiteButton/viewer/skinComps/BaseButton/TextOnlyButtonSkin.skin';
import StripColumnsContainerComponent from '@wix/thunderbolt-elements/src/components/StripColumnsContainer/viewer/StripColumnsContainer';
import WPhoto_NoSkinPhotoComponent from '@wix/thunderbolt-elements/src/components/WPhoto/viewer/skinComps/BasicWPhoto/NoSkinPhoto.skin';
import WPhoto_NoSkinPhotoController from '@wix/thunderbolt-elements/src/components/WPhoto/viewer/WPhoto.controller';
import ContainerWrapperComponent from '@wix/thunderbolt-elements/src/thunderbolt-core-components/ContainerWrapper/viewer/ContainerWrapper';
import Page_BasicPageSkinComponent from '@wix/thunderbolt-elements/src/thunderbolt-core-components/Page/viewer/skinComps/BasePage/BasicPageSkin.skin';
import Page_TransparentPageSkinComponent from '@wix/thunderbolt-elements/src/thunderbolt-core-components/Page/viewer/skinComps/BasePage/TransparentPageSkin.skin';


const Column = {
  component: ColumnComponent
};

const FooterContainer_DefaultScreen = {
  component: FooterContainer_DefaultScreenComponent
};

const Group = {
  component: GroupComponent
};

const HeaderContainer_DefaultScreen = {
  component: HeaderContainer_DefaultScreenComponent,
  controller: HeaderContainer_DefaultScreenController
};

const MediaContainer = {
  component: MediaContainerComponent
};

const PageBackground = {
  component: PageBackgroundComponent
};

const SiteButton_BasicButton = {
  component: SiteButton_BasicButtonComponent
};

const SiteButton_TextOnlyButtonSkin = {
  component: SiteButton_TextOnlyButtonSkinComponent
};

const StripColumnsContainer = {
  component: StripColumnsContainerComponent
};

const WPhoto_NoSkinPhoto = {
  component: WPhoto_NoSkinPhotoComponent,
  controller: WPhoto_NoSkinPhotoController
};

const ContainerWrapper = {
  component: ContainerWrapperComponent
};

const Page_BasicPageSkin = {
  component: Page_BasicPageSkinComponent
};

const Page_TransparentPageSkin = {
  component: Page_TransparentPageSkinComponent
};


export const components = {
  ['Column']: Column,
  ['FooterContainer_DefaultScreen']: FooterContainer_DefaultScreen,
  ['Group']: Group,
  ['HeaderContainer_DefaultScreen']: HeaderContainer_DefaultScreen,
  ['MediaContainer']: MediaContainer,
  ['PageBackground']: PageBackground,
  ['SiteButton_BasicButton']: SiteButton_BasicButton,
  ['SiteButton_TextOnlyButtonSkin']: SiteButton_TextOnlyButtonSkin,
  ['StripColumnsContainer']: StripColumnsContainer,
  ['WPhoto_NoSkinPhoto']: WPhoto_NoSkinPhoto,
  ['ContainerWrapper']: ContainerWrapper,
  ['Page_BasicPageSkin']: Page_BasicPageSkin,
  ['Page_TransparentPageSkin']: Page_TransparentPageSkin
};

