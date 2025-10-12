// app/api/check-plagiarism/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, courseUrl } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
    if (!apiKey) {
      console.error("RAPIDAPI_KEY not configured");
      return NextResponse.json(
        { error: "Plagiarism API not configured" },
        { status: 500 }
      );
    }

    // Call Plagiarism Checker API
    const response = await fetch(
      "https://plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com/plagiarism",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host":
            "plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com",
        },
        body: JSON.stringify({
          text: text,
          language: "en",
          includeCitations: false,
          scrapeSources: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Plagiarism API error:", errorData);
      return NextResponse.json(
        { error: "Failed to check plagiarism" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Calculate plagiarism percentage
    // The API returns percentPlagiarism or we calculate from results
    const plagiarismScore = data.percentPlagiarism || 0;

    return NextResponse.json({
      score: Math.round(plagiarismScore),
      sources: data.sources || [],
      details: data,
    });
  } catch (error) {
    console.error("Plagiarism check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
