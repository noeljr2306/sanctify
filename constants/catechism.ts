export interface CatechismEntry {
  id: string;
  paragraph: string; // CCC paragraph number e.g. "CCC 27"
  title: string;
  text: string;
  category: string;
}

export const CATECHISM_ENTRIES: CatechismEntry[] = [
  {
    id: "c1",
    paragraph: "CCC 27",
    title: "The Desire for God",
    category: "God",
    text: "The desire for God is written in the human heart, because man is created by God and for God; and God never ceases to draw man to himself. Only in God will he find the truth and happiness he never stops searching for.",
  },
  {
    id: "c2",
    paragraph: "CCC 234",
    title: "The Mystery of the Trinity",
    category: "God",
    text: "The mystery of the Most Holy Trinity is the central mystery of Christian faith and life. It is the mystery of God in himself. It is therefore the source of all the other mysteries of faith, the light that enlightens them.",
  },
  {
    id: "c3",
    paragraph: "CCC 456",
    title: "Why the Word Became Flesh",
    category: "Jesus Christ",
    text: "The Word became flesh for us in order to save us by reconciling us with God, who loved us and sent his Son as an expiation for our sins. God desired to show his love and to be known by us through His Son.",
  },
  {
    id: "c4",
    paragraph: "CCC 683",
    title: "The Holy Spirit",
    category: "Holy Spirit",
    text: "No one can say 'Jesus is Lord' except by the Holy Spirit. The Holy Spirit is the first to awaken faith in us and to communicate to us the new life, which is to know the Father and the one whom he has sent.",
  },
  {
    id: "c5",
    paragraph: "CCC 771",
    title: "The Church — Visible and Spiritual",
    category: "The Church",
    text: "The Church is at the same time a visible society and a spiritual community. She is both human and divine, visible yet endowed with invisible realities, zealous in action yet given to contemplation.",
  },
  {
    id: "c6",
    paragraph: "CCC 1113",
    title: "The Sacraments of Christ",
    category: "Sacraments",
    text: "The whole liturgical life of the Church revolves around the Eucharistic sacrifice and the sacraments. The sacraments are efficacious signs of grace, instituted by Christ and entrusted to the Church, by which divine life is dispensed to us.",
  },
  {
    id: "c7",
    paragraph: "CCC 1324",
    title: "The Source and Summit",
    category: "Eucharist",
    text: "The Eucharist is the source and summit of the Christian life. The other sacraments, and indeed all ecclesiastical ministries and works of the apostolate, are bound up with the Eucharist and are oriented toward it.",
  },
  {
    id: "c8",
    paragraph: "CCC 1422",
    title: "Reconciliation",
    category: "Sacraments",
    text: "Those who approach the sacrament of Penance obtain pardon from God's mercy for the offense committed against him, and are, at the same time, reconciled with the Church which they have wounded by their sins.",
  },
  {
    id: "c9",
    paragraph: "CCC 1716",
    title: "The Beatitudes",
    category: "Morality",
    text: "The Beatitudes are at the heart of Jesus' preaching. They depict the countenance of Jesus Christ and portray his charity. They express the vocation of the faithful associated with the glory of his Passion and Resurrection.",
  },
  {
    id: "c10",
    paragraph: "CCC 1849",
    title: "What is Sin?",
    category: "Morality",
    text: "Sin is an offense against reason, truth, and right conscience; it is failure in genuine love for God and neighbor caused by a perverse attachment to certain goods. It wounds the nature of man and injures human solidarity.",
  },
  {
    id: "c11",
    paragraph: "CCC 2558",
    title: "What is Prayer?",
    category: "Prayer",
    text: "Prayer is the raising of one's mind and heart to God or the requesting of good things from God. Great is the mystery of the faith. It is lived in personal and liturgical prayer. Prayer is a vital necessity.",
  },
  {
    id: "c12",
    paragraph: "CCC 2650",
    title: "Prayer as Gift",
    category: "Prayer",
    text: "Prayer cannot be reduced to the spontaneous outpouring of interior impulse: in order to pray, one must have the will to pray. Nor is it enough to know what the Scriptures reveal about prayer. One must also learn how to pray.",
  },
  {
    id: "c13",
    paragraph: "CCC 966",
    title: "Mary's Assumption",
    category: "Mary",
    text: "The Immaculate Virgin, preserved free from all stain of original sin, when the course of her earthly life was finished, was taken up body and soul into heavenly glory, and exalted by the Lord as Queen over all things.",
  },
  {
    id: "c14",
    paragraph: "CCC 988",
    title: "Resurrection of the Body",
    category: "Last Things",
    text: "The Christian Creed culminates in the proclamation of the resurrection of the dead on the last day and in life everlasting. God will raise the just and the unjust at the end of time.",
  },
  {
    id: "c15",
    paragraph: "CCC 1023",
    title: "Heaven",
    category: "Last Things",
    text: "Those who die in God's grace and friendship and are perfectly purified live for ever with Christ. They are like God for ever, for they see him face-to-face. This perfect life with the Most Holy Trinity is called Heaven.",
  },
];

export function getTodayCatechism(): CatechismEntry {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return CATECHISM_ENTRIES[day % CATECHISM_ENTRIES.length];
}
