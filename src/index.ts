import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";
import axios from "axios";
import {parallel} from "radash";

const webhookURL ="https://webhook.api.flowcore.io/event/jbiskur/bbd29d42-5558-49af-b9e4-736125bf273f/testing-flowtype/created?key=e746438a-711f-4382-9241-b130592cd907";

const connection = mysql.createPool({
  host: process.env.HOSTNAME,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: {
    verifyIdentity: true,
  },
})

const run = async () => {
  const results = await connection.query("SELECT * FROM ashamed_pine");

  await parallel(10, results[0] as any[], async (result) => {
    console.info(`SENDING ${JSON.stringify(result)}`);
    await axios.post(webhookURL,result);
  });

  await connection.end();
}

run().then(() => {
  console.log("Done!");
}).catch((e) => {
  // console.error(`Failed to run: ${e}`);
});
