export interface AdventDay {
  day: number;
  date: string; // e.g. "Dec 1"
  title: string;
  theme: string;
  scripture: string;
  scriptureText: string;
  activity: string;
  prayer: string;
  candleWeek: 1 | 2 | 3 | 4;
  candleColor: "purple" | "rose" | "white";
}

export const ADVENT_DAYS: AdventDay[] = [
  {
    day: 1,
    date: "Dec 1",
    candleWeek: 1,
    candleColor: "purple",
    theme: "Hope",
    title: "The Promise of Hope",
    scripture: "Isaiah 9:2",
    scriptureText: "The people who walked in darkness have seen a great light.",
    activity:
      "Light the first Advent candle. Share one hope you have for Christmas.",
    prayer:
      "Lord of Hope, come quickly. Prepare our hearts for Your arrival. Amen.",
  },
  {
    day: 2,
    date: "Dec 2",
    candleWeek: 1,
    candleColor: "purple",
    theme: "Hope",
    title: "Waiting in the Dark",
    scripture: "Romans 8:24-25",
    scriptureText: "In hope we were saved. Now hope that is seen is not hope.",
    activity:
      "Sit in darkness for 5 minutes before lighting a candle. Reflect on waiting.",
    prayer: "Lord, teach me to wait on You with patient trust. Amen.",
  },
  {
    day: 3,
    date: "Dec 3",
    candleWeek: 1,
    candleColor: "purple",
    theme: "Hope",
    title: "St. Francis Xavier",
    scripture: "Mark 16:15",
    scriptureText:
      "Go into all the world and proclaim the Gospel to every creature.",
    activity: "Pray for missionaries around the world today.",
    prayer: "Lord, raise up holy missionaries in our time. Amen.",
  },
  {
    day: 4,
    date: "Dec 4",
    candleWeek: 1,
    candleColor: "purple",
    theme: "Hope",
    title: "Prepare the Way",
    scripture: "Isaiah 40:3",
    scriptureText:
      "A voice cries out: prepare the way of the Lord in the desert.",
    activity: "Clean one space in your home as a physical act of preparation.",
    prayer: "Lord, help me clear the clutter from my heart. Amen.",
  },
  {
    day: 5,
    date: "Dec 5",
    candleWeek: 1,
    candleColor: "purple",
    theme: "Hope",
    title: "The Root of Jesse",
    scripture: "Isaiah 11:1",
    scriptureText: "A shoot shall come forth from the stump of Jesse.",
    activity:
      "Learn about your family tree. Give thanks for the faith passed to you.",
    prayer:
      "Lord, You redeem what is broken and dry. Make new life in me. Amen.",
  },
  {
    day: 6,
    date: "Dec 6",
    candleWeek: 1,
    candleColor: "purple",
    theme: "Hope",
    title: "St. Nicholas",
    scripture: "Luke 12:33",
    scriptureText: "Sell your possessions and give alms.",
    activity: "Give a surprise anonymous gift to someone in need today.",
    prayer: "Lord, make me secretly generous like St. Nicholas. Amen.",
  },
  {
    day: 7,
    date: "Dec 7",
    candleWeek: 1,
    candleColor: "purple",
    theme: "Hope",
    title: "St. Ambrose",
    scripture: "Isaiah 35:4",
    scriptureText:
      "Say to those with fearful hearts: Be strong, do not fear; your God will come.",
    activity: "Write down your fears and offer them to God in prayer.",
    prayer: "Lord, cast out all fear from my heart. Come, Lord Jesus. Amen.",
  },
  {
    day: 8,
    date: "Dec 8",
    candleWeek: 2,
    candleColor: "purple",
    theme: "Peace",
    title: "Immaculate Conception",
    scripture: "Luke 1:28",
    scriptureText: "Hail, full of grace, the Lord is with you.",
    activity: "Pray the Rosary (Joyful Mysteries) today in honor of Our Lady.",
    prayer: "Immaculate Mary, prepare my heart to receive your Son. Amen.",
  },
  {
    day: 9,
    date: "Dec 9",
    candleWeek: 2,
    candleColor: "purple",
    theme: "Peace",
    title: "Peace That Surpasses All",
    scripture: "Philippians 4:7",
    scriptureText:
      "The peace of God, which surpasses all understanding, will guard your hearts.",
    activity: "Spend 10 minutes in silent Adoration or quiet prayer.",
    prayer: "Lord, give me the peace that only You can give. Amen.",
  },
  {
    day: 10,
    date: "Dec 10",
    candleWeek: 2,
    candleColor: "purple",
    theme: "Peace",
    title: "The Prince of Peace",
    scripture: "Isaiah 9:6",
    scriptureText:
      "He will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.",
    activity:
      "Reach out to someone you have a conflict with and seek reconciliation.",
    prayer: "Prince of Peace, mend what is broken in my relationships. Amen.",
  },
  {
    day: 11,
    date: "Dec 11",
    candleWeek: 2,
    candleColor: "purple",
    theme: "Peace",
    title: "Repentance",
    scripture: "Luke 3:8",
    scriptureText: "Produce fruit worthy of repentance.",
    activity:
      "Examine your conscience and plan to go to confession before Christmas.",
    prayer:
      "Lord, prepare me for confession. I want to meet You with a clean heart. Amen.",
  },
  {
    day: 12,
    date: "Dec 12",
    candleWeek: 2,
    candleColor: "purple",
    theme: "Peace",
    title: "Our Lady of Guadalupe",
    scripture: "Revelation 12:1",
    scriptureText:
      "A great sign appeared in heaven: a woman clothed with the sun.",
    activity:
      "Learn about the apparitions of Our Lady of Guadalupe to St. Juan Diego.",
    prayer:
      "Our Lady of Guadalupe, pray for the Americas and all peoples. Amen.",
  },
  {
    day: 13,
    date: "Dec 13",
    candleWeek: 2,
    candleColor: "purple",
    theme: "Peace",
    title: "St. Lucy",
    scripture: "John 8:12",
    scriptureText:
      "I am the light of the world. Whoever follows me will not walk in darkness.",
    activity: "Light candles at dinner tonight in honor of St. Lucy, martyr.",
    prayer:
      "Lord, You are our light in darkness. Shine in every corner of my life. Amen.",
  },
  {
    day: 14,
    date: "Dec 14",
    candleWeek: 2,
    candleColor: "purple",
    theme: "Peace",
    title: "St. John of the Cross",
    scripture: "Song of Songs 3:1",
    scriptureText: "I sought him whom my soul loves.",
    activity:
      "Read a short passage from St. John of the Cross's 'Dark Night of the Soul.'",
    prayer: "Lord, I seek You even in darkness. Do not abandon me. Amen.",
  },
  {
    day: 15,
    date: "Dec 15",
    candleWeek: 3,
    candleColor: "rose",
    theme: "Joy",
    title: "Gaudete Sunday",
    scripture: "Philippians 4:4",
    scriptureText: "Rejoice in the Lord always; again I say rejoice!",
    activity:
      "Light the rose candle! Do something joyful with your family today.",
    prayer: "Lord of Joy, fill our home with Your gladness this Advent. Amen.",
  },
  {
    day: 16,
    date: "Dec 16",
    candleWeek: 3,
    candleColor: "rose",
    theme: "Joy",
    title: "The Magnificat",
    scripture: "Luke 1:46-47",
    scriptureText:
      "My soul magnifies the Lord, and my spirit rejoices in God my Savior.",
    activity:
      "Pray the Magnificat aloud. Then write what you magnify God for today.",
    prayer: "Lord, may my whole life magnify You as Mary's did. Amen.",
  },
  {
    day: 17,
    date: "Dec 17",
    candleWeek: 3,
    candleColor: "rose",
    theme: "Joy",
    title: "O Antiphons Begin",
    scripture: "Isaiah 7:14",
    scriptureText:
      "The virgin shall conceive and bear a son, and shall call his name Emmanuel.",
    activity: "Sing or listen to 'O Come O Come Emmanuel' as a family.",
    prayer: "O come, O come Emmanuel, and ransom captive Israel. Amen.",
  },
  {
    day: 18,
    date: "Dec 18",
    candleWeek: 3,
    candleColor: "rose",
    theme: "Joy",
    title: "Joseph's Dream",
    scripture: "Matthew 1:20",
    scriptureText: "Do not be afraid to take Mary as your wife.",
    activity:
      "Pray for fathers and husbands. Write a note of appreciation to yours.",
    prayer: "Lord, give fathers the courage and faith of St. Joseph. Amen.",
  },
  {
    day: 19,
    date: "Dec 19",
    candleWeek: 3,
    candleColor: "rose",
    theme: "Joy",
    title: "Zechariah's Doubt",
    scripture: "Luke 1:13",
    scriptureText: "Do not be afraid, Zechariah; your prayer has been heard.",
    activity: "Write down a prayer you have been waiting for God to answer.",
    prayer: "Lord, my prayer has been heard. Help my unbelief. Amen.",
  },
  {
    day: 20,
    date: "Dec 20",
    candleWeek: 3,
    candleColor: "rose",
    theme: "Joy",
    title: "The Annunciation",
    scripture: "Luke 1:38",
    scriptureText:
      "Behold, I am the handmaid of the Lord; let it be done to me according to your word.",
    activity: "Pray the Angelus as a family at noon.",
    prayer:
      "Lord, give me Mary's surrender: let it be done to me according to Your word. Amen.",
  },
  {
    day: 21,
    date: "Dec 21",
    candleWeek: 4,
    candleColor: "purple",
    theme: "Love",
    title: "The Visitation",
    scripture: "Luke 1:44",
    scriptureText:
      "When the voice of your greeting came to my ears, the baby leaped for joy.",
    activity: "Visit a neighbor, elderly relative, or lonely person today.",
    prayer: "Lord, let me bring You to others wherever I go. Amen.",
  },
  {
    day: 22,
    date: "Dec 22",
    candleWeek: 4,
    candleColor: "purple",
    theme: "Love",
    title: "O Rex Gentium",
    scripture: "Isaiah 2:4",
    scriptureText: "They shall beat their swords into ploughshares.",
    activity:
      "Pray for world peace, especially in countries suffering from war.",
    prayer: "O King of nations, bring Your peace to every nation. Amen.",
  },
  {
    day: 23,
    date: "Dec 23",
    candleWeek: 4,
    candleColor: "purple",
    theme: "Love",
    title: "O Emmanuel",
    scripture: "Isaiah 7:14",
    scriptureText: "Emmanuel — God with us.",
    activity:
      "Set up the manger scene. Place the baby Jesus in the crib tonight.",
    prayer: "God with us — come into our home, our hearts, our lives. Amen.",
  },
  {
    day: 24,
    date: "Dec 24",
    candleWeek: 4,
    candleColor: "white",
    theme: "Love",
    title: "Christmas Eve",
    scripture: "Luke 2:10",
    scriptureText:
      "I bring you good news of great joy that will be for all the people.",
    activity:
      "Attend Midnight Mass or Christmas Vigil. Light all four candles.",
    prayer: "Come, Lord Jesus. We are ready. Our hearts are open. Amen.",
  },
];

export function getAdventDay(dayNumber: number): AdventDay | undefined {
  return ADVENT_DAYS.find((d) => d.day === dayNumber);
}
