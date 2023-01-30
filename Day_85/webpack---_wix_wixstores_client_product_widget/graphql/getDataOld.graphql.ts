export const query = `query getDataOld($externalId: String!, $compid: String!, $withPriceRange: Boolean = false) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    product(compId: $compid, onlyVisible: true) {
      id
      name
      urlPart
      price
      comparePrice
      formattedPrice
      formattedComparePrice
      pricePerUnit
      formattedPricePerUnit
      pricePerUnitData {
        baseQuantity
        baseMeasurementUnit
      }
      discount {
        mode
        value
      }
      priceRange(withSubscriptionPriceRange: true) @include(if: $withPriceRange) {
        fromPriceFormatted
      }
      hasOptions
      media {
        id
        url
        mediaType
        width
        height
        index
      }
      ribbon
      inventory {
        availableForPreOrder
      }
      isInStock
      productType
      digitalProductFileItems {
        fileType
      }
      productType
      subscriptionPlans {
        list {
           id
           visible
        }
      }
    }
  }
}`;
