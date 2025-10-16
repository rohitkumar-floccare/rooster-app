// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import * as XLSX from "xlsx";
// import path from "path";
// import fs from "fs";

// type ChatMsg = { role: "user" | "assistant"; text: string };

// let rosterData: Record<string, any[]> | null = null;

// function loadRosterData() {
//   if (rosterData) return rosterData;

//   try {
//     const filePath = path.join(process.cwd(), "app", "api", "roster", "sample roster.xlsx");
//     const fileBuffer = fs.readFileSync(filePath);
//     const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//     const allSheets: Record<string, any[]> = {};

//     workbook.SheetNames.forEach((sheetName) => {
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);
//       allSheets[sheetName] = jsonData;
//     });

//     rosterData = allSheets;
//   } catch (err) {
//     rosterData = {};
//   }

//   return rosterData;
// }

// const quickActionAnswers: Record<string, string> = {
//   "Check Coverage":
//     "Review staffing coverage across all departments and shifts. It identifies gaps and ensures fair distribution.",
//   "Optimize Schedule":
//     "Analyzes the current roster to balance workloads and improve shift fairness.",
//   "Compliance Audit":
//     "Checks for any violations like insufficient rest or overbooked shifts.",
//   "Generate Report":
//     "Generates a summary of staff allocation, coverage, and shift balance.",
//   "Swap Request":
//     "Allows staff to request shift swaps and validates them against compliance rules.",
//   "Manual Adjustments":
//     "Admins can directly edit the roster for exceptions or emergency reassignments.",
// };

// export async function POST(req: NextRequest) {
//   const { messages }: { messages: ChatMsg[] } = await req.json();

//   if (!messages || !Array.isArray(messages)) {
//     return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
//   }

//   const lastMessage = messages[messages.length - 1];
//   if (lastMessage.role === "user" && quickActionAnswers[lastMessage.text]) {
//     return NextResponse.json({ reply: quickActionAnswers[lastMessage.text] });
//   }

//   const roster = loadRosterData();

//   const rosterPreview = JSON.stringify(roster.slice(0, 100), null, 2);

//   const systemPrompt = `
// You are the AI Copilot for Sengkang General Hospital's Nurse Rostering System.

// Use the following roster data to answer questions about schedules, shifts, duties, coverage, and compliance.

// If data is incomplete, respond with logical scheduling guidance and suggest next steps.

// Here is a sample of the loaded roster data (first 10 rows):
// ${rosterPreview}
// `;

//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: systemPrompt },
//           ...messages.map((m) => ({ role: m.role, content: m.text })),
//         ],
//         temperature: 0.7,
//       }),
//     });

//     const data = await response.json();
//     const aiReply = data.choices?.[0]?.message?.content ?? "No response from AI.";
//     return NextResponse.json({ reply: aiReply });
//   } catch (err) {
//     console.error("OpenAI API error:", err);
//     return NextResponse.json({ reply: "AI API error occurred." }, { status: 500 });
//   }
// }


import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

type ChatMsg = { role: "user" | "assistant"; text: string };

// Cache the roster to avoid reading the file every request
let rosterData: Record<string, any[]> | null = null;

function loadRosterData(): Record<string, any[]> {
  if (rosterData) return rosterData;

  try {
    const filePath = path.join(process.cwd(), "app", "api", "roster", "sample roster.xlsx");
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    const allSheets: Record<string, any[]> = {};
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      allSheets[sheetName] = jsonData;
    });

    rosterData = allSheets;
  } catch (err) {
    console.error("Error loading roster:", err);
    rosterData = {};
  }

  return rosterData;
}

const quickActionAnswers: Record<string, string> = {
  "Check Coverage":
    "Review staffing coverage across all departments and shifts. It identifies gaps and ensures fair distribution.",
  "Optimize Schedule":
    "Analyzes the current roster to balance workloads and improve shift fairness.",
  "Compliance Audit":
    "Checks for any violations like insufficient rest or overbooked shifts.",
  "Generate Report":
    "Generates a summary of staff allocation, coverage, and shift balance.",
  "Swap Request":
    "Allows staff to request shift swaps and validates them against compliance rules.",
  "Manual Adjustments":
    "Admins can directly edit the roster for exceptions or emergency reassignments.",
};

export async function POST(req: NextRequest) {
  const { messages }: { messages: ChatMsg[] } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
  }

  // Quick action replies
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === "user" && quickActionAnswers[lastMessage.text]) {
    return NextResponse.json({ reply: quickActionAnswers[lastMessage.text] });
  }

  // Load roster data
  const roster = loadRosterData();

  // Prepare a preview: first 5 rows of each sheet
  const rosterPreview = Object.fromEntries(
    Object.entries(roster).map(([sheetName, rows]) => [sheetName, rows.slice(0, 5)])
  );

  const systemPrompt = `
You are the AI Copilot for Sengkang General Hospital's Nurse Rostering System.

Use the following roster data to answer questions about schedules, shifts, duties, coverage, and compliance.

If data is incomplete, respond with logical scheduling guidance and suggest next steps.

Here is a sample of the loaded roster data:
${JSON.stringify(rosterPreview, null, 2)}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.text })),
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content ?? "No response from AI.";
    return NextResponse.json({ reply: aiReply });
  } catch (err) {
    console.error("OpenAI API error:", err);
    return NextResponse.json({ reply: "AI API error occurred." }, { status: 500 });
  }
}
