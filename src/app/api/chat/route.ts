// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  conversationId: string;
  scenarioId: string;
  userLevel: string;
  userDialect?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log(
      "Key starts with sk-:",
      process.env.OPENAI_API_KEY?.startsWith("sk-")
    );
    const supabase = createClient();

    // Get the Authorization header from the request
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization header" },
        { status: 401 }
      );
    }

    // Set the auth header for Supabase client
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ChatRequest = await request.json();
    const { messages, conversationId, scenarioId, userLevel, userDialect } =
      body;

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name, english_level, dialect, strengths, recommendations")
      .eq("id", user.id)
      .single();

    // Get scenario details
    const { data: scenario } = await supabase
      .from("scenarios")
      .select(
        "title, scenario_text, expected_response, cultural_context, difficulty, pronunciation_focus"
      )
      .eq("id", scenarioId)
      .single();

    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }

    // Create system prompt for the AI
    const systemPrompt = createSystemPrompt(
      scenario,
      profile,
      userLevel,
      userDialect
    );

    // Prepare messages for OpenAI
    const aiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
    ];

    // Call OpenAI
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

    // Save the conversation to database
    await saveConversationMessages(supabase, conversationId, user.id, [
      { role: "user", content: messages[messages.length - 1].content },
      { role: "assistant", content: assistantMessage },
    ]);

    // Analyze user's message for feedback (optional, runs async)
    analyzeUserMessage(
      supabase,
      conversationId,
      user.id,
      scenarioId,
      messages[messages.length - 1].content,
      scenario,
      profile
    );

    return NextResponse.json({
      message: assistantMessage,
      conversationId,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

function createSystemPrompt(
  scenario: any,
  profile: any,
  userLevel: string,
  userDialect?: string
) {
  const level = profile?.english_level || userLevel || "A1";
  const dialect = profile?.dialect || userDialect || "gulf";
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
  supabase: any,
  conversationId: string,
  userId: string,
  messages: ChatMessage[]
) {
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
      .single();

    if (existingConv) {
      const updatedData = [
        ...(existingConv.conversation_data || []),
        ...messages,
      ];
      await supabase
        .from("chat_conversations")
        .update({
          conversation_data: updatedData,
          total_messages: (existingConv.total_messages || 0) + messages.length,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    }
  } catch (error) {
    console.error("Error saving conversation:", error);
  }
}

async function analyzeUserMessage(
  supabase: any,
  conversationId: string,
  userId: string,
  scenarioId: string,
  userMessage: string,
  scenario: any,
  profile: any
) {
  try {
    // Create analysis prompt
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
    if (result) {
      const parsedAnalysis = JSON.parse(result);

      // Save assessment to database
      await supabase.from("chat_assessments").insert({
        conversation_id: conversationId,
        user_id: userId,
        scenario_id: scenarioId,
        grammar_score: parsedAnalysis.grammar_score,
        vocabulary_score: parsedAnalysis.vocabulary_score,
        fluency_score: parsedAnalysis.fluency_score,
        cultural_appropriateness_score:
          parsedAnalysis.cultural_appropriateness_score,
        overall_score: Math.round(
          (parsedAnalysis.grammar_score +
            parsedAnalysis.vocabulary_score +
            parsedAnalysis.fluency_score +
            parsedAnalysis.cultural_appropriateness_score) /
            4
        ),
        strengths: parsedAnalysis.strengths,
        areas_for_improvement: parsedAnalysis.areas_for_improvement,
        detailed_feedback: parsedAnalysis.specific_feedback,
        ai_assessment: parsedAnalysis,
      });
    }
  } catch (error) {
    console.error("Error analyzing message:", error);
  }
}
