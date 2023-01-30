import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {GetDataQuery} from '../graphql/queries-schema';
import {Topology} from '@wix/wixstores-client-core/dist/es/src/constants';
import {query as newQuery} from '../graphql/getData.graphql';
import {query as oldQuery} from '../graphql/getDataOld.graphql';

export class ProductApi {
  constructor(private readonly siteStore: SiteStore) {}

  public async getData(
    externalId: string,
    compid: string,
    withPriceRange: boolean,
    useNewQueriesWithDiscountOnProductWidget: boolean
  ): Promise<{
    data: GetDataQuery;
  }> {
    const data: any = {
      query: useNewQueriesWithDiscountOnProductWidget ? newQuery : oldQuery,
      source: 'WixStoresWebClient',
      variables: {externalId, compid, withPriceRange},
      operationName: 'getProductWidgetData',
    };

    return this.siteStore.tryGetGqlAndFallbackToPost(
      this.siteStore.resolveAbsoluteUrl(`/${Topology.STOREFRONT_GRAPHQL_URL}`),
      data
    );
  }
}
