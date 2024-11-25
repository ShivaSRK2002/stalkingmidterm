import { decryptToken } from "../authUtils";

 
export async function fetchMessageHistory(senderId, receiverId, lastEvaluatedKey = null, limit = 10) {
  const jwtToken = sessionStorage.getItem('jwt');  
  const token = decryptToken(jwtToken);
  try {
    
    const response = await fetch("https://8jtaj9psal.execute-api.eu-west-1.amazonaws.com/Dev", {
      method: "POST",
      headers: {
      'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
 