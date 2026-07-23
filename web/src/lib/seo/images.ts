const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

export const brandImages = {
  logoMark: "/brand/logo-mark.svg",
  hero: u("photo-1555041469-a586c61ea9bc"),
  livingRoom: u("photo-1616486338812-3dadae4b4ace"),
  foam: u("photo-1618221118493-9cfa1a1c00da"),
  curtains: u("photo-1513694203232-719a280e022f"),
  majlis: u("photo-1600210492486-724fe5c67fb0"),
  cushions: u("photo-1584100936595-c0654b55a2e2"),
  accessories: u("photo-1586023492125-27b2c045efd7"),
  showroom: u("photo-1615873968403-89e068629265"),
  customSofa: u("photo-1493663284031-b7e3aefcae8e"),
};
