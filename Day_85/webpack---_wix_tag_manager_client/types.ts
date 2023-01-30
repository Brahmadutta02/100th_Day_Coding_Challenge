export type Category =
  | 'essential'
  | 'functional'
  | 'analytics'
  | 'advertising'
  | 'dataToThirdParty';

export interface Tag {
  // The id of the tag - doesn't always exist
  id?: string;
  // The name of the tag - always exists
  name?: string;
  // The data to be injected to the template
  config?: Object;
  // The category this tag belongs to
  category?: Category;
  // A source url for the script tag
  sourceUrl: string;
}

export enum Position {
  HEAD = 'head',
  BODY_START = 'bodyStart',
  BODY_END = 'bodyEnd',
}

export interface SiteTag {
  // The id of the tag from the service
  id?: string | null;
  // The human readable name of the tag
  name?: string | null;
  // App version data if it exists
  app?: { id: string; version: string };
  // The HTML content ready for embedding in the site
  content?: string | null;
  // The configuration which was merged with the HTML content in the server
  config?: { [key: string]: any } | null;
  // Where this tag should be located
  position?: Position | null;
  // Indicator if tag should be re-evaluated on page navigation
  loadOnce?: boolean | null;
  // Expected domain to run this tag
  domain?: string | null;
  // The Consent Category of this tag
  category?: Category;
  // A list of page ids this tag should be embedded in, empty for embedding on all pages
  pages?: string[] | null;
}

export interface SiteTagsResponse {
  // The tags we will add to the DOM
  tags: SiteTag[];
  // The configuration output from the tag manager
  config?: any;
  // Any errors we encountered in the service
  errors?: any;
}

export interface HostTagsResponse {
  // The tags we will add to the DOM
  tags: Tag[];
  // The configuration output from the tag manager
  config?: any;
  // Any errors we encountered in the service
  errors?: any;
}

export interface SiteEmbededTag {
  // The SiteTag definition of this embed
  tag: SiteTag;
  // DOM nodes reference to nodes we've added to the document
  embeddedNodes: any;
}

export interface getSiteTagParams {
  // The base URL of the site
  baseUrl: string;
  // The metaSite we are currently on
  metasiteId: string;
  // The HTML site we are currently on
  htmlsiteId: string;
  // The two letter language code for the site we are currently on
  language: string;
  // If this is a wix.com / editorx.com site
  wixSite?: boolean;
  // will only bring the tags in these categories.
  categories?: Category[];
}

export interface NodeToRender {
  nodeType?: number;
  attributes?: NamedNodeMap | any;
  content: string;
  tag: string;
  children?: NodeToRender[];
}

export interface PageInfo {
  id?: string;
  type?: string;
}

export interface SiteEmbedsHandlerOptions {
  initConsentPolicyManager: boolean;
  currentPageID: string | undefined;
}
