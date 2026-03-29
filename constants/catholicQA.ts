export interface QAItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const CATHOLIC_QA: QAItem[] = [
  {
    id: "q1",
    category: "Afterlife",
    question: "What is Purgatory?",
    answer:
      "Purgatory is a state of final purification for those who die in God's grace but are not yet fully purified. It is not a second chance at salvation, but a process of being made ready to enter fully into Heaven. The Church teaches us to pray for the souls in Purgatory, especially through the offering of Mass. (CCC 1030–1032)",
  },
  {
    id: "q2",
    category: "Mary",
    question: "Why do Catholics venerate Mary?",
    answer:
      "Catholics venerate (honor) Mary as the Mother of God and the greatest of all saints — not worship her, which is reserved for God alone. Mary is honored because she freely said 'yes' to God and bore Jesus Christ. We ask for her intercession just as we ask friends to pray for us, but her closeness to Christ makes her intercession uniquely powerful. (CCC 971)",
  },
  {
    id: "q3",
    category: "The Pope",
    question: "What does papal infallibility mean?",
    answer:
      "Papal infallibility means that when the Pope speaks ex cathedra (from the chair of Peter) on matters of faith and morals, the Holy Spirit protects him from error. This has only been formally invoked twice: the Immaculate Conception (1854) and the Assumption of Mary (1950). It does not mean the Pope is sinless or infallible in everyday speech. (CCC 891)",
  },
  {
    id: "q4",
    category: "Sacraments",
    question: "Why do Catholics confess to a priest?",
    answer:
      "Catholics confess to a priest because Christ gave the Apostles the authority to forgive sins: 'Receive the Holy Spirit. If you forgive anyone's sins, their sins are forgiven' (John 20:22–23). The priest acts in the person of Christ (in persona Christi). The sacrament is not just psychological; it is an encounter with Christ's mercy through the Church. (CCC 1461–1467)",
  },
  {
    id: "q5",
    category: "Eucharist",
    question: "What is the Real Presence?",
    answer:
      "The Real Presence is the Catholic teaching that Jesus Christ is truly, really, and substantially present — Body, Blood, Soul, and Divinity — in the Eucharist. This change of bread and wine into Christ's Body and Blood is called transubstantiation. It is not merely symbolic; Christ himself said 'This is my body' (Luke 22:19). (CCC 1373–1377)",
  },
  {
    id: "q6",
    category: "Scripture",
    question: "Why does the Catholic Bible have more books?",
    answer:
      "The Catholic Bible contains 73 books, while Protestant Bibles have 66. The 7 additional books (Tobit, Judith, 1 & 2 Maccabees, Wisdom, Sirach, Baruch) are called Deuterocanonical by Catholics. They were part of the Septuagint (Greek Old Testament) used by early Christians. Martin Luther removed them during the Reformation in the 16th century.",
  },
  {
    id: "q7",
    category: "Prayer",
    question: "What is the Rosary and why do Catholics pray it?",
    answer:
      "The Rosary is a meditative prayer combining vocal prayers (Hail Mary, Our Father, Glory Be) with meditation on 20 mysteries from the lives of Jesus and Mary. It is not worshipping Mary — we meditate on Christ's life while asking Mary's intercession. St. John Paul II called it 'a compendium of the Gospel.' It is one of the most powerful prayers in Catholic tradition.",
  },
  {
    id: "q8",
    category: "Church",
    question: "What are the Four Marks of the Church?",
    answer:
      "The Four Marks of the Church are: One (united in faith, sacraments, and governance under the Pope), Holy (founded by Christ, who is holy, and sanctifying her members), Catholic (universal — for all people of all times), and Apostolic (founded on the Apostles, with an unbroken line of succession to today). We profess these in the Nicene Creed. (CCC 813–865)",
  },
  {
    id: "q9",
    category: "Morality",
    question: "What are mortal and venial sins?",
    answer:
      "Mortal sin completely severs a person's relationship with God. It requires three conditions: grave matter, full knowledge, and deliberate consent. Examples include missing Mass on Sunday deliberately, adultery, and murder. Venial sin weakens but does not break our relationship with God. All sin should be confessed, but mortal sin must be confessed before receiving Communion. (CCC 1854–1863)",
  },
  {
    id: "q10",
    category: "Saints",
    question: "What is the Communion of Saints?",
    answer:
      "The Communion of Saints is the spiritual union between all members of the Church: the Church Militant (living on earth), the Church Suffering (souls in Purgatory), and the Church Triumphant (saints in Heaven). We are united in Christ and can pray for each other across this divide. This is why Catholics ask saints to intercede — they are alive in Christ and praying for us. (CCC 946–962)",
  },
];

export const QA_CATEGORIES = [...new Set(CATHOLIC_QA.map((q) => q.category))];
