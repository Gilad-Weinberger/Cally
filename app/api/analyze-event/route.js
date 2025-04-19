import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Initialize Gemini client using server-side environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE",
    },
  ],
});

export async function POST(request) {
  try {
    const { prompt, partialEventData, calendarId, userId } =
      await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Get user's color codes if available
    let colorCodes = {};
    if (userId) {
      try {
        const colorCodesQuery = query(
          collection(db, "colorCodes"),
          where("userId", "==", userId)
        );
        const colorCodesSnapshot = await getDocs(colorCodesQuery);
        if (!colorCodesSnapshot.empty) {
          colorCodes = colorCodesSnapshot.docs[0].data().colorCodes || {};
        }
      } catch (error) {
        console.error("Error fetching color codes:", error);
      }
    }

    // Get current date and time for context
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM
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

    // Prepare the system message with color code information
    let systemMessage = `You are an AI assistant that helps users create calendar events from natural language descriptions. 
    
    CURRENT DATE AND TIME CONTEXT:
    - Today is ${dayOfWeek}, ${monthName} ${dayOfMonth}, ${year}
    - Current date: ${currentDate}
    - Current time: ${currentTime}
    
    Extract the following information from the user's input:
    - title: The title of the event (e.g., "Game", "Doctor's Appointment", "Team Meeting")
    - startDate: The start date in YYYY-MM-DD format
    - endDate: The end date in YYYY-MM-DD format
    - startTime: The start time in HH:MM format (24-hour)
    - endTime: The end time in HH:MM format (24-hour)
    - color: A color for the event (only in HEX format (#000000), if not specified, use a default color like #007AFF)

    If the user provides a color category (e.g., "work", "personal", "family"), use the corresponding color code from the color-codes dict.
    
    IMPORTANT INSTRUCTIONS FOR PARSING:
    1. For time durations:
       - When users mention duration (e.g., "2 hour meeting", "4 hour game"), calculate the endTime by adding the duration to startTime
       - Example: "4 hour game at 10am" → startTime: "10:00", endTime: "14:00"
    
    2. For relative dates:
       - "today" → ${currentDate}
       - "tomorrow" → [calculate tomorrow's date]
       - "next [day of week]" → [calculate the date of the next occurrence]
       - "in X days/weeks/months" → [calculate the future date]
    
    3. For ambiguous times:
       - AM/PM indicators should be properly interpreted (e.g., "10am" → "10:00", "3pm" → "15:00")
       - If no AM/PM is specified, make a reasonable assumption based on the event type
    
    4. For event titles:
       - Extract a concise, meaningful title from the description
       - Example: "I have a doctor's appointment" → title: "Doctor's Appointment"
       - Example: "i got a 4 hour game tomorrow at 10am" → title: "Game"
    
    5. For all-day events:
       - If the user mentions "all day" or indicates it's a full-day event, set:
       → startTime: "0:00"
       → endTime: "23:59"
       - Example: "vacation day tomorrow all day" → startTime: "00:00", endTime: "23:59"
    
    EXAMPLE TRANSFORMATIONS:
    1. "i got a 4 hour game tomorrow at 10am"
       → {"title": "Game", "startDate": "[tomorrow's date]", "endDate": "[tomorrow's date]", "startTime": "10:00", "endTime": "14:00", "color": defaultColor || correspondingColor}
    
    2. "meeting with team on friday at 2pm for 1 hour"
       → {"title": "Team Meeting", "startDate": "[next friday's date]", "endDate": "[next friday's date]", "startTime": "14:00", "endTime": "15:00", "color": defaultColor || correspondingColor}
    
    3. "dentist appointment next tuesday at 9am"
       → {"title": "Dentist Appointment", "startDate": "[next tuesday's date]", "endDate": "[next tuesday's date]", "startTime": "09:00", "endTime": "10:00", "color": defaultColor || correspondingColor}
    
    Always return a valid JSON object with these fields. If information is missing, make reasonable assumptions based on context.`;

    // Add color code information if available
    if (Object.keys(colorCodes).length > 0) {
      systemMessage +=
        "\n\nThe user has the following color categories defined:";
      for (const [category, color] of Object.entries(colorCodes)) {
        systemMessage += `\n- ${category}: ${color}`;
      }
      systemMessage +=
        "\n\nIf the event matches one of these categories, use the corresponding color.";
    }

    // If we have partial data, include it in the system message
    if (partialEventData) {
      systemMessage +=
        "\n\nThe user has already provided the following information:";
      for (const [key, value] of Object.entries(partialEventData)) {
        if (value) {
          systemMessage += `\n- ${key}: ${value}`;
        }
      }
    }

    // Call Gemini API to analyze the prompt
    const combinedPrompt = `${systemMessage}\n\nUser input: ${prompt}`;

    const result = await model.generateContent(combinedPrompt);

    // Parse the response
    let eventData;

    try {
      // Get the response text and extract JSON from markdown if needed
      const responseText = result.response.text();
      // Remove markdown code block if present
      const jsonContent = responseText.replace(/^```json\n|```$/gm, "").trim();
      eventData = JSON.parse(jsonContent);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      return NextResponse.json(
        { error: "Failed to parse event data" },
        { status: 500 }
      );
    }

    // Set default dates if not provided
    if (!eventData.startDate) {
      const today = new Date();
      eventData.startDate = today.toISOString().split("T")[0];
    }

    if (!eventData.endDate) {
      eventData.endDate = eventData.startDate;
    }

    // Set default times if not provided
    if (!eventData.startTime) {
      eventData.startTime = "09:00";
    }

    if (!eventData.endTime) {
      // Default to 1 hour after start time
      const [hours, minutes] = eventData.startTime.split(":").map(Number);
      const endHour = (hours + 1) % 24;
      eventData.endTime = `${endHour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }

    // Merge with partial data if available
    if (partialEventData) {
      eventData = { ...partialEventData, ...eventData };
    }

    return NextResponse.json(eventData);
  } catch (error) {
    console.error("Error processing event:", error);
    return NextResponse.json(
      { error: "Failed to process event" },
      { status: 500 }
    );
  }
}
