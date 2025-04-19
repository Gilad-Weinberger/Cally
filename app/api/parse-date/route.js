import { GoogleGenerativeAI } from "@google/generative-ai";

// Use a server-side environment variable (without NEXT_PUBLIC_ prefix)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { dateText } = await request.json();
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][now.getDay()];
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][now.getMonth()];
    const dayOfMonth = now.getDate();
    const year = now.getFullYear();

    // Create a clear prompt with examples and current date context
    const prompt = `You are a date formatting assistant. Your task is to parse the given date expression and return ONLY a valid ISO date string (YYYY-MM-DD). Do not include any additional text or explanation.

CURRENT DATE CONTEXT:
- Today is ${dayOfWeek}, ${monthName} ${dayOfMonth}, ${year}
- Current date: ${currentDate}

Date Parsing Rules:

Preprocessing:
- Ignore any non-date characters at the beginning of the input (e.g., ".may 2nd 2028" should be treated as "may 2nd 2028")
- Recognize month names regardless of capitalization (e.g., "may" should be treated the same as "May")

Date Format Assumptions:
- If the format is DD/MM/YYYY, assume the first number is the day and the second is the month (e.g., "2/5/2023" → 2023-05-02 for May 2nd, NOT February 5th)
- If the format is YYYY-MM-DD, assume it is already in ISO format
- Accept both full month names ("May 2nd 2028") and abbreviated names ("2nd May 2028")
- Recognize ordinal numbers (e.g., "2nd", "5th", "21st")

Relative Dates Support:
"tomorrow" → [date 1 day ahead of ${currentDate}]
"yesterday" → [date 1 day before ${currentDate}]
"next Monday" → [upcoming Monday's date from ${currentDate}]
"last Friday" → [previous Friday's date from ${currentDate}]
"in 3 days" → [${currentDate} + 3 days]

Example Inputs to Handle:
- ".may 2nd 2028" → 2028-05-02 (ignore leading dot, recognize lowercase month)
- "may 15th, 2023" → 2023-05-15 (recognize lowercase month)
- "!tomorrow" → [date 1 day ahead of ${currentDate}] (ignore leading special character)
- "2/5/2023" → 2023-05-02 (standard date format)

Expected Outputs
Return ONLY the correctly formatted ISO date string (YYYY-MM-DD).
If the input cannot be parsed, return exactly the string of "${currentDate}".

Parse this date: "${dateText}"`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/\n/g, "");

    // Validate the returned date
    const isValidDate = (dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day &&
        year >= 1000 &&
        year <= 9999 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
      );
    };
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    // check if the format is correct
    if (!dateRegex.test(text)) {
      // Return today's date as fallback
      const today = new Date().toISOString().split("T")[0];
      return Response.json({ date: today });
    }

    console.log("Parsed date:", text);
    return Response.json({ date: text });
  } catch (error) {
    console.error("Error parsing date:", error);
    return Response.json({ error: "Failed to parse date" }, { status: 500 });
  }
}
