export interface Member {
	/** Member ID. */
	id?: string
	/** Email used by the member to log in to the site. */
	loginEmail?: string
	/**
	 * Member site access status.
	 * <!--ONLY:REST-->
	 * - `PENDING`: Member created and is waiting for approval by site owner.
	 * - `APPROVED`: Member can log in to the site.
	 * - `OFFLINE`: Member is a [guest author](https://support.wix.com/en/article/wix-blog-adding-guest-authors-to-your-blog) for the site blog and cannot log in to the site.
	 * - `BLOCKED`: Member is blocked and cannot log in to the site.
	 * - `UNKNOWN`: Insufficient permissions to get the status.
	 * <!--END:ONLY:REST-->
	 *
	 * <!--ONLY:VELO
	 * One of:
	 *
	 * - `"PENDING"`: Member created and is waiting for approval by site owner.
	 * - `"APPROVED"`: Member can log in to the site.
	 * - `"OFFLINE"`: Member is a [guest author](https://support.wix.com/en/article/wix-blog-adding-guest-authors-to-your-blog) for the site blog and cannot log in to the site.
	 * - `"BLOCKED"`: Member is blocked and cannot log in to the site.
	 * - `"UNKNOWN"`: Insufficient permissions to get the status.
	 * <!--END:ONLY:VELO-->
	 */
	status?: Status
	/** Contact ID. */
	contactId?: string
	/**
	 * Member's contact information. Contact information is stored in the
	 * [Contact List](https://www.wix.com/my-account/site-selector/?buttonText=Select%20Site&title=Select%20a%20Site&autoSelectOnSingleSite=true&actionUrl=https:%2F%2Fwww.wix.com%2Fdashboard%2F%7B%7BmetaSiteId%7D%7D%2Fcontacts).
	 *
	 * <!--ONLY:REST-->
	 * The full set of contact data can be accessed and managed with the
	 * [Contacts API](https://dev.wix.com/api/rest/contacts/contacts).
	 * <!--END:ONLY:REST-->
	 */
	contact?: Contact
	/** Profile display info. */
	profile?: Profile
	/**
	 * Member privacy status.
	 *
	 * <!--ONLY:REST-->
	 * - `PUBLIC`: Member is visible to everyone.
	 * - `PRIVATE`: Member is hidden from site visitors and other site members. Member is returned only to site contributors and apps with the appropriate permissions.
	 * - `UNKNOWN`: Insufficient permissions to get the status.
	 * <!--END:ONLY:REST-->
	 *
	 * <!--ONLY:VELO
	 * One of:
	 *
	 * - `"PUBLIC"`: Member is visible to everyone.
	 * - `"PRIVATE"`: Member is hidden from site visitors and other site members. Member is returned only to site contributors and apps with the appropriate permissions.
	 * - `"UNKNOWN"`: Insufficient permissions to get the status.
	 * <!--END:ONLY:VELO-->
	 */
	privacyStatus?: PrivacyStatusStatus
	/**
	 * Member activity status.
	 *
	 * <!--ONLY:REST-->
	 * - `ACTIVE`: Member can write forum posts and blog comments.
	 * - `MUTED`: Member cannot write forum posts or blog comments.
	 * - `UNKNOWN`: Insufficient permissions to get the status.
	 * <!--END:ONLY:REST-->
	 *
	 * <!--ONLY:VELO
	 * One of:
	 *
	 * - `"ACTIVE"`: Member can write forum posts and blog comments.
	 * - `"MUTED"`: Member cannot write forum posts or blog comments.
	 * - `"UNKNOWN"`: Insufficient permissions to get the status.
	 * <!--END:ONLY:VELO-->
	 */
	activityStatus?: ActivityStatusStatus
	/** Date and time when the member was created. */
	createdDate?: Date
	/** Date and time when the member was updated. */
	updatedDate?: Date
	/** Date and time when the member last logged in to the site. */
	lastLoginDate?: Date
}
export enum Status {
	UNKNOWN = 'UNKNOWN',
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	BLOCKED = 'BLOCKED',
	OFFLINE = 'OFFLINE',
}
/** Contact info associated with the member. */
export interface Contact {
	/**
	 * Contact ID.
	 *
	 * > **Deprecation notice:**
	 * > This property has been replaced with `member.contactId`
	 * > and will be removed on June 11, 2021.
	 */
	contactId?: string
	/** Contact's first name. */
	firstName?: string
	/** Contact's last name. */
	lastName?: string
	/** List of phone numbers. */
	phones?: Array<string>
	/** List of email addresses. */
	emails?: Array<string>
	/** List of street addresses. */
	addresses?: Array<Address>
	/**
	 * Contact's birthdate, formatted as `"YYYY-MM-DD"`.
	 *
	 * Example: `"2020-03-15"` for March 15, 2020.
	 */
	birthdate?: string
	/** Contact's company name. */
	company?: string
	/** Contact's job title. */
	jobTitle?: string
	/**
	 * Custom fields,
	 * where each key is the field key,
	 * and each value is the field's value for the member.
	 */
	customFields?: Record<string, CustomField>
}
/** Street address. */
export interface Address {
	/** Street address ID. */
	id?: string
	/**
	 * Free text providing more detailed address information,
	 * such as apartment, suite, or floor.
	 */
	addressLine2?: string
	/** City name. */
	city?: string
	/**
	 * Code for a subdivision (such as state, prefecture, or province) in an
	 * [ISO 3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) format.
	 */
	subdivision?: string
	/**
	 * 2-letter country code in an
	 * [ISO-3166 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format.
	 */
	country?: string
	/** Postal code. */
	postalCode?: string
	/** Street address object, with number and name in separate fields. */
	streetAddress?: StreetAddress
	/** Main address line, usually street and number, as free text. */
	addressLine?: string
}
export interface StreetAddress {
	/** Street number. */
	number?: string
	/** Street name. */
	name?: string
}
export interface CustomField {
	/** Custom field name. */
	name?: string
	/** Custom field value. */
	value?: any
}
/** Member Profile */
export interface Profile {
	/**
	 * Name that identifies the member to other members.
	 * Displayed on the member's profile page
	 * and interactions in the forum or blog.
	 */
	nickname?: string
	/** Slug that determines the member's profile page URL. */
	slug?: string
	/** Member's profile photo. */
	photo?: Image
	/**
	 * Member's cover photo,
	 * used as a background picture in members profile page.
	 */
	cover?: Image
	/**
	 * Member title.
	 */
	title?: string
}
export interface Image {
	/**
	 * Wix Media image ID,
	 * set when the member selects an image from Wix Media.
	 */
	id?: string
	/** Image URL. */
	url?: string
	/** Original image width. */
	height?: number
	/** Original image height. */
	width?: number
	/**
	 * X-axis offset.
	 *
	 * Defaults to `0`.
	 */
	offsetX?: number
	/**
	 * Y-axis offset.
	 *
	 * Defaults to `0`.
	 */
	offsetY?: number
}
export enum PrivacyStatusStatus {
	UNKNOWN = 'UNKNOWN',
	PRIVATE = 'PRIVATE',
	PUBLIC = 'PUBLIC',
}
export enum ActivityStatusStatus {
	UNKNOWN = 'UNKNOWN',
	ACTIVE = 'ACTIVE',
	MUTED = 'MUTED',
}
export interface JoinCommunityRequest {}
/** Member profile. */
export interface JoinCommunityResponse {
	/** The updated member. */
	member?: Member
}
export interface LeaveCommunityRequest {}
/** Member profile. */
export interface LeaveCommunityResponse {
	/** The updated member. */
	member?: Member
}
export interface MemberLeftCommunity {}
export interface GetMyMemberRequest {
	fieldsets?: Array<Set>
}
export enum Set {
	/** Public properties of the entity */
	PUBLIC = 'PUBLIC',
	/** Extended properties of the entity */
	EXTENDED = 'EXTENDED',
	/** Full entity defined in the doc */
	FULL = 'FULL',
}
/** Member profile. */
export interface GetMyMemberResponse {
	/** The requested member. */
	member?: Member
}
