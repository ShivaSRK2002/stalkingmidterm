export async function fetchMessageHistory(senderId, receiverId, lastEvaluatedKey = null, limit = 10) {
  try {
    const response = await fetch("https://8jtaj9psal.execute-api.eu-west-1.amazonaws.com/Dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlODMxZjMyMC0zMDQxLTcwYzctYjcxYS0zZGUzNjc1ZDVkNmMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjBcLzEwXC8yMDAyIiwiZ2VuZGVyIjoiTWFsZSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX1FQdUpmT2FGYyIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiJlODMxZjMyMC0zMDQxLTcwYzctYjcxYS0zZGUzNjc1ZDVkNmMiLCJvcmlnaW5fanRpIjoiNDkyODQ1MTUtNjQ4ZC00N2EzLTljYTItZTM5NzZhYzZhMWNmIiwiYXVkIjoiMm1udjE3dm9hN2U4cTZiYW5sZzBqMHF0aCIsImV2ZW50X2lkIjoiYWQzYWRmOGItNjA4Mi00NGI4LTlmMWMtNGUxZDU0NjFkZTM5IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MzIwNzc5MzIsIm5hbWUiOiJTaGl2YSIsInBob25lX251bWJlciI6Iis5MTg4MjU3OTIyNjUiLCJleHAiOjE3MzIxNjQzMzIsImN1c3RvbTpyb2xlIjoidXNlciIsImlhdCI6MTczMjA3NzkzMiwianRpIjoiMmY4MDYzY2QtOTM2Yi00MjA1LTg3OTctY2JhZGJhZGZlZDc2IiwiZW1haWwiOiJzaGl2YXJhbWFrcnNobm5AZ21haWwuY29tIn0.BFXiE_aUW2_u1slt8gTjs9THcDTGmbJ5kG0OTJaJ3Tqzchem2nhQRySfPGqbw0Cc0KJ1ycAkG1zsv2COfaMjMC1T4Uw85OaG0c7urYWOtnk2e2QQ5S4LZ87BRd9jlf5FlDMJFxznnPTnGH5OTlDSUAozINJkEEO1sHcPlrRwTpeG6nhif_AsC1bCyeONy-HCdCjR8g17vT7kGBjsb1lKezEMpKx6rY4x14eEOaBf_YVG10ylB6yTFeCXvkCGrABDyVHdZ9Cvr6qA0jTcmjEL6yLM5uoSqiuaJddIYylsGFnK2W7bpI7AUn3tKp3HUsE5xGW3Ir3UQNsXo3h4VQ87Cw",
      },
      body: JSON.stringify({
        senderId: senderId,
        receiverId: receiverId,
        lastEvaluatedKey: lastEvaluatedKey, // Pass last evaluated key for pagination
        limit: limit,
      }),
    });
 
    if (!response.ok) {
      throw new Error("Failed to fetch message history.");
    }
 
    const responseBody = await response.json();
    const data = JSON.parse(responseBody.body);
 
    const messages = data.messages.map((msg) => {
      // Convert the timestamp to a Date object
      const date = new Date(msg.timestamp);
      console.log(date);
      // Adjust to IST (UTC + 5:30)
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(date.getTime() + istOffset);
      console.log(istDate);
      // Format the IST date to a readable string and update the message object
      msg.timestamp = istDate; // Format as 'YYYY-MM-DD HH:MM:SS'
      console.log(msg.timestamp);
      return msg;
    });
 
    const newLastEvaluatedKey = data.lastEvaluatedKey || null;
 
    console.log("Converted messages:", messages);
    console.log("Extracted lastEvaluatedKey:", newLastEvaluatedKey);
 
    return { messages, lastEvaluatedKey: newLastEvaluatedKey };
  } catch (error) {
    console.error("Error fetching message history:", error);
    return { messages: [], lastEvaluatedKey: null };
  }
}
 