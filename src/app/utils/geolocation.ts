export function getAddressFromGeocoderResult(
  geocodingResult: google.maps.GeocoderResult,
) {
  const addressParts = [];

  for (const component of geocodingResult.address_components) {
    if (
      component.types.includes('route') ||
      component.types.includes('sublocality') ||
      component.types.includes('administrative_area_level_1')
    ) {
      addressParts.push(component.long_name);
    }
  }

  // Return the last two elements of the addressParts array as a comma-separated string
  return `${addressParts.slice(-2).join(', ')}`;
}
