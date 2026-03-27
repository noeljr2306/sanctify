import { RosaryMystery } from "./prayers.types";

export const ROSARY_MYSTERIES: RosaryMystery[] = [
  {
    type: "joyful",
    label: "Joyful Mysteries",
    days: "Monday & Saturday",
    mysteries: [
      {
        number: 1,
        title: "The Annunciation",
        scripture: "Luke 1:26–38",
        reflection:
          "The Angel Gabriel announces to Mary that she will conceive the Son of God. Reflect on humility and total surrender to God's will.",
      },
      {
        number: 2,
        title: "The Visitation",
        scripture: "Luke 1:39–56",
        reflection:
          "Mary visits her cousin Elizabeth. Reflect on charity — bringing Christ to others in our daily encounters.",
      },
      {
        number: 3,
        title: "The Nativity",
        scripture: "Luke 2:1–20",
        reflection:
          "Jesus is born in Bethlehem. Reflect on poverty of spirit and detachment from worldly comforts.",
      },
      {
        number: 4,
        title: "The Presentation in the Temple",
        scripture: "Luke 2:22–38",
        reflection:
          "Mary and Joseph present Jesus in the Temple. Reflect on obedience to God's law and purity of intention.",
      },
      {
        number: 5,
        title: "The Finding of Jesus in the Temple",
        scripture: "Luke 2:41–52",
        reflection:
          "Jesus is found teaching in the Temple. Reflect on zeal for God's house and seeking Jesus above all things.",
      },
    ],
  },
  {
    type: "luminous",
    label: "Luminous Mysteries",
    days: "Thursday",
    mysteries: [
      {
        number: 1,
        title: "The Baptism of Jesus",
        scripture: "Matthew 3:13–17",
        reflection:
          "Jesus is baptized in the Jordan. Reflect on your own baptismal call and fidelity to God's covenant.",
      },
      {
        number: 2,
        title: "The Wedding at Cana",
        scripture: "John 2:1–12",
        reflection:
          "Mary intercedes and Jesus performs His first miracle. Reflect on trust in Mary's intercession and openness to grace.",
      },
      {
        number: 3,
        title: "The Proclamation of the Kingdom",
        scripture: "Mark 1:15",
        reflection:
          "Jesus preaches repentance and the Kingdom of God. Reflect on conversion of heart and the call to holiness.",
      },
      {
        number: 4,
        title: "The Transfiguration",
        scripture: "Matthew 17:1–8",
        reflection:
          "Jesus is transfigured before Peter, James, and John. Reflect on the divine life within us and the call to contemplation.",
      },
      {
        number: 5,
        title: "The Institution of the Eucharist",
        scripture: "Matthew 26:26–28",
        reflection:
          "Jesus gives us His Body and Blood at the Last Supper. Reflect on love for the Eucharist and Eucharistic adoration.",
      },
    ],
  },
  {
    type: "sorrowful",
    label: "Sorrowful Mysteries",
    days: "Tuesday & Friday",
    mysteries: [
      {
        number: 1,
        title: "The Agony in the Garden",
        scripture: "Luke 22:39–46",
        reflection:
          "Jesus prays in Gethsemane, sweating blood. Reflect on contrition for sin and conformity to God's will in suffering.",
      },
      {
        number: 2,
        title: "The Scourging at the Pillar",
        scripture: "Matthew 27:26",
        reflection:
          "Jesus is brutally scourged. Reflect on mortification and the penance due for sin.",
      },
      {
        number: 3,
        title: "The Crowning with Thorns",
        scripture: "Matthew 27:29",
        reflection:
          "Soldiers mock Jesus with a crown of thorns. Reflect on moral courage and the rejection Christ endured for us.",
      },
      {
        number: 4,
        title: "The Carrying of the Cross",
        scripture: "Luke 23:26–32",
        reflection:
          "Jesus carries His Cross to Calvary. Reflect on patient acceptance of suffering united to Christ.",
      },
      {
        number: 5,
        title: "The Crucifixion",
        scripture: "Luke 23:33–46",
        reflection:
          "Jesus dies on the Cross for our sins. Reflect on the infinite love of God and the seriousness of sin.",
      },
    ],
  },
  {
    type: "glorious",
    label: "Glorious Mysteries",
    days: "Wednesday & Sunday",
    mysteries: [
      {
        number: 1,
        title: "The Resurrection",
        scripture: "John 20:1–18",
        reflection:
          "Jesus rises from the dead on the third day. Reflect on faith, hope, and the promise of eternal life.",
      },
      {
        number: 2,
        title: "The Ascension",
        scripture: "Acts 1:9–11",
        reflection:
          "Jesus ascends into Heaven. Reflect on the theological virtue of hope and our longing for Heaven.",
      },
      {
        number: 3,
        title: "The Descent of the Holy Spirit",
        scripture: "Acts 2:1–4",
        reflection:
          "The Holy Spirit comes upon the Apostles at Pentecost. Reflect on the gifts of the Spirit and zeal for souls.",
      },
      {
        number: 4,
        title: "The Assumption of Mary",
        scripture: "Revelation 12:1",
        reflection:
          "Mary is assumed body and soul into Heaven. Reflect on devotion to Mary and the sanctification of the body.",
      },
      {
        number: 5,
        title: "The Coronation of Mary",
        scripture: "Revelation 12:1",
        reflection:
          "Mary is crowned Queen of Heaven and Earth. Reflect on final perseverance and trust in Mary's maternal care.",
      },
    ],
  },
];

// Prayers prayed during the Rosary
export const ROSARY_PRAYERS = {
  apostlesCreed: `I believe in God, the Father Almighty, Creator of Heaven and earth; and in Jesus Christ, His only Son, Our Lord, Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into Hell; the third day He rose again from the dead; He ascended into Heaven, and sitteth at the right hand of God, the Father almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body and life everlasting. Amen.`,

  ourFather: `Our Father, Who art in Heaven, hallowed be Thy name; Thy Kingdom come, Thy will be done on earth as it is in Heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.`,

  hailMary: `Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.`,

  gloryBe: `Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`,

  fatimaPrayer: `O my Jesus, forgive us our sins, save us from the fires of Hell, lead all souls to Heaven, especially those in most need of Your mercy. Amen.`,

  hailHolyQueen: `Hail, Holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy towards us; and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.

V. Pray for us, O Holy Mother of God.
R. That we may be made worthy of the promises of Christ.

Let us pray: O God, whose only begotten Son, by His life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech Thee, that meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ Our Lord. Amen.`,
};
