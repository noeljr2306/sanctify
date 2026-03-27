import {
  AgeGroup,
  ConfessionStep,
  ExaminationSection,
} from "../types/confession.types";

// ── Examination of Conscience ─────────────────────────────────────────────────

const ADULT_EXAMINATION: ExaminationSection[] = [
  {
    id: "first",
    title: "First Commandment",
    subtitle: "I am the Lord your God. You shall have no other gods before me.",
    items: [
      {
        id: "1a",
        commandment: "1st",
        question: "Have I doubted or denied God's existence?",
        checked: false,
      },
      {
        id: "1b",
        commandment: "1st",
        question: "Have I neglected prayer or my relationship with God?",
        checked: false,
      },
      {
        id: "1c",
        commandment: "1st",
        question:
          "Have I consulted horoscopes, fortune tellers, or the occult?",
        checked: false,
      },
      {
        id: "1d",
        commandment: "1st",
        question: "Have I placed money, work, or pleasure above God?",
        checked: false,
      },
      {
        id: "1e",
        commandment: "1st",
        question: "Have I despaired of God's mercy or presumed upon it?",
        checked: false,
      },
    ],
  },
  {
    id: "second",
    title: "Second Commandment",
    subtitle: "You shall not take the name of the Lord in vain.",
    items: [
      {
        id: "2a",
        commandment: "2nd",
        question: "Have I used God's name carelessly or as a curse?",
        checked: false,
      },
      {
        id: "2b",
        commandment: "2nd",
        question: "Have I broken an oath or promise made in God's name?",
        checked: false,
      },
      {
        id: "2c",
        commandment: "2nd",
        question:
          "Have I spoken disrespectfully about God, the Church, or the saints?",
        checked: false,
      },
    ],
  },
  {
    id: "third",
    title: "Third Commandment",
    subtitle: "Remember to keep holy the Lord's Day.",
    items: [
      {
        id: "3a",
        commandment: "3rd",
        question:
          "Have I missed Mass on Sunday or a Holy Day of Obligation without a serious reason?",
        checked: false,
      },
      {
        id: "3b",
        commandment: "3rd",
        question: "Have I been distracted or irreverent during Mass?",
        checked: false,
      },
      {
        id: "3c",
        commandment: "3rd",
        question: "Have I done unnecessary servile work on Sunday?",
        checked: false,
      },
    ],
  },
  {
    id: "fourth",
    title: "Fourth Commandment",
    subtitle: "Honor your father and your mother.",
    items: [
      {
        id: "4a",
        commandment: "4th",
        question: "Have I been disrespectful or disobedient to my parents?",
        checked: false,
      },
      {
        id: "4b",
        commandment: "4th",
        question: "Have I neglected my duties to my spouse or children?",
        checked: false,
      },
      {
        id: "4c",
        commandment: "4th",
        question: "Have I failed to care for elderly or sick family members?",
        checked: false,
      },
      {
        id: "4d",
        commandment: "4th",
        question: "Have I disobeyed lawful authority without just cause?",
        checked: false,
      },
    ],
  },
  {
    id: "fifth",
    title: "Fifth Commandment",
    subtitle: "You shall not kill.",
    items: [
      {
        id: "5a",
        commandment: "5th",
        question: "Have I harbored hatred, anger, or desires for revenge?",
        checked: false,
      },
      {
        id: "5b",
        commandment: "5th",
        question: "Have I physically harmed another person?",
        checked: false,
      },
      {
        id: "5c",
        commandment: "5th",
        question: "Have I abused alcohol, drugs, or other substances?",
        checked: false,
      },
      {
        id: "5d",
        commandment: "5th",
        question: "Have I had thoughts of suicide or harmed myself?",
        checked: false,
      },
      {
        id: "5e",
        commandment: "5th",
        question: "Have I given scandal or led others into serious sin?",
        checked: false,
      },
    ],
  },
  {
    id: "sixth",
    title: "Sixth & Ninth Commandments",
    subtitle:
      "You shall not commit adultery. You shall not covet your neighbor's wife.",
    items: [
      {
        id: "6a",
        commandment: "6th",
        question: "Have I been unfaithful to my spouse in thought or deed?",
        checked: false,
      },
      {
        id: "6b",
        commandment: "6th",
        question: "Have I engaged in sexual activity outside of marriage?",
        checked: false,
      },
      {
        id: "6c",
        commandment: "6th",
        question: "Have I used pornography or engaged in impure entertainment?",
        checked: false,
      },
      {
        id: "6d",
        commandment: "6th",
        question: "Have I entertained impure thoughts or desires deliberately?",
        checked: false,
      },
      {
        id: "6e",
        commandment: "6th",
        question:
          "Have I engaged in practices contrary to the dignity of marriage?",
        checked: false,
      },
    ],
  },
  {
    id: "seventh",
    title: "Seventh & Tenth Commandments",
    subtitle: "You shall not steal. You shall not covet your neighbor's goods.",
    items: [
      {
        id: "7a",
        commandment: "7th",
        question: "Have I stolen, cheated, or defrauded anyone?",
        checked: false,
      },
      {
        id: "7b",
        commandment: "7th",
        question: "Have I failed to return borrowed items or make restitution?",
        checked: false,
      },
      {
        id: "7c",
        commandment: "7th",
        question:
          "Have I been greedy, wasteful, or envious of others' possessions?",
        checked: false,
      },
      {
        id: "7d",
        commandment: "7th",
        question: "Have I failed to give to those in need when I was able?",
        checked: false,
      },
    ],
  },
  {
    id: "eighth",
    title: "Eighth Commandment",
    subtitle: "You shall not bear false witness against your neighbor.",
    items: [
      {
        id: "8a",
        commandment: "8th",
        question: "Have I lied or deliberately deceived others?",
        checked: false,
      },
      {
        id: "8b",
        commandment: "8th",
        question: "Have I gossiped or damaged another's reputation?",
        checked: false,
      },
      {
        id: "8c",
        commandment: "8th",
        question: "Have I revealed secrets or confidential information?",
        checked: false,
      },
      {
        id: "8d",
        commandment: "8th",
        question:
          "Have I failed to defend someone who was being spoken about unjustly?",
        checked: false,
      },
    ],
  },
];

