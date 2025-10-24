// cronJob.js
const cron = require("node-cron");
const axios = require("axios");

cron.schedule('*/2 * * * *', async () => {
  console.log("Running a task every 2 minutes");
  try {
    const response = await axios.get("http://frontend:3000/api/jenkins/cron");

    console.log("Response received:", response.data);

  } catch (error) {
    console.error("Error making the request:", error);
  }
});

