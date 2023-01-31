import type { GetMemberDetails } from '@wix/thunderbolt-symbols';
import { SocialDataType } from '../schemas/Social.schema';

export type IValidationControllerProps<TValue = string> = {
  onValueChange(value: TValue): void;
  setValidityIndication(shouldShowValidityIndication: boolean): void;
};

export const getValidationControllerProps = <TValue = string>(
  updateProps: (partialProps: Record<string, any>) => void,
): IValidationControllerProps<TValue> => {
  return {
    onValueChange: value => {
      updateProps({ value });
    },
    setValidityIndication: shouldShowValidityIndication => {
      updateProps({ shouldShowValidityIndication });
    },
  };
};

type SocialUrlProps = {
  urlFormat: SocialDataType['urlFormat'];
  isMasterPage: boolean;
  pageId: string;
  relativeUrl: string;
  externalBaseUrl: string;
  isHttpsEnabled: boolean;
  currentUrl: string;
};

export const getSocialUrl = ({
  urlFormat,
  isMasterPage,
  pageId,
  relativeUrl,
  externalBaseUrl,
  isHttpsEnabled,
  currentUrl,
}: SocialUrlProps) => {
  if (urlFormat === 'hashBang') {
    const [, pageUriSeo, ...additionalUrlParts] = relativeUrl.split('/');
    const additionalUrl = additionalUrlParts.length
      ? `/${additionalUrlParts.join('/')}`
      : '';

    // Replace domain to the old wix.com domain
    const oldBaseUrls = externalBaseUrl.replace('wixsite.com', 'wix.com');
    const url = new URL(`${oldBaseUrls}`);
    url.protocol = isHttpsEnabled ? 'https:' : 'http:';

    if ((!isMasterPage && pageUriSeo) || !pageId) {
      url.hash = `!${pageUriSeo}/${pageId}${additionalUrl}`;
    }
    return url.toString();
  }
  const url = new URL(currentUrl);

  url.protocol = isHttpsEnabled ? 'https:' : 'http:';
  url.search = '';
  url.hash = '';

  return url.toString().replace(/\/$/, '');
};

export const resolveMemberDetails = async (
  getMemberDetails: GetMemberDetails,
) => {
  const membersData = {
    isLoggedIn: false,
    userName: '',
    avatarUri: '',
  };

  try {
    const memberDetails = await getMemberDetails();
    if (memberDetails) {
      return {
        isLoggedIn: true,
        userName:
          memberDetails.nickname ||
          memberDetails.memberName ||
          memberDetails.loginEmail,
        avatarUri: memberDetails.imageUrl,
      };
    }
    return membersData;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('failed to fetch member details', e);
  }
  return membersData;
};