const TEEN_EXAMINATION: ExaminationSection[] = [
  {
    id: "god",
    title: "My Relationship with God",
    subtitle: "Do I love God above all things?",
    items: [
      {
        id: "t1",
        commandment: "1st",
        question: "Have I skipped Sunday Mass or arrived very late on purpose?",
        checked: false,
      },
      {
        id: "t2",
        commandment: "1st",
        question:
          "Have I been more interested in social media, games, or friends than in God?",
        checked: false,
      },
      {
        id: "t3",
        commandment: "2nd",
        question: "Have I used God's name as a swear word?",
        checked: false,
      },
      {
        id: "t4",
        commandment: "1st",
        question: "Have I prayed at all this week?",
        checked: false,
      },
    ],
  },
  {
    id: "family",
    title: "My Family & Authority",
    subtitle: "Do I honor my parents?",
    items: [
      {
        id: "t5",
        commandment: "4th",
        question: "Have I been rude, disrespectful, or unkind to my parents?",
        checked: false,
      },
      {
        id: "t6",
        commandment: "4th",
        question:
          "Have I disobeyed my parents or teachers without good reason?",
        checked: false,
      },
      {
        id: "t7",
        commandment: "4th",
        question: "Have I neglected my responsibilities at home or school?",
        checked: false,
      },
    ],
  },
  {
    id: "others",
    title: "How I Treat Others",
    subtitle: "Do I treat others with kindness?",
    items: [
      {
        id: "t8",
        commandment: "5th",
        question: "Have I bullied, excluded, or been cruel to anyone?",
        checked: false,
      },
      {
        id: "t9",
        commandment: "8th",
        question:
          "Have I spread rumors or said mean things about someone behind their back?",
        checked: false,
      },
      {
        id: "t10",
        commandment: "7th",
        question:
          "Have I stolen, cheated on a test, or taken something that wasn't mine?",
        checked: false,
      },
      {
        id: "t11",
        commandment: "5th",
        question: "Have I lost my temper and said hurtful things?",
        checked: false,
      },
    ],
  },
  {
    id: "purity",
    title: "Purity & Integrity",
    subtitle: "Do I respect my body and others' bodies?",
    items: [
      {
        id: "t12",
        commandment: "6th",
        question: "Have I viewed inappropriate content online?",
        checked: false,
      },
      {
        id: "t13",
        commandment: "6th",
        question: "Have I engaged in sexual activity outside of marriage?",
        checked: false,
      },
      {
        id: "t14",
        commandment: "6th",
        question: "Have I dressed or acted in ways that were immodest?",
        checked: false,
      },
    ],
  },
];

