export type BoardEntry = {
  name: string;
  initials: string;
  points: number;
  streak: number;
};

/**
 * Sample week shipped with the site. These are not live accounts.
 * Points are arranged so a fresh on-device score of 1,240 ranks 38th
 * and sits about three logged actions under 30th place (1,320).
 */
export const communityBoard: BoardEntry[] = [
  { name: "Mira S.", initials: "MS", points: 2480, streak: 18 },
  { name: "Aarav K.", initials: "AK", points: 2320, streak: 14 },
  { name: "Naina R.", initials: "NR", points: 2185, streak: 12 },
  { name: "Dev P.", initials: "DP", points: 1960, streak: 11 },
  { name: "Leela M.", initials: "LM", points: 1880, streak: 9 },
  { name: "Kabir J.", initials: "KJ", points: 1840, streak: 8 },
  { name: "Sara Q.", initials: "SQ", points: 1800, streak: 15 },
  { name: "Ishaan V.", initials: "IV", points: 1760, streak: 6 },
  { name: "Priya N.", initials: "PN", points: 1720, streak: 10 },
  { name: "Omar F.", initials: "OF", points: 1680, streak: 7 },
  { name: "Hana T.", initials: "HT", points: 1640, streak: 13 },
  { name: "Rafi D.", initials: "RD", points: 1600, streak: 5 },
  { name: "Meher B.", initials: "MB", points: 1560, streak: 9 },
  { name: "Jonah L.", initials: "JL", points: 1520, streak: 4 },
  { name: "Anika C.", initials: "AC", points: 1480, streak: 11 },
  { name: "Farhan A.", initials: "FA", points: 1460, streak: 6 },
  { name: "Sonia G.", initials: "SG", points: 1440, streak: 8 },
  { name: "Vikram E.", initials: "VE", points: 1420, streak: 3 },
  { name: "Laila H.", initials: "LH", points: 1400, streak: 7 },
  { name: "Neil W.", initials: "NW", points: 1390, streak: 5 },
  { name: "Tara I.", initials: "TI", points: 1380, streak: 12 },
  { name: "Yusuf O.", initials: "YO", points: 1375, streak: 4 },
  { name: "Kiara P.", initials: "KP", points: 1370, streak: 6 },
  { name: "Arun Z.", initials: "AZ", points: 1365, streak: 9 },
  { name: "Noor C.", initials: "NC", points: 1360, streak: 2 },
  { name: "Rohan B.", initials: "RB", points: 1355, streak: 8 },
  { name: "Elena S.", initials: "ES", points: 1350, streak: 5 },
  { name: "Imran K.", initials: "IK", points: 1340, streak: 7 },
  { name: "Diya L.", initials: "DL", points: 1330, streak: 3 },
  { name: "Samir J.", initials: "SJ", points: 1320, streak: 6 },
  { name: "Aisha R.", initials: "AR", points: 1310, streak: 4 },
  { name: "Hugo M.", initials: "HM", points: 1300, streak: 5 },
  { name: "Fatima N.", initials: "FN", points: 1290, streak: 8 },
  { name: "Kiran D.", initials: "KD", points: 1280, streak: 2 },
  { name: "Leah P.", initials: "LP", points: 1270, streak: 6 },
  { name: "Aditya V.", initials: "AV", points: 1260, streak: 3 },
  { name: "Maya G.", initials: "MG", points: 1255, streak: 4 },
  { name: "Joseph T.", initials: "JT", points: 1180, streak: 2 },
  { name: "Zara H.", initials: "ZH", points: 1120, streak: 5 },
  { name: "Nikhil S.", initials: "NS", points: 1080, streak: 1 },
  { name: "Amira K.", initials: "AK", points: 1040, streak: 3 },
  { name: "Chris P.", initials: "CP", points: 1000, streak: 2 },
  { name: "Sana Q.", initials: "SQ", points: 960, streak: 4 },
  { name: "Harsh V.", initials: "HV", points: 920, streak: 1 },
  { name: "Olive R.", initials: "OR", points: 880, streak: 2 },
];

export const SAMPLE_CHALLENGE_JOINED = 1284;
export const SAMPLE_PLEDGE_COUNT = 12480;
