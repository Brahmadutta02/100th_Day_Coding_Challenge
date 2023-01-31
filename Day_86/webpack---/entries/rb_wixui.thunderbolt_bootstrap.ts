import StylableButtonComponent from '../components/StylableButton/viewer/StylableButton';
import AnchorComponent from '@wix/thunderbolt-elements/src/components/Anchor/viewer/Anchor';
import ContainerComponent from '@wix/thunderbolt-elements/src/components/Container/viewer/Container';
import FooterContainer_TransparentScreenComponent from '@wix/thunderbolt-elements/src/components/FooterContainer/viewer/skinComps/BaseScreen/TransparentScreen.skin';
import HeaderContainer_TransparentScreenComponent from '@wix/thunderbolt-elements/src/components/HeaderContainer/viewer/skinComps/BaseScreen/TransparentScreen.skin';
import HeaderContainer_TransparentScreenController from '@wix/thunderbolt-elements/src/components/HeaderContainer/viewer/HeaderContainer.controller';
import LinkBar_ClassicComponent from '@wix/thunderbolt-elements/src/components/LinkBar/viewer/skinComps/Classic/Classic.skin';
import BackgroundGroupComponent from '@wix/thunderbolt-elements/src/components/PageGroup/BackgroundGroup/viewer/BackgroundGroup';
import PageGroupComponent from '@wix/thunderbolt-elements/src/components/PageGroup/PageGroup/viewer/PageGroup';
import PagesContainerComponent from '@wix/thunderbolt-elements/src/components/PagesContainer/viewer/PagesContainer';
import VectorImageComponent from '@wix/thunderbolt-elements/src/components/VectorImage/viewer/VectorImage';
import WRichTextComponent from '@wix/thunderbolt-elements/src/components/WRichText/viewer/WRichText';
import MasterPageComponent from '@wix/thunderbolt-elements/src/thunderbolt-core-components/MasterPage/viewer/MasterPage';
import PinnedLayerComponent from '@wix/thunderbolt-elements/src/thunderbolt-core-components/PinnedLayer/viewer/PinnedLayer';


const StylableButton = {
  component: StylableButtonComponent
};

const Anchor = {
  component: AnchorComponent
};

const Container = {
  component: ContainerComponent
};

const FooterContainer_TransparentScreen = {
  component: FooterContainer_TransparentScreenComponent
};

const HeaderContainer_TransparentScreen = {
  component: HeaderContainer_TransparentScreenComponent,
  controller: HeaderContainer_TransparentScreenController
};

const LinkBar_Classic = {
  component: LinkBar_ClassicComponent
};

const BackgroundGroup = {
  component: BackgroundGroupComponent
};

const PageGroup = {
  component: PageGroupComponent
};

const PagesContainer = {
  component: PagesContainerComponent
};

const VectorImage = {
  component: VectorImageComponent
};

const WRichText = {
  component: WRichTextComponent
};

const MasterPage = {
  component: MasterPageComponent
};

const PinnedLayer = {
  component: PinnedLayerComponent
};


export const components = {
  ['StylableButton']: StylableButton,
  ['Anchor']: Anchor,
  ['Container']: Container,
  ['FooterContainer_TransparentScreen']: FooterContainer_TransparentScreen,
  ['HeaderContainer_TransparentScreen']: HeaderContainer_TransparentScreen,
  ['LinkBar_Classic']: LinkBar_Classic,
  ['BackgroundGroup']: BackgroundGroup,
  ['PageGroup']: PageGroup,
  ['PagesContainer']: PagesContainer,
  ['VectorImage']: VectorImage,
  ['WRichText']: WRichText,
  ['MasterPage']: MasterPage,
  ['PinnedLayer']: PinnedLayer
};

