import { NextRequest, NextResponse } from "next/server";
import { generateConversation, analyzePronunciation } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { scenario, expectedResponse, userResponse, focusWords } =
      await request.json();

    // Get pronunciation analysis
    const analysis = await analyzePronunciation(
      expectedResponse,
      userResponse,
      focusWords
    );

    // Generate contextual AI response
    const aiResponse = await generateConversation(
      scenario,
      "guard",
      userResponse
    );

    return NextResponse.json({
      score: analysis.score,
      feedback: analysis.feedback,
      improvements: analysis.improvements,
      aiResponse,
    });
  } catch (error) {
    console.error("Scenario feedback error:", error);
    return NextResponse.json(
      { error: "Failed to process scenario feedback" },
      { status: 500 }
    );
  }
}
