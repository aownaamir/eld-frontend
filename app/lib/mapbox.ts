export const searchPlaces = async (query: string) => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&autocomplete=true&limit=5`,
  );

  const data = await res.json();

  return data.features || [];
};
