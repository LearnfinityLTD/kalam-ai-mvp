// AI-Powered Learning Path Generator for Kalam AI
// This service analyzes user assessments and generates personalized learning paths

import { OpenAI } from "openai";
import { createClient } from "@/lib/supabase";

interface UserProfile {
  id: string;
  user_type: "guard" | "professional" | "tourist_guide";
  full_name: string;
  dialect: "gulf" | "egyptian" | "levantine" | "standard";
  english_level: "A1" | "A2" | "B1" | "B2" | "C1";
  assessment_score: number;
  strengths: string[];
  recommendations: string[];
  total_challenges_completed: number;
  average_challenge_score: number;
  specialization?: string;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  level: string;
  segment: string;
  estimated_hours: number;
  path_type:
    | "cultural_heritage"
    | "religious_tourism"
    | "adventure_tourism"
    | "modern_tourism";
  specialization: string;
  total_modules: number;
}

interface ScoredLearningPath extends LearningPath {
  score: number;
}

interface PersonalizedPathRecommendation {
  primaryPath: LearningPath;
  secondaryPaths: LearningPath[];
  customModules: CustomModule[];
  priorityAreas: string[];
  estimatedTimeToComplete: number;
  confidence: number;
  reasoning: string;
}

interface CustomModule {
  title: string;
  description: string;
  focus_areas: string[];
  estimated_duration: number;
  difficulty: string;
  priority: "high" | "medium" | "low";
}

interface AIAnalysis {
  pathRecommendations: Array<{
    pathName: string;
    score: number;
    reasoning: string;
  }>;
  focusAreas: string[];
  customModules: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  reasoning: string;
  timeAdjustment: number;
}

interface Module {
  id: string;
}

interface Scenario {
  id: string;
  title: string;
  difficulty: string;
  module_id: string;
}

class AILearningPathGenerator {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generatePersonalizedPath(
    user: UserProfile,
    availablePaths: LearningPath[]
  ): Promise<PersonalizedPathRecommendation> {
    // Filter paths by user type and level appropriateness
    const relevantPaths = this.filterRelevantPaths(user, availablePaths);

    if (relevantPaths.length === 0) {
      throw new Error("No suitable learning paths found for user profile");
    }

    // Generate AI recommendations
    const aiAnalysis = await this.getAIRecommendations(user, relevantPaths);

    // Apply business logic and scoring
    const scoredPaths = this.scorePaths(user, relevantPaths, aiAnalysis);

    if (scoredPaths.length === 0) {
      throw new Error("No paths available after scoring");
    }

    // Generate custom modules based on weaknesses
    const customModules = await this.generateCustomModules(user, aiAnalysis);

    return {
      primaryPath: scoredPaths[0],
      secondaryPaths: scoredPaths.slice(1, 3),
      customModules,
      priorityAreas: this.extractPriorityAreas(user, aiAnalysis),
      estimatedTimeToComplete: this.calculateEstimatedTime(
        user,
        scoredPaths[0]
      ),
      confidence: this.calculateConfidence(user, aiAnalysis),
      reasoning:
        aiAnalysis.reasoning ||
        "AI recommendation based on user profile analysis",
    };
  }

  private filterRelevantPaths(
    user: UserProfile,
    paths: LearningPath[]
  ): LearningPath[] {
    return paths.filter((path) => {
      // Filter by user segment
      if (path.segment !== user.user_type && path.segment !== "professional")
        return false;

      // Filter by level appropriateness (allow current level + 1 level up)
      const levels = ["A1", "A2", "B1", "B2", "C1"];
      const userLevelIndex = levels.indexOf(user.english_level);
      const pathLevelIndex = levels.indexOf(path.level);

      // Allow current level or up to 1 level higher
      return pathLevelIndex <= userLevelIndex + 1;
    });
  }

