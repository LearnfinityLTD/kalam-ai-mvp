// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ===========================
   Types
   =========================== */

type ChatRole = "user" | "assistant" | "system";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  conversationId: string;
  scenarioId: string;
  userLevel: string;
  userDialect?: string;
}

type Segment = "guard" | "professional";

type Level = "A1" | "A2" | "B1" | "B2" | "C1";
type Dialect = "gulf" | "egyptian" | "levantine" | "standard";

interface UserProfileRow {
  full_name: string | null;
  english_level: Level | null;
  dialect: Dialect | null;
  strengths: string[] | null;
  recommendations: string[] | null;
}

interface ScenarioRow {
  title: string;
  scenario_text: string;
  expected_response: string | null;
  cultural_context: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  pronunciation_focus: string[] | null;
}

interface ChatConversationRow {
  conversation_data: unknown[] | null;
  total_messages: number | null;
}

interface ParsedAnalysis {
  grammar_score: number;
  vocabulary_score: number;
  fluency_score: number;
  cultural_appropriateness_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  specific_feedback: string;
  // allow any extra keys from the model output
  [k: string]: unknown;
}

/* ===========================
   Route
   =========================== */

export async function POST(request: NextRequest) {
  try {
    console.log("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log(
      "Key starts with sk-:",
      process.env.OPENAI_API_KEY?.startsWith("sk-")
    );

    const supabase: SupabaseClient = createClient();

    // Auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization header" },
        { status: 401 }
      );
    }

    // Validate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Body
    const body = (await request.json()) as ChatRequest;
    const { messages, conversationId, scenarioId, userLevel, userDialect } =
      body;

    // Profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name, english_level, dialect, strengths, recommendations")
      .eq("id", user.id)
      .single<UserProfileRow>();

    // Scenario
    const { data: scenario } = await supabase
      .from("scenarios")
      .select(
        "title, scenario_text, expected_response, cultural_context, difficulty, pronunciation_focus"
      )
      .eq("id", scenarioId)
      .single<ScenarioRow>();

    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }

    // System prompt
    const systemPrompt = createSystemPrompt(
      scenario,
      profile ?? null,
      userLevel,
      userDialect
    );

    // OpenAI messages
    const aiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as ChatRole,
        content: msg.content,
      })),
    ];

    // OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: aiMessages,
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I didn't understand that.";

    // Persist chat messages
    await saveConversationMessages(supabase, conversationId, user.id, [
      { role: "user", content: messages[messages.length - 1].content },
      { role: "assistant", content: assistantMessage },
    ]);

    // Fire-and-forget analysis (no await by design)
    void analyzeUserMessage(
      supabase,
      conversationId,
      user.id,
      scenarioId,
      messages[messages.length - 1].content,
      scenario,
      profile ?? null
    );

    return NextResponse.json({
      message: assistantMessage,
      conversationId,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

/* ===========================
   Helpers
   =========================== */

function createSystemPrompt(
  scenario: ScenarioRow,
  profile: UserProfileRow | null,
  userLevel: string,
  userDialect?: string
): string {
  const level = profile?.english_level || (userLevel as Level) || "A1";
  const dialect = profile?.dialect || (userDialect as Dialect) || "gulf";
  const strengths = profile?.strengths || [];
  const name = profile?.full_name || "Student";

  return `You are an expert English conversation partner for Arabic speakers working in security/professional roles in the UAE/Gulf region.

SCENARIO CONTEXT:
- Title: ${scenario.title}
- Situation: ${scenario.scenario_text}
- Expected Response Style: ${
    scenario.expected_response || "Professional and polite"
  }
- Cultural Context: ${scenario.cultural_context || "UAE workplace environment"}
- Difficulty: ${scenario.difficulty}
- Pronunciation Focus: ${
    scenario.pronunciation_focus?.join(", ") || "General clarity"
  }

STUDENT PROFILE:
- Name: ${name}
- English Level: ${level}
- Arabic Dialect: ${dialect}
- Strengths: ${strengths.join(", ") || "Developing"}

INSTRUCTIONS:
1. Stay in character as the person described in the scenario
2. Respond naturally and realistically to the student's English
3. Adjust complexity to their ${level} level - use appropriate vocabulary and grammar
4. Provide gentle corrections when needed, formatted as: "Great! You could also say: [correction]"
5. If they make cultural mistakes, gently guide them: "In UAE workplace culture, you might say..."
6. Keep responses conversational and encouraging
7. If they're struggling, offer 2-3 word/phrase suggestions
8. Occasionally acknowledge their Arabic background positively
9. End responses with a natural follow-up question when appropriate

RESPONSE STYLE:
- Be patient and supportive
- Mix encouragement with practical corrections
- Use context clues to understand their intent even with errors
- Stay realistic to the scenario situation
- Keep responses under 3 sentences unless giving detailed feedback`;
}

async function saveConversationMessages(
  supabase: SupabaseClient,
  conversationId: string,
  _userId: string, // not used here, kept for signature parity
  messages: ChatMessage[]
): Promise<void> {
  try {
    // Save individual messages
    const messageInserts = messages.map((msg) => ({
      conversation_id: conversationId,
      role: msg.role,
      content: msg.content,
      metadata: {},
    }));

    await supabase.from("chat_messages").insert(messageInserts);

    // Update conversation metadata
    const { data: existingConv } = await supabase
      .from("chat_conversations")
      .select("conversation_data, total_messages")
      .eq("id", conversationId)
      .single<ChatConversationRow>();

    if (existingConv) {
      const updatedData = [
        ...((existingConv.conversation_data as ChatMessage[] | null) ?? []),
        ...messages,
      ];

      await supabase
        .from("chat_conversations")
        .update({
          conversation_data: updatedData,
          total_messages: (existingConv.total_messages ?? 0) + messages.length,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    }
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error saving conversation:", err);
  }
}

async function analyzeUserMessage(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
  scenarioId: string,
  userMessage: string,
  scenario: ScenarioRow,
  profile: UserProfileRow | null
): Promise<void> {
  try {
    // Build analysis prompt
    const analysisPrompt = `Analyze this English message from an Arabic speaker (${
      profile?.english_level || "A1"
    } level):

Message: "${userMessage}"

Scenario Context: ${scenario.scenario_text}

Provide analysis in JSON format:
{
  "grammar_score": 0-100,
  "vocabulary_score": 0-100,
  "fluency_score": 0-100,
  "cultural_appropriateness_score": 0-100,
  "strengths": ["strength1", "strength2"],
  "areas_for_improvement": ["area1", "area2"],
  "specific_feedback": "detailed feedback"
}`;

    const analysis = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: analysisPrompt }],
      temperature: 0.3,
    });

    const result = analysis.choices[0]?.message?.content;
    if (!result) return;

    // Parse JSON (best-effort)
    const parsed = JSON.parse(result) as ParsedAnalysis;

    // Save assessment
    await supabase.from("chat_assessments").insert({
      conversation_id: conversationId,
      user_id: userId,
      scenario_id: scenarioId,
      grammar_score: parsed.grammar_score,
      vocabulary_score: parsed.vocabulary_score,
      fluency_score: parsed.fluency_score,
      cultural_appropriateness_score: parsed.cultural_appropriateness_score,
      overall_score: Math.round(
        (parsed.grammar_score +
          parsed.vocabulary_score +
          parsed.fluency_score +
          parsed.cultural_appropriateness_score) /
          4
      ),
      strengths: parsed.strengths,
      areas_for_improvement: parsed.areas_for_improvement,
      detailed_feedback: parsed.specific_feedback,
      ai_assessment: parsed,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error analyzing message:", err);
  }
}
