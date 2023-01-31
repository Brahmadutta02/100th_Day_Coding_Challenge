export function extractQueryParameter(
  parameterName: string,
  source = location.search,
) {
  let queryParamData: string | undefined = source.split(`${parameterName}=`)[1];
  queryParamData = queryParamData
    ? decodeURIComponent(queryParamData.split('&')[0])
    : undefined;
  return queryParamData;
}
