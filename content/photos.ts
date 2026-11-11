// Instagram photos, newest first.
// To add one: save it to public/images/life/, run `npm run clean-photos public/images/life`
// to strip its location data, then add a line at the top of this list.
export type Photo = { file: string; w: number; h: number; caption: string };

export const instagram = { handle: "ruhin_b", url: "https://www.instagram.com/ruhin_b/" };

export const photos: Photo[] = [
  { file: "01-two-cats-at-dusk.jpg", w: 945, h: 1400, caption: "Two cats at dusk" },
  { file: "02-latte-art.jpg", w: 1400, h: 1400, caption: "Latte art" },
  { file: "03-red-sky-car-park.jpg", w: 1083, h: 1400, caption: "Red sky over a car park" },
  {
    file: "04-golden-hour-cottage-street.jpg",
    w: 1120,
    h: 1400,
    caption: "Golden hour on a cottage street",
  },
  { file: "05-garden-path.jpg", w: 1050, h: 1400, caption: "A garden path in afternoon light" },
  { file: "06-red-panda.jpg", w: 1120, h: 1400, caption: "A red panda in the trees" },
  { file: "07-singer-stage-lights.jpg", w: 1120, h: 1400, caption: "A singer under stage lights" },
  { file: "08-evening-football.jpg", w: 1120, h: 1400, caption: "Evening football" },
  {
    file: "09-sandstone-winter-tree.jpg",
    w: 1120,
    h: 1400,
    caption: "Sandstone and a winter tree",
  },
  { file: "10-plane-at-sunset.jpg", w: 1120, h: 1400, caption: "A plane at sunset" },
  { file: "11-moonrise-blue-hour.jpg", w: 1120, h: 1400, caption: "Moonrise at blue hour" },
  {
    file: "12-yellow-blossom-red-brick.jpg",
    w: 1050,
    h: 1400,
    caption: "Yellow blossom and red brick",
  },
  { file: "13-red-roof-glass-walls.jpg", w: 1120, h: 1400, caption: "Red roof, glass walls" },
  {
    file: "14-golden-cloud-tiny-plane.jpg",
    w: 1214,
    h: 1400,
    caption: "A golden cloud and a tiny plane",
  },
  { file: "15-sunset-on-the-jetty.jpg", w: 1050, h: 1400, caption: "Sunset on the jetty" },
];

export const photoSrc = (p: Photo) => `/images/life/${p.file}`;
