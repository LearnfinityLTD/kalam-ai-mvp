// AI-Powered Learning Path Generator for Kalam AI
// This service analyzes user assessments and generates personalized learning paths

import { OpenAI } from "openai";

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

    // Generate AI recommendations
    const aiAnalysis = await this.getAIRecommendations(user, relevantPaths);

    // Apply business logic and scoring
    const scoredPaths = this.scorePaths(user, relevantPaths, aiAnalysis);

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
      reasoning: aiAnalysis.reasoning,
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
  ): Promise<any> {
    const prompt = `
    Analyze this user's English learning profile and recommend the best learning path:

    USER PROFILE:
    - Role: ${user.user_type}
    - English Level: ${user.english_level} 
    - Assessment Score: ${user.assessment_score}%
    - Arabic Dialect: ${user.dialect}
    - Strengths: ${user.strengths.join(", ")}
    - Current Recommendations: ${user.recommendations.join(", ")}
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

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }

  private scorePaths(
    user: UserProfile,
    paths: LearningPath[],
    aiAnalysis: any
  ): LearningPath[] {
    const scored = paths.map((path) => {
      let score = 0;

      // Base score from AI
      const aiRec = aiAnalysis.pathRecommendations?.find(
        (r: any) => r.pathName === path.name
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
    aiAnalysis: any
  ): Promise<CustomModule[]> {
    const weakAreas = this.identifyWeakAreas(user);

    return (
      aiAnalysis.customModules?.map((module: any) => ({
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

  private extractPriorityAreas(user: UserProfile, aiAnalysis: any): string[] {
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

  private calculateConfidence(user: UserProfile, aiAnalysis: any): number {
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
  // 1. Fetch user profile and assessment data
  const user = await fetchUserProfile(userId);
  const availablePaths = await fetchLearningPaths();

  // 2. Generate AI recommendations
  const generator = new AILearningPathGenerator(process.env.OPENAI_API_KEY!);
  const recommendation = await generator.generatePersonalizedPath(
    user,
    availablePaths
  );

  // 3. Save to user_journey_progress table
  await saveUserJourneyProgress(userId, recommendation);

  // 4. Update user_learning_paths table
  await updateUserLearningPath(userId, recommendation);

  return recommendation;
}

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  // Implementation depends on your database setup
  // This should fetch from user_profiles table
  return {} as UserProfile;
}

async function fetchLearningPaths(): Promise<LearningPath[]> {
  // Fetch all available learning paths from learning_paths table
  return [] as LearningPath[];
}

async function saveUserJourneyProgress(
  userId: string,
  recommendation: PersonalizedPathRecommendation
) {
  // Insert/update user_journey_progress with:
  // - current_level: user's English level
  // - current_unit_id: recommendation.primaryPath.id
  // - next_recommended_scenario: first scenario from primary path
  // - journey_status: 'not_started'
}

async function updateUserLearningPath(
  userId: string,
  recommendation: PersonalizedPathRecommendation
) {
  // Insert/update user_learning_paths with:
  // - recommended_scenarios: scenarios from primary + secondary paths
  // - current_scenario: first scenario from primary path
  // - progress_percentage: 0
}

export { AILearningPathGenerator, type PersonalizedPathRecommendation };
