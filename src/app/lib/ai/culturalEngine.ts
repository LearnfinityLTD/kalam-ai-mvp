// /lib/ai/culturalEngine.ts
// Cultural Analysis AI Engine with proper typing

interface AnalysisInput {
  text: string;
  senderId: string;
  departmentId: string;
  tenantId: string;
}

export interface CulturalAnalysisResult {
  overallRisk: number;
  culturalHierarchyRisk: number;
  complianceRisk: number;
  hierarchyScore: number;
  directnessScore: number;
  formalityScore: number;
  issues: string[];
  suggestions: string[];
  culturalNotes: string;
  revisedText: string;
  confidence: number;
  riskLevel: string;
}

export const culturalAnalysisEngine = {
  async analyze(input: AnalysisInput): Promise<CulturalAnalysisResult> {
    // This would integrate with your AI model
    // For MVP, using rule-based analysis with enhanced logic

    const analysis: CulturalAnalysisResult = {
      overallRisk: 0,
      culturalHierarchyRisk: 0,
      complianceRisk: 0,
      hierarchyScore: 100,
      directnessScore: 50,
      formalityScore: 50,
      issues: [],
      suggestions: [],
      culturalNotes: "",
      revisedText: "",
      confidence: 0.85,
      riskLevel: "low",
    };

    const text = input.text.toLowerCase();

    // Cultural Hierarchy Analysis - Enhanced patterns
    const directCommands = [
      /\b(do this|immediately|no delays|must|required|demand|order)\b/gi,
      /\b(have to|need to|should|ought to)\b/gi,
      /\b(asap|urgent|rush|hurry)\b/gi,
    ];

    const respectMarkers = [
      /\b(please|kindly|when possible|if you could|with respect)\b/gi,
      /\b(would you mind|could you please|if it's convenient)\b/gi,
      /\b(thank you|appreciate|grateful|honor)\b/gi,
    ];

    const hierarchyViolations = [
      /\b(you must|you need to|you have to|you should)\b/gi,
      /\b(just do it|get it done|make it happen)\b/gi,
      /\b(i don't care|no excuses|figure it out)\b/gi,
    ];

    // Check for direct commands
    let commandMatches = 0;
    directCommands.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        commandMatches += matches.length;
        analysis.issues.push(
          `Direct command detected: "${matches[0]}" - may violate cultural hierarchy expectations`
        );
      }
    });

    // Check for hierarchy violations
    let hierarchyMatches = 0;
    hierarchyViolations.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        hierarchyMatches += matches.length;
        analysis.issues.push(
          `Hierarchy violation detected: "${matches[0]}" - disrespectful to cultural authority structures`
        );
      }
    });

    // Check for respectful language
    let respectMatches = 0;
    respectMarkers.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        respectMatches += matches.length;
      }
    });

    // Calculate cultural hierarchy risk
    if (commandMatches > 0) {
      analysis.culturalHierarchyRisk += 30 * commandMatches;
    }

    if (hierarchyMatches > 0) {
      analysis.culturalHierarchyRisk += 50 * hierarchyMatches;
    }

    if (respectMatches === 0 && (commandMatches > 0 || hierarchyMatches > 0)) {
      analysis.culturalHierarchyRisk += 20;
      analysis.issues.push(
        "Missing respectful language markers in directive communication"
      );
    }

    // Reduce risk if respectful language is present
    if (respectMatches > 0) {
      analysis.culturalHierarchyRisk = Math.max(
        0,
        analysis.culturalHierarchyRisk - 10 * respectMatches
      );
    }

    // Compliance Risk Analysis - Enhanced
    const complianceKeywords = [
      /\b(payment|transfer|vendor|procurement|sama|aml|bribery)\b/gi,
      /\b(money|cash|funds|invoice|billing)\b/gi,
      /\b(contract|agreement|deal|negotiation)\b/gi,
      /\b(confidential|classified|restricted|internal)\b/gi,
    ];

    let complianceMatches = 0;
    complianceKeywords.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        complianceMatches += matches.length;
        analysis.issues.push(
          `Compliance-sensitive keyword detected: "${matches[0]}" - requires additional oversight`
        );
      }
    });

    if (complianceMatches > 0) {
      analysis.complianceRisk = Math.min(100, 25 * complianceMatches);
    }

    // Generate cultural context notes
    analysis.culturalNotes = this.generateCulturalNotes(input, analysis);

    // Generate suggestions and revised text
    if (analysis.culturalHierarchyRisk > 30) {
      analysis.suggestions.push(
        "Add respectful opening phrases (e.g., 'Please', 'When convenient')"
      );
      analysis.suggestions.push(
        "Use collaborative rather than directive language"
      );
      analysis.suggestions.push(
        "Acknowledge recipient's expertise and autonomy"
      );
      analysis.suggestions.push(
        "Consider cultural hierarchy and respect protocols"
      );

      // Generate culturally appropriate revision
      analysis.revisedText = this.generateCulturallyAppropriateRevision(
        input.text
      );
    }

    if (analysis.complianceRisk > 20) {
      analysis.suggestions.push(
        "Review message for compliance-sensitive content"
      );
      analysis.suggestions.push("Consider adding compliance disclaimers");
      analysis.suggestions.push(
        "Ensure proper authorization for financial discussions"
      );
    }

    // Calculate overall risk
    analysis.overallRisk = Math.max(
      analysis.culturalHierarchyRisk,
      analysis.complianceRisk
    );

    // Determine risk level with more nuanced thresholds
    if (analysis.overallRisk > 85) {
      analysis.riskLevel = "critical";
    } else if (analysis.overallRisk > 60) {
      analysis.riskLevel = "high";
    } else if (analysis.overallRisk > 30) {
      analysis.riskLevel = "medium";
    } else {
      analysis.riskLevel = "low";
    }

    // Adjust confidence based on text length and complexity
    if (input.text.length < 20) {
      analysis.confidence = Math.max(0.6, analysis.confidence - 0.2);
    }

    // Cap risk values at 100%
    analysis.culturalHierarchyRisk = Math.min(
      100,
      analysis.culturalHierarchyRisk
    );
    analysis.complianceRisk = Math.min(100, analysis.complianceRisk);
    analysis.overallRisk = Math.min(100, analysis.overallRisk);

    return analysis;
  },

  generateCulturalNotes(
    input: AnalysisInput,
    analysis: CulturalAnalysisResult
  ): string {
    const notes = [];

    if (analysis.culturalHierarchyRisk > 50) {
      notes.push(
        "High cultural hierarchy risk detected. Consider Islamic and Arab cultural values of respect and deference to authority."
      );
    }

    if (analysis.complianceRisk > 30) {
      notes.push(
        "Compliance-sensitive content identified. Ensure adherence to GCC regulatory frameworks."
      );
    }

    if (
      input.departmentId === "FINANCE" ||
      input.departmentId === "OPERATIONS"
    ) {
      notes.push(
        "Department context: Extra care needed for cross-cultural communication in business-critical functions."
      );
    }

    return notes.join(" ");
  },

  generateCulturallyAppropriateRevision(originalText: string): string {
    let revisedText = originalText;

    // Replace direct commands with respectful requests
    const replacements = [
      {
        pattern: /\bdo this immediately\b/gi,
        replacement:
          "when it aligns with your schedule, we would be honored if you could prioritize this",
      },
      {
        pattern: /\bno delays acceptable\b/gi,
        replacement: "your timely attention would be greatly appreciated",
      },
      {
        pattern: /\byou must\b/gi,
        replacement: "if possible, could you please",
      },
      {
        pattern: /\byou need to\b/gi,
        replacement: "we would appreciate if you could",
      },
      {
        pattern: /\byou have to\b/gi,
        replacement: "when convenient, please consider",
      },
      {
        pattern: /\bget it done\b/gi,
        replacement: "complete this task when possible",
      },
      {
        pattern: /\bjust do it\b/gi,
        replacement: "please handle this when you have the opportunity",
      },
      { pattern: /\basap\b/gi, replacement: "at your earliest convenience" },
      { pattern: /\burgent\b/gi, replacement: "time-sensitive" },
    ];

    replacements.forEach(({ pattern, replacement }) => {
      revisedText = revisedText.replace(pattern, replacement);
    });

    // Add respectful opening if missing
    const hasRespectfulOpening =
      /^(please|kindly|would you|could you|if you)/i.test(revisedText.trim());
    if (!hasRespectfulOpening && revisedText.length > 0) {
      revisedText =
        "Please " + revisedText.charAt(0).toLowerCase() + revisedText.slice(1);
    }

    // Add closing courtesy if missing
    const hasRespectfulClosing =
      /(thank you|thanks|appreciate|regards|respectfully)/i.test(revisedText);
    if (!hasRespectfulClosing) {
      revisedText += ". Thank you for your consideration.";
    }

    return revisedText;
  },
};
