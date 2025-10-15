import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

type ChatMsg = { role: "user" | "assistant"; text: string }

export async function POST(req: NextRequest) {
  const { messages }: { messages: ChatMsg[] } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "No messages provided or invalid format" }, { status: 400 })
  }

const quickActionAnswers: Record<string, string> = {
  "Check Coverage":
    "Use this feature to review staffing coverage across departments, shifts, or specific weekends. It automatically identifies gaps, highlights overstaffed or understaffed areas, and ensures compliance with defined coverage rules.",
    
  "Optimize Schedule":
    "This feature intelligently analyzes the current roster to balance workloads, distribute shifts fairly across staff levels, and ensure optimal coverage for all departments based on hospital guidelines.",
    
  "Compliance Audit":
    "Run a compliance audit to verify that your roster aligns with hospital staffing policies, labor regulations, and contractual obligations. The system will flag any conflicts or rule violations for your review.",
    
  "Generate Report":
    "Generate detailed, exportable reports summarizing staff allocations, coverage trends, weekend rotations, and compliance metrics. These reports support informed decision-making and audit readiness.",
    
  "Swap Request":
    "This feature enables staff to request and manage shift swaps with eligible colleagues. The system validates each swap request against scheduling rules to maintain fairness, balance, and compliance.",
    
  "Manual Adjustments":
    "Authorized users can make direct edits to the roster, such as reassigning shifts, adding new staff, or handling exceptions. Every change is tracked to maintain transparency and version control."
};


  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role === "user" && quickActionAnswers[lastMessage.text]) {
    return NextResponse.json({ reply: quickActionAnswers[lastMessage.text] })
  }

  const systemPrompt = `
You are the AI Copilot for St. Mary's Hospital Nurse Rostering App.

Your responses MUST be:
- Relevant only to hospital rostering, staff schedules, coverage, swaps, compliance, shifts, and rules.
- Actionable, friendly, and human-readable.
- Avoid unrelated topics, opinions, or generic answers.
- Follow all rules for IPS weekend, PH roster, ND (Night Duty), ED shifts, and staff exceptions.

If you do not have enough information to give exact staff names, provide guidance based on rules and suggest next steps (e.g., check roster or contact admin).
`

  try {
    // --- Send user messages to OpenAI GPT ---
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.text })),
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    console.log("OpenAI raw response:", data)

    const aiReply = data.choices?.[0]?.message?.content ?? "No response from AI."
    return NextResponse.json({ reply: aiReply })
  } catch (err) {
    console.error("OpenAI API error:", err)
    return NextResponse.json({ reply: "AI API error occurred." }, { status: 500 })
  }
}
