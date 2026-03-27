import { Prayer } from "./prayers.types";

export const PRAYERS: Prayer[] = [
  // ── Daily ──────────────────────────────────────────────────────────────────
  {
    id: "morning_offering",
    title: "Morning Offering",
    category: "daily",
    excerpt: "Offer this day to the Sacred Heart of Jesus.",
    tags: ["morning", "daily"],
    body: `O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, in reparation for my sins, for the intentions of all my relatives and friends, and in particular for the intentions of the Holy Father.

Amen.`,
  },
  {
    id: "angelus",
    title: "The Angelus",
    category: "daily",
    excerpt: "Prayed at 6 AM, noon, and 6 PM.",
    tags: ["angelus", "daily", "mary"],
    body: `V. The Angel of the Lord declared unto Mary.
R. And she conceived of the Holy Spirit.

Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.

V. Behold the handmaid of the Lord.
R. Be it done unto me according to Thy Word.

Hail Mary...

V. And the Word was made Flesh.
R. And dwelt among us.

Hail Mary...

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ.

Let us pray: Pour forth, we beseech Thee, O Lord, Thy grace into our hearts, that we, to whom the Incarnation of Christ Thy Son was made known by the message of an angel, may by His Passion and Cross be brought to the glory of His Resurrection, through the same Christ Our Lord.

Amen.`,
  },
  {
    id: "evening_prayer",
    title: "Evening Prayer",
    category: "daily",
    excerpt: "Give thanks and reflect at the close of the day.",
    tags: ["evening", "daily"],
    body: `Lord God, as this day draws to a close, I come before You with a grateful heart. Thank You for the gift of this day — its joys, its challenges, and its quiet moments of grace.

I am sorry for the times I fell short of Your love today. Forgive me where I have sinned in thought, word, deed, or omission.

Watch over me and those I love as we rest this night. May I rise tomorrow renewed, ready to serve You and those around me.

Into Your hands I commend my spirit.

Amen.`,
  },
  {
    id: "night_prayer",
    title: "Night Prayer (Compline)",
    category: "daily",
    excerpt: "The Church's ancient prayer before sleep.",
    tags: ["night", "daily", "liturgy"],
    body: `Lord, grant us a restful night and a peaceful death.

I confess to Almighty God, and to you my brothers and sisters, that I have sinned through my own fault, in my thoughts and in my words, in what I have done and in what I have failed to do.

May Almighty God have mercy on me, forgive me my sins, and bring me to everlasting life.

Protect us, Lord, as we stay awake; watch over us as we sleep, that awake we may keep watch with Christ, and asleep, rest in His peace.

Into Your hands, Lord, I commend my spirit. You have redeemed us, Lord God of truth.

Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end.

Amen.`,
  },
  {
    id: "act_of_contrition",
    title: "Act of Contrition",
    category: "daily",
    excerpt: "A prayer of repentance and resolve.",
    tags: ["contrition", "confession", "daily"],
    body: `O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, Who art all good and deserving of all my love.

I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin.

Amen.`,
  },

  // ── Liturgy of the Hours ───────────────────────────────────────────────────
  {
    id: "morning_praise",
    title: "Morning Praise (Lauds)",
    category: "liturgy_of_hours",
    excerpt: "The Church's morning hymn of praise.",
    tags: ["lauds", "morning", "liturgy"],
    body: `Lord, open my lips.
And my mouth shall proclaim Your praise.

O God, come to my assistance.
Lord, make haste to help me.

Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen. Alleluia.

Blessed are You, Lord our God, King of the universe. You bring forth bread from the earth and create the fruit of the vine. You have given us this new day; may we use it in Your service.

Let my prayer rise before You like incense, the lifting of my hands like the evening sacrifice.

Amen.`,
  },

  // ── Seasonal ───────────────────────────────────────────────────────────────
  {
    id: "advent_o_antiphon",
    title: "O Come, O Come Emmanuel",
    category: "seasonal",
    excerpt: "Ancient Advent prayer and longing.",
    tags: ["advent", "seasonal"],
    body: `O come, O come, Emmanuel,
And ransom captive Israel,
That mourns in lonely exile here
Until the Son of God appear.

Rejoice! Rejoice! Emmanuel
Shall come to thee, O Israel.

O come, Thou Wisdom from on high,
Who orderest all things mightily;
To us the path of knowledge show,
And teach us in her ways to go.

Rejoice! Rejoice! Emmanuel
Shall come to thee, O Israel.

Amen.`,
  },
  {
    id: "stations_intro",
    title: "Opening Prayer for Stations of the Cross",
    category: "seasonal",
    excerpt: "Begin the Way of the Cross with this prayer.",
    tags: ["lent", "stations", "cross"],
    body: `My Lord Jesus Christ, You have made this journey to die for me with unspeakable love; and I have so many times ungratefully abandoned You.

But now I love You with all my heart; and because I love You, I am sincerely sorry for ever having offended You. Pardon me, my God, and permit me to accompany You on this journey.

You go to die for love of me; I want, my beloved Redeemer, to die for love of You. My Jesus, I will live and die always united to You.

Amen.`,
  },

  // ── Emergency ─────────────────────────────────────────────────────────────
  {
    id: "prayer_for_sick",
    title: "Prayer for the Sick",
    category: "emergency",
    excerpt: "Entrust the sick to God's healing mercy.",
    tags: ["sick", "healing", "emergency"],
    body: `Lord Jesus Christ, You went about doing good and healing all; You are the same yesterday, today, and forever.

As You once walked the roads of Galilee healing all who came to You, we bring before You now those who are sick. Touch them with Your healing power; raise them up and restore them.

If it is Your will, grant them physical healing. But above all, grant them peace, comfort, and the assurance of Your presence in their suffering.

May they know that their pain is united to Your cross, and that nothing — not even illness — can separate them from Your love.

Through Christ our Lord. Amen.`,
  },
  {
    id: "prayer_for_peace",
    title: "Prayer of Saint Francis",
    category: "emergency",
    excerpt: "Lord, make me an instrument of Your peace.",
    tags: ["peace", "francis", "emergency"],
    body: `Lord, make me an instrument of Your peace.
Where there is hatred, let me sow love;
Where there is injury, pardon;
Where there is doubt, faith;
Where there is despair, hope;
Where there is darkness, light;
Where there is sadness, joy.

O Divine Master, grant that I may not so much seek
To be consoled as to console;
To be understood as to understand;
To be loved as to love.

For it is in giving that we receive;
It is in pardoning that we are pardoned;
And it is in dying that we are born to eternal life.

Amen.`,
  },
];

export const PRAYER_CATEGORIES = [
  { id: "daily", label: "Daily Prayers", emoji: "☀️" },
  { id: "rosary", label: "The Rosary", emoji: "📿" },
  { id: "divine_mercy", label: "Divine Mercy", emoji: "🕊️" },
  { id: "liturgy_of_hours", label: "Liturgy of the Hours", emoji: "⏰" },
  { id: "seasonal", label: "Seasonal Prayers", emoji: "✝️" },
  { id: "emergency", label: "Emergency Prayers", emoji: "🆘" },
] as const;
