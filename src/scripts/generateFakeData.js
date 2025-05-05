import { faker } from "@faker-js/faker";
import pool from "../db/pool.js";

const NUM_CAPSULES = 100_000;
const NUM_MEMORIES = 10;

async function insertData() {
  console.time("Data generation");
  for (let i = 0; i < NUM_CAPSULES; i++) {
    const title = faker.lorem.words(3);
    const date = faker.date.past();
    const status = faker.helpers.arrayElement(["Locked", "Unlocked"]);
    const description = faker.lorem.paragraph();

    const capsuleRes = await pool.query(
      `INSERT INTO time_capsules (capsule_title, capsule_date, capsule_status, capsule_description)
        VALUES ($1, $2, $3, $4) RETURNING capsule_id`,
      [title, date.toISOString().split("T")[0], status, description]
    );

    const capsuleId = capsuleRes.rows[0].capsule_id;

    const memoryInserts = [];
    for (let j = 0; j < NUM_MEMORIES; j++){
        memoryInserts.push(pool.query(
            `INSERT INTO memories (capsule_id, file_name, file_path, file_type, file_size, uploaded_at)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                capsuleId,
                faker.system.fileName(),
                `/uploades/${faker.string.uuid()}.jpg`,
                `image/jpeg`,
                faker.number.int({min: 10000, max:5000000}),
                faker.date.recent(90).toISOString()
            ]
        ));
    }

    await Promise.all(memoryInserts);

    if (i % 1000 === 0) console.log(`Inserted ${i} capsules...`);
  }

  console.timeEnd("Data generation");
  await pool.end();
}

insertData().catch(console.error);