const CHILD_EXAMINATION: ExaminationSection[] = [
  {
    id: "god_child",
    title: "Loving God",
    subtitle: "Do I love God?",
    items: [
      {
        id: "c1",
        commandment: "1st",
        question: "Did I miss Mass on Sunday without being sick?",
        checked: false,
      },
      {
        id: "c2",
        commandment: "1st",
        question: "Did I forget to say my prayers?",
        checked: false,
      },
      {
        id: "c3",
        commandment: "2nd",
        question: "Did I use God's name in a bad way?",
        checked: false,
      },
    ],
  },
  {
    id: "family_child",
    title: "Loving My Family",
    subtitle: "Do I obey my parents?",
    items: [
      {
        id: "c4",
        commandment: "4th",
        question: "Did I disobey my mom or dad?",
        checked: false,
      },
      {
        id: "c5",
        commandment: "4th",
        question: "Was I rude or mean to my parents or family?",
        checked: false,
      },
      {
        id: "c6",
        commandment: "4th",
        question: "Did I do my chores and schoolwork?",
        checked: false,
      },
    ],
  },
  {
    id: "others_child",
    title: "Loving Others",
    subtitle: "Am I kind to others?",
    items: [
      {
        id: "c7",
        commandment: "5th",
        question: "Did I hit, push, or hurt anyone?",
        checked: false,
      },
      {
        id: "c8",
        commandment: "8th",
        question: "Did I lie to my parents or teacher?",
        checked: false,
      },
      {
        id: "c9",
        commandment: "7th",
        question: "Did I take something that wasn't mine?",
        checked: false,
      },
      {
        id: "c10",
        commandment: "5th",
        question: "Was I mean or unkind to a classmate or friend?",
        checked: false,
      },
    ],
  },
];

export const EXAMINATION_BY_AGE: Record<AgeGroup, ExaminationSection[]> = {
  adult: ADULT_EXAMINATION,
  teen: TEEN_EXAMINATION,
  child: CHILD_EXAMINATION,
};

// ── Confession Walkthrough Steps ──────────────────────────────────────────────

export const CONFESSION_STEPS: ConfessionStep[] = [
  {
    id: "prepare",
    title: "Prepare Your Heart",
    instruction:
      "Before entering the confessional, take a moment to quiet your heart. You are about to encounter Christ's mercy directly. He already knows your sins and loves you completely.",
    prayer:
      "Lord Jesus, give me the grace of true contrition. Help me to be honest, humble, and trusting in Your infinite mercy. Amen.",
    tip: "You can go behind a screen for anonymity or face-to-face with the priest — both are valid.",
  },
  {
    id: "greeting",
    title: "Enter & Greet the Priest",
    instruction:
      "When you enter, make the Sign of the Cross and say the opening words. The priest will offer a brief word of welcome.",
    prayer:
      'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.\n\n"Bless me, Father, for I have sinned. It has been [length of time] since my last confession."',
    tip: "Don't worry if you're nervous. Priests hear confessions regularly and are there to help, not judge.",
  },
  {
    id: "confess",
    title: "Confess Your Sins",
    instruction:
      "Tell the priest your sins honestly and clearly. You don't need to go into excessive detail — just be truthful. Start with any mortal sins (grave matter, full knowledge, deliberate consent), then venial sins.",
    tip: "If you forget a sin, it's okay. God's mercy covers sins forgotten in good faith. End with: \"For these and all the sins of my past life, I am truly sorry.\"",
  },
  {
    id: "penance",
    title: "Receive Your Penance",
    instruction:
      "The priest will give you a penance — usually prayers to say or an action to perform. Listen carefully and accept it humbly as a gift of healing, not punishment.",
    tip: "Complete your penance as soon as possible, ideally right after Mass or before you leave the church.",
  },
  {
    id: "contrition",
    title: "Act of Contrition",
    instruction:
      "The priest will ask you to express sorrow for your sins. Pray the Act of Contrition aloud:",
    prayer:
      "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, Who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.",
  },
  {
    id: "absolution",
    title: "Receive Absolution",
    instruction:
      "The priest will extend his hand over you and pray the words of absolution. This is the moment your sins are truly forgiven by Christ through the ministry of the priest.",
    prayer:
      "God, the Father of mercies, through the death and resurrection of His Son has reconciled the world to Himself and sent the Holy Spirit among us for the forgiveness of sins; through the ministry of the Church may God give you pardon and peace, and I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit.",
    tip: 'Respond: "Amen." Your sins are now truly gone — as if they never happened.',
  },
  {
    id: "dismissal",
    title: "Go in Peace",
    instruction:
      'The priest will dismiss you with words like "Go in peace" or "Give thanks to the Lord, for He is good." Respond: "His mercy endures forever."\n\nTake a moment in the church to thank God for His mercy and complete your penance.',
    prayer:
      "Thank You, Lord, for Your mercy. Help me to start fresh and sin no more. Strengthen me with Your grace. Amen.",
    tip: "Regular confession — even monthly — is one of the most powerful tools for spiritual growth in the Catholic tradition.",
  },
];
