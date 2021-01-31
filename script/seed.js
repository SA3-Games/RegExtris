const { db, Player, Session, Score } = require("../server/db");

const seed = async () => {
  try {
    await db.sync({ force: true });
    const [sam, mark, alex, julie] = await Promise.all([
      Player.create({
        name: "Sam",
        email: "sam@email.com",
        password: "12345",
      }),
      Player.create({
        email: "mark@email.com",
        name: "mark",
        password: "12345",
      }),
      Player.create({
        email: "alex@email.com",
        name: "alex",
        password: "12345",
      }),
      Player.create({
        email: "julie@email.com",
        name: "julie",
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

    const [session1, session2] = await Promise.all([
      Session.create(),
      Session.create(),
    ]);

    await sam.addScore(sam1);
    await sam.addScore(sam2);
    await mark.addScore(mark1);
    await alex.addScore(alex1);

    await sam.addSession(session1);
    await mark.addSession(session1);
    await alex.addSession(session1);
    await julie.addSession(session1);

    await sam1.addSession(session1);
    await mark1.addSession(session1);
    await alex1.addSession(session1);
  } catch (error) {
    console.log("seed didn't work");
    console.err(error);
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
      console.error("Oh noes! Something went wrong!");
      console.error(err);
      db.close();
    });
}