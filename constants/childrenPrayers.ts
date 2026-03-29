export interface ChildPrayer {
  id: string;
  title: string;
  emoji: string;
  prayer: string;
  when: string; // When to pray it
  ageGroup: "all" | "little" | "older";
}

export const CHILDREN_PRAYERS: ChildPrayer[] = [
  {
    id: "cp1",
    ageGroup: "all",
    emoji: "☀️",
    title: "Good Morning Prayer",
    when: "Every morning when you wake up",
    prayer:
      "Good morning, God!\nThank You for this brand new day.\nHelp me to be kind and good,\nIn everything I do and say.\nAmen.",
  },
  {
    id: "cp2",
    ageGroup: "all",
    emoji: "🌙",
    title: "Bedtime Prayer",
    when: "Every night before sleep",
    prayer:
      "Now I lay me down to sleep,\nI pray to God my soul to keep.\nAngels watch me through the night,\nAnd wake me with the morning light.\nAmen.",
  },
  {
    id: "cp3",
    ageGroup: "all",
    emoji: "🍽️",
    title: "Grace Before Meals",
    when: "Before every meal",
    prayer:
      "Bless us, O Lord,\nAnd these, Thy gifts,\nWhich we are about to receive\nFrom Thy bounty,\nThrough Christ Our Lord.\nAmen.",
  },
  {
    id: "cp4",
    ageGroup: "all",
    emoji: "😇",
    title: "Guardian Angel Prayer",
    when: "Morning and bedtime",
    prayer:
      "Angel of God, my guardian dear,\nTo whom God's love commits me here,\nEver this day be at my side,\nTo light and guard, to rule and guide.\nAmen.",
  },
  {
    id: "cp5",
    ageGroup: "little",
    emoji: "❤️",
    title: "I Love You, God",
    when: "Anytime",
    prayer:
      "Dear God,\nI love You so much!\nThank You for my family.\nThank You for my friends.\nThank You for making me.\nAmen.",
  },
  {
    id: "cp6",
    ageGroup: "little",
    emoji: "😔",
    title: "When I'm Sorry",
    when: "When you've done something wrong",
    prayer:
      "Dear Jesus,\nI'm sorry for what I did.\nI know it wasn't right.\nPlease forgive me\nAnd help me do better tomorrow.\nAmen.",
  },
  {
    id: "cp7",
    ageGroup: "little",
    emoji: "😨",
    title: "When I'm Scared",
    when: "When you feel afraid",
    prayer:
      "Dear God,\nI am scared right now.\nPlease be with me.\nI know You are bigger\nThan anything I'm afraid of.\nHelp me to be brave.\nAmen.",
  },
  {
    id: "cp8",
    ageGroup: "older",
    emoji: "🏫",
    title: "Prayer Before School",
    when: "Before school each morning",
    prayer:
      "Lord Jesus,\nBe with me at school today.\nHelp me to learn with a curious mind,\nTo treat my classmates with kindness,\nAnd to honor You in everything I do.\nAmen.",
  },
  {
    id: "cp9",
    ageGroup: "older",
    emoji: "🤝",
    title: "Prayer for a Friend",
    when: "When a friend is struggling",
    prayer:
      "Lord,\nPlease watch over my friend [name].\nYou know exactly what they need.\nGive them comfort and strength.\nHelp me to be a good friend to them.\nAmen.",
  },
  {
    id: "cp10",
    ageGroup: "older",
    emoji: "✝️",
    title: "Act of Faith",
    when: "Morning or before Mass",
    prayer:
      "O my God, I firmly believe\nThat You are one God in three Divine Persons,\nFather, Son, and Holy Spirit.\nI believe that Your Divine Son became man\nAnd died for our sins,\nAnd that He will come to judge the living and the dead.\nI believe these and all the truths\nWhich the Holy Catholic Church teaches,\nBecause You have revealed them,\nWho can neither deceive nor be deceived.\nAmen.",
  },
];