  private async getAIRecommendations(
    user: UserProfile,
    paths: LearningPath[]
  ): Promise<AIAnalysis> {
    const prompt = `
    Analyze this user's English learning profile and recommend the best learning path:

    USER PROFILE:
    - Role: ${user.user_type}
    - English Level: ${user.english_level} 
    - Assessment Score: ${user.assessment_score}%
    - Arabic Dialect: ${user.dialect}
    - Strengths: ${user.strengths.join(", ") || "None identified"}
    - Current Recommendations: ${user.recommendations.join(", ") || "None"}
    - Challenges Completed: ${user.total_challenges_completed}
    - Average Score: ${user.average_challenge_score}%

    AVAILABLE LEARNING PATHS:
    ${paths
      .map(
        (p) => `
    - ${p.name}: ${p.description}
      Level: ${p.level}, Type: ${p.path_type}, Hours: ${p.estimated_hours}
      Specialization: ${p.specialization}
    `
      )
      .join("\n")}

    Please provide:
    1. Top 3 recommended paths with scoring (1-100)
    2. Specific focus areas this user should prioritize
    3. Custom module suggestions for their weak areas
    4. Reasoning for recommendations
    5. Estimated completion time adjustments

    Respond in JSON format:
    {
      "pathRecommendations": [
        {"pathName": "...", "score": 85, "reasoning": "..."}
      ],
      "focusAreas": ["...", "..."],
      "customModules": [
        {"title": "...", "description": "...", "priority": "high"}
      ],
      "reasoning": "...",
      "timeAdjustment": 1.2
    }
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      return JSON.parse(content) as AIAnalysis;
    } catch (error) {
      console.error("AI recommendation error:", error);
      // Fallback to basic recommendations
      return this.getFallbackRecommendations(user, paths);
    }
  }

  private getFallbackRecommendations(
    user: UserProfile,
    paths: LearningPath[]
  ): AIAnalysis {
    // Simple fallback logic when AI fails
    const topPaths = paths.slice(0, 3).map((path, index) => ({
      pathName: path.name,
      score: 80 - index * 10,
      reasoning: `Suitable for ${user.user_type} at ${user.english_level} level`,
    }));

    return {
      pathRecommendations: topPaths,
      focusAreas: user.recommendations.slice(0, 3),
      customModules: [
        {
          title: "Foundation Building",
          description: "Basic skill reinforcement",
          priority: "high" as const,
        },
      ],
      reasoning: "Fallback recommendation based on user profile matching",
      timeAdjustment: 1.0,
    };
  }

  private scorePaths(
    user: UserProfile,
    paths: LearningPath[],
    aiAnalysis: AIAnalysis
  ): LearningPath[] {
    const scored: ScoredLearningPath[] = paths.map((path) => {
      let score = 0;

      // Base score from AI
      const aiRec = aiAnalysis.pathRecommendations?.find(
        (r) => r.pathName === path.name
      );
      score += aiRec?.score || 50;

      // Boost for exact role match
      if (path.segment === user.user_type) score += 20;

      // Boost for level appropriateness
      if (path.level === user.english_level) score += 15;

      // Boost for dialect compatibility
      if (this.isDialectCompatible(user.dialect, path.specialization))
        score += 10;

      // Boost for strength alignment
      if (this.alignsWithStrengths(user.strengths, path.path_type)) score += 15;

      // Penalty for too advanced
      const levels = ["A1", "A2", "B1", "B2", "C1"];
      const levelDiff =
        levels.indexOf(path.level) - levels.indexOf(user.english_level);
      if (levelDiff > 1) score -= 30;

      return { ...path, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .map(({ score, ...path }) => path);
  }

  private async generateCustomModules(
    user: UserProfile,
    aiAnalysis: AIAnalysis
  ): Promise<CustomModule[]> {
    const weakAreas = this.identifyWeakAreas(user);

    return (
      aiAnalysis.customModules?.map((module) => ({
        title: module.title,
        description: module.description,
        focus_areas: weakAreas,
        estimated_duration: 20, // Default 20 minutes
        difficulty: user.english_level,
        priority: module.priority,
      })) || []
    );
  }

  private identifyWeakAreas(user: UserProfile): string[] {
    const allPossibleAreas = [
      "Grammar",
      "Vocabulary",
      "Pronunciation",
      "Listening",
      "Cultural Sensitivity",
      "Professional Communication",
      "Tourism Terminology",
      "Religious Context",
    ];

    // Return areas not in strengths
    return allPossibleAreas.filter(
      (area) =>
        !user.strengths.some((strength) =>
          strength.toLowerCase().includes(area.toLowerCase())
        )
    );
  }

  private extractPriorityAreas(
    user: UserProfile,
    aiAnalysis: AIAnalysis
  ): string[] {
    return aiAnalysis.focusAreas || user.recommendations || [];
  }

  private calculateEstimatedTime(
    user: UserProfile,
    path: LearningPath
  ): number {
    let baseTime = path.estimated_hours;

    // Adjust based on user's current level vs path level
    const levels = ["A1", "A2", "B1", "B2", "C1"];
    const levelDiff =
      levels.indexOf(path.level) - levels.indexOf(user.english_level);

    if (levelDiff > 0) baseTime *= 1 + levelDiff * 0.3;
    if (user.assessment_score < 50) baseTime *= 1.2;

    return Math.round(baseTime);
  }

  private calculateConfidence(
    user: UserProfile,
    aiAnalysis: AIAnalysis
  ): number {
    let confidence = 70; // Base confidence

    if (user.assessment_score > 70) confidence += 20;
    if (user.total_challenges_completed > 5) confidence += 10;
    if (user.strengths.length >= 2) confidence += 10;

    return Math.min(confidence, 95);
  }

  private isDialectCompatible(
    dialect: string,
    specialization: string
  ): boolean {
    const dialectMappings = {
      gulf: ["Red Sea", "NEOM", "Riyadh"],
      egyptian: ["AlUla", "Cultural", "Heritage"],
      levantine: ["Business", "Professional"],
      standard: ["Islamic", "Religious", "Hajj"],
    };

    return (
      dialectMappings[dialect as keyof typeof dialectMappings]?.some(
        (keyword) => specialization.includes(keyword)
      ) || false
    );
  }

  private alignsWithStrengths(strengths: string[], pathType: string): boolean {
    const alignments = {
      cultural_heritage: ["Cultural Sensitivity", "Situational Response"],
      religious_tourism: ["Cultural Sensitivity", "Islamic Heritage"],
      adventure_tourism: ["Problem Solving", "Communication"],
      modern_tourism: ["Business Communication", "Professional"],
    };

    return strengths.some((strength) =>
      alignments[pathType as keyof typeof alignments]?.includes(strength)
    );
  }
}

// Database integration functions
export async function generateAndSavePersonalizedPath(userId: string) {
  try {
    // 1. Fetch user profile and assessment data
    const user = await fetchUserProfile(userId);
    const availablePaths = await fetchLearningPaths();

    // 2. Generate AI recommendations
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const generator = new AILearningPathGenerator(apiKey);
    const recommendation = await generator.generatePersonalizedPath(
      user,
      availablePaths
    );

    // 3. Save to user_journey_progress table
    await saveUserJourneyProgress(userId, recommendation);

    // 4. Update user_learning_paths table
    await updateUserLearningPath(userId, recommendation);

    return recommendation;
  } catch (error) {
    console.error("Failed to generate personalized path:", error);
    throw error;
  }
}

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select(
      `
      id,
      user_type,
      full_name,
      dialect,
      english_level,
      assessment_score,
      strengths,
      recommendations,
      total_challenges_completed,
      average_challenge_score,
      specialization
    `
    )
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw new Error(`Failed to fetch user profile: ${error?.message}`);
  }

  return profile as UserProfile;
}

async function fetchLearningPaths(): Promise<LearningPath[]> {
  const supabase = createClient();

  const { data: paths, error } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("government_approved", true)
    .order("order_index");

  if (error) {
    throw new Error(`Failed to fetch learning paths: ${error.message}`);
  }

  return paths as LearningPath[];
}

async function saveUserJourneyProgress(
  userId: string,
  recommendation: PersonalizedPathRecommendation
) {
  const supabase = createClient();

  // Get first scenario from the primary path
  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .eq("learning_path_id", recommendation.primaryPath.id)
    .order("module_order")
    .limit(1);

  let firstScenario: string | null = null;
  if (modules && modules.length > 0) {
    const { data: scenarios } = await supabase
      .from("scenarios")
      .select("id")
      .eq("module_id", modules[0].id)
      .order("order_index")
      .limit(1);

    firstScenario = scenarios?.[0]?.id || null;
  }

  const progressData = {
    user_id: userId,
    current_scenario_id: firstScenario,
    current_unit_id: recommendation.primaryPath.id,
    current_level: recommendation.primaryPath.level,
    scenarios_completed: 0,
    total_scenarios: await getTotalScenariosCount(
      recommendation.primaryPath.id
    ),
    last_activity: new Date().toISOString(),
    next_recommended_scenario: firstScenario,
    journey_status: "not_started" as const,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_journey_progress")
    .upsert(progressData, { onConflict: "user_id" });

  if (error) {
    throw new Error(`Failed to save journey progress: ${error.message}`);
  }
}

async function updateUserLearningPath(
  userId: string,
  recommendation: PersonalizedPathRecommendation
) {
  const supabase = createClient();

  // Get all scenarios from primary path
  const primaryScenarios = await getScenariosForPath(
    recommendation.primaryPath.id
  );

  // Get scenarios from secondary paths (limited)
  const secondaryScenarios: Scenario[] = [];
  for (const path of recommendation.secondaryPaths.slice(0, 2)) {
    const scenarios = await getScenariosForPath(path.id, 3);
    secondaryScenarios.push(...scenarios);
  }

  const allRecommendedScenarios = [
    ...primaryScenarios.map((s) => s.id),
    ...secondaryScenarios.map((s) => s.id),
  ];

  const learningPathData = {
    user_id: userId,
    english_level: recommendation.primaryPath.level,
    recommended_scenarios: allRecommendedScenarios,
    completed_scenarios: [] as string[],
    current_scenario: primaryScenarios[0]?.id || null,
    progress_percentage: 0,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_learning_paths")
    .upsert(learningPathData, { onConflict: "user_id" });

  if (error) {
    throw new Error(`Failed to update learning path: ${error.message}`);
  }
}

async function getTotalScenariosCount(pathId: string): Promise<number> {
  const supabase = createClient();

  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .eq("learning_path_id", pathId);

  if (!modules || modules.length === 0) return 0;

  const { count } = await supabase
    .from("scenarios")
    .select("id", { count: "exact" })
    .in(
      "module_id",
      modules.map((m: Module) => m.id)
    );

  return count || 0;
}

async function getScenariosForPath(
  pathId: string,
  limit?: number
): Promise<Scenario[]> {
  const supabase = createClient();

  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .eq("learning_path_id", pathId)
    .order("module_order");

  if (!modules || modules.length === 0) return [];

  let query = supabase
    .from("scenarios")
    .select("id, title, difficulty, module_id")
    .in(
      "module_id",
      modules.map((m: Module) => m.id)
    )
    .order("order_index");

  if (limit) {
    query = query.limit(limit);
  }

  const { data: scenarios } = await query;
  return (scenarios as Scenario[]) || [];
}

export { AILearningPathGenerator, type PersonalizedPathRecommendation };
