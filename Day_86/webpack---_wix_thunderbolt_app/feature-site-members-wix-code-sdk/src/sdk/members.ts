import type { IHttpClient } from '@wix/fe-essentials-viewer-platform/http-client'
import { SessionServiceAPI } from '@wix/thunderbolt-symbols'
import { Fieldset } from '../types'
import { Set, Member } from './memberTypes'
import { toVeloMember } from './memberMapper'

export class MembersSdk {
	constructor(
		private readonly sessionService: SessionServiceAPI,
		private readonly httpClient: IHttpClient,
		private readonly isPreviewMode: boolean
	) {}

	public async getMyMember(sets: Array<Fieldset> = ['FULL']) {
		if (!this.isPreviewMode && !this.sessionService.getSmToken()) {
			return undefined
		}
		const fieldsets = sets?.map((fieldset) => (fieldset === 'FULL' ? Set.FULL : Set.PUBLIC))
		const options = {
			params: { fieldsets },
			headers: this.getHeaders(),
		}
		const { data } = await this.httpClient.get<{ member: Member }>('/_api/members/v1/members/my', options)
		return toVeloMember(data.member)
	}

	public async joinCommunity() {
		if (!this.isPreviewMode && !this.sessionService.getSmToken()) {
			return undefined
		}
		const options = {
			headers: this.getHeaders(),
		}
		const { data } = await this.httpClient.post<{ member: Member }>(
			'/_api/members/v1/members/join-community',
			{},
			options
		)
		return toVeloMember(data.member)
	}

	public async leaveCommunity() {
		if (!this.isPreviewMode && !this.sessionService.getSmToken()) {
			return undefined
		}
		const options = {
			headers: this.getHeaders(),
		}
		const { data } = await this.httpClient.post<{ member: Member }>(
			'/_api/members/v1/members/leave-community',
			{},
			options
		)
		return toVeloMember(data.member)
	}

	private getHeaders() {
		const headers = {
			'x-wix-client-artifact-id': 'thunderbolt',
			authorization: this.sessionService.getWixCodeInstance(),
		}
		return headers
	}
}
