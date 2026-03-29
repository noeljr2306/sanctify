export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  points: number;
}

export interface FaithBadge {
  id: string;
  label: string;
  emoji: string;
  description: string;
  requiredPoints: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    category: "Liturgy",
    points: 10,
    question: "How many sacraments does the Catholic Church have?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
    explanation:
      "The Catholic Church has 7 sacraments: Baptism, Confirmation, Eucharist, Reconciliation, Anointing of the Sick, Holy Orders, and Matrimony.",
  },
  {
    id: "q2",
    category: "Scripture",
    points: 10,
    question: "How many books are in the Catholic Bible?",
    options: ["66", "70", "73", "76"],
    correctIndex: 2,
    explanation:
      "The Catholic Bible has 73 books — 46 in the Old Testament and 27 in the New Testament.",
  },
  {
    id: "q3",
    category: "Prayer",
    points: 10,
    question: "How many mysteries are in the full Rosary?",
    options: ["15", "18", "20", "25"],
    correctIndex: 2,
    explanation:
      "The full Rosary has 20 mysteries: 5 Joyful, 5 Luminous (added by St. John Paul II), 5 Sorrowful, and 5 Glorious.",
  },
  {
    id: "q4",
    category: "History",
    points: 10,
    question: "In what year did the Second Vatican Council end?",
    options: ["1958", "1962", "1965", "1970"],
    correctIndex: 2,
    explanation:
      "The Second Vatican Council opened in 1962 under Pope John XXIII and concluded in 1965 under Pope Paul VI.",
  },
  {
    id: "q5",
    category: "Doctrine",
    points: 15,
    question: "What is transubstantiation?",
    options: [
      "The resurrection of Christ",
      "Bread and wine becoming Christ's Body and Blood",
      "The conversion of a sinner",
      "The translation of the Bible",
    ],
    correctIndex: 1,
    explanation:
      "Transubstantiation is the Catholic teaching that during the Mass, the bread and wine are truly changed into the Body and Blood of Jesus Christ, while their outward appearances remain.",
  },
  {
    id: "q6",
    category: "Mary",
    points: 15,
    question: "What Marian dogma was defined in 1854?",
    options: [
      "The Assumption",
      "The Immaculate Conception",
      "The Divine Maternity",
      "The Perpetual Virginity",
    ],
    correctIndex: 1,
    explanation:
      "Pope Pius IX defined the dogma of the Immaculate Conception in 1854, teaching that Mary was preserved from original sin from the moment of her conception.",
  },
  {
    id: "q7",
    category: "Liturgy",
    points: 10,
    question: "What color is worn during Ordinary Time?",
    options: ["Purple", "Red", "White", "Green"],
    correctIndex: 3,
    explanation:
      "Green is worn during Ordinary Time, symbolizing hope and the life of the Church between the major seasons.",
  },
  {
    id: "q8",
    category: "Doctrine",
    points: 15,
    question: "What are the Four Last Things?",
    options: [
      "Faith, Hope, Love, Grace",
      "Death, Judgment, Heaven, Hell",
      "Prayer, Fasting, Almsgiving, Penance",
      "Birth, Life, Death, Resurrection",
    ],
    correctIndex: 1,
    explanation:
      "The Four Last Things are Death, Judgment, Heaven, and Hell — the ultimate realities that Catholics are called to keep in mind throughout their lives.",
  },
  {
    id: "q9",
    category: "Saints",
    points: 10,
    question: "Who is the patron saint of the Universal Church?",
    options: ["St. Paul", "St. Peter", "St. Joseph", "St. John"],
    correctIndex: 2,
    explanation:
      "St. Joseph, husband of Mary and foster father of Jesus, was declared Patron of the Universal Church by Pope Pius IX in 1870.",
  },
  {
    id: "q10",
    category: "History",
    points: 20,
    question: "Which Pope defined the dogma of the Assumption of Mary?",
    options: [
      "Pope Pius IX",
      "Pope Leo XIII",
      "Pope Pius XII",
      "Pope John XXIII",
    ],
    correctIndex: 2,
    explanation:
      "Pope Pius XII defined the dogma of the Assumption of Mary in 1950 with the apostolic constitution Munificentissimus Deus.",
  },
  {
    id: "q11",
    category: "Scripture",
    points: 10,
    question:
      "In which Gospel does Jesus give the Beatitudes in the Sermon on the Mount?",
    options: ["Mark", "Luke", "John", "Matthew"],
    correctIndex: 3,
    explanation:
      "The Beatitudes in the Sermon on the Mount are found in Matthew 5:3–12. Luke's version (Luke 6:20–23) is shorter and given on a plain.",
  },
  {
    id: "q12",
    category: "Doctrine",
    points: 15,
    question: "What does 'ex cathedra' mean in reference to the Pope?",
    options: [
      "From the Vatican",
      "Speaking officially on faith and morals",
      "During a canonization",
      "At an Ecumenical Council",
    ],
    correctIndex: 1,
    explanation:
      "Ex cathedra (Latin: 'from the chair') refers to when the Pope speaks officially and infallibly on matters of faith and morals, binding the whole Church.",
  },
];

export const FAITH_BADGES: FaithBadge[] = [
  {
    id: "b1",
    label: "Seeker",
    emoji: "🌱",
    description: "Begun the journey of faith formation",
    requiredPoints: 0,
  },
  {
    id: "b2",
    label: "Disciple",
    emoji: "📖",
    description: "Answered 10 questions correctly",
    requiredPoints: 50,
  },
  {
    id: "b3",
    label: "Catechumen",
    emoji: "✝️",
    description: "Earned 150 points in faith quizzes",
    requiredPoints: 150,
  },
  {
    id: "b4",
    label: "Faithful",
    emoji: "🙏",
    description: "Earned 300 points in faith quizzes",
    requiredPoints: 300,
  },
  {
    id: "b5",
    label: "Apologist",
    emoji: "🛡️",
    description: "Earned 500 points in faith quizzes",
    requiredPoints: 500,
  },
  {
    id: "b6",
    label: "Doctor",
    emoji: "👑",
    description: "Mastered all categories with 1000 points",
    requiredPoints: 1000,
  },
];

export function getBadgeForPoints(points: number): FaithBadge {
  return (
    [...FAITH_BADGES].reverse().find((b) => points >= b.requiredPoints) ??
    FAITH_BADGES[0]
  );
}
