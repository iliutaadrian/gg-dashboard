// cronJob.js
const cron = require("node-cron");
const axios = require("axios");

cron.schedule("*/10 * * * * *", async () => {
  try {
    const response = await axios.get("http://nextjs:3000/api/jenkins/cron");
    console.log("Response received:", response.data);

  } catch (error) {
    console.error("Error making the request:", error);
  }
});

