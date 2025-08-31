import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateConversation(
  scenario: string,
  userType: "guard" | "professional",
  userInput?: string
) {
  const systemPrompt =
    userType === "guard"
      ? `You are an AI English tutor helping mosque guards communicate with tourists. Be patient, respectful, and focus on practical phrases. Provide pronunciation tips for Arabic speakers. Always maintain Islamic values and cultural sensitivity.`
      : `You are an AI English tutor helping Arab business professionals improve their communication skills. Focus on professional language, cultural bridge explanations, and business scenarios.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Scenario: ${scenario}. User said: "${
          userInput || "I want to practice this scenario."
        }"`,
      },
    ],
    max_tokens: 300,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");
  formData.append("model", "whisper-1");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  return data.text || "";
}

export async function analyzePronunciation(
  originalText: string,
  spokenText: string,
  targetWords: string[]
): Promise<{
  score: number;
  feedback: string;
  improvements: string[];
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a pronunciation coach for Arabic speakers learning English. Compare the original text with what was spoken and provide constructive feedback focusing on common Arabic-to-English pronunciation challenges.",
      },
      {
        role: "user",
        content: `Original: "${originalText}"\nSpoken: "${spokenText}"\nTarget words to focus on: ${targetWords.join(
          ", "
        )}`,
      },
    ],
    max_tokens: 200,
  });

  const feedback = response.choices[0]?.message?.content || "";

  // Simple scoring algorithm (improve this later)
  const similarity = calculateSimilarity(
    originalText.toLowerCase(),
    spokenText.toLowerCase()
  );
  const score = Math.round(similarity * 100);

  return {
    score,
    feedback,
    improvements: extractImprovements(feedback),
  };
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

function extractImprovements(feedback: string): string[] {
  // Simple extraction - improve with better NLP later
  const improvements = [];
  if (feedback.includes("th")) improvements.push("Practice TH sounds");
  if (feedback.includes("p") || feedback.includes("b"))
    improvements.push("Distinguish P and B sounds");
  if (feedback.includes("stress"))
    improvements.push("Work on word stress patterns");
  return improvements;
}
