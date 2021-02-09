const { db, Player, Session, Score } = require("../server/db");

const seed = async () => {
  try {
    await db.sync({ force: true });
    const [sam, mark, alex, julie] = await Promise.all([
      Player.create({
        alias: "sam",
        password: "12345",
      }),
      Player.create({
        alias: "mark",
        password: "12345",
      }),
      Player.create({
        alias: "alex",
        password: "12345",
      }),
      Player.create({
        alias: "julie",
        password: "12345",
      }),
    ]);

    const [sam1, sam2, mark1, alex1] = await Promise.all([
      Score.create({
        tetrisScore: 1500,
        regExScore: 300,
      }),
      Score.create({
        tetrisScore: 2400,
        regExScore: 700,
      }),
      Score.create({
        tetrisScore: 1200,
        regExScore: 400,
      }),
      Score.create({
        tetrisScore: 3000,
        regExScore: 500,
      }),
    ]);

    await sam.addScore(sam1);
    await sam.addScore(sam2);
    await mark.addScore(mark1);
    await alex.addScore(alex1);
  } catch (error) {
    console.log("seed didn't work");
    console.log(error);
  }
};

module.exports = seed;

if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seeding success!");
      db.close();
    })
    .catch((err) => {
      console.log("Oh noes! Something went wrong!");
      console.log(err);
      db.close();
    });
}
