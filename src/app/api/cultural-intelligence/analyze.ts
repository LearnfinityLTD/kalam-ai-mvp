// /api/cultural-intelligence/analyze.ts
// Backend API endpoint for cultural analysis

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { validateInput, sanitizeText, hashUserId } from '../../../lib/security';
import { culturalAnalysisEngine } from '../../../lib/ai/culturalEngine';
import { CulturalAnalysisRequest, CulturalAnalysisResult, DatabaseDocument, ClarityScore } from '../../../types/api';

interface ApiResponse {
  success: boolean;
  analysisId?: string;
  documentId?: string;
  results?: {
    overallRisk: number;
    culturalRisk: number;
    complianceRisk: number;
    riskLevel: string;
    issues: string[];
    suggestions: string[];
    revisedText: string;
    confidence: number;
  };
  error?: string;
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { userId, departmentId, messageText, tenantId }: CulturalAnalysisRequest = req.body;
    
    if (!validateInput(userId, departmentId, messageText, tenantId)) {
      res.status(400).json({ success: false, error: 'Invalid input parameters' });
      return;
    }

    const sanitizedText: string = sanitizeText(messageText);
    const anonymizedUserId: string = await hashUserId(userId);
    
    // Insert document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        title: `Communication Analysis ${new Date().toISOString()}`,
        content: sanitizedText,
        document_type: 'email',
        source_language: 'en',
        target_audience: 'internal',
        status: 'analysis_pending'
      })
      .select()
      .single();

    if (docError || !document) {
      throw new Error(`Document creation failed: ${docError?.message}`);
    }

    const typedDocument = document as DatabaseDocument;

    // Run AI cultural analysis
    const analysisResult: CulturalAnalysisResult = await culturalAnalysisEngine.analyze({
      text: sanitizedText,
      senderId: anonymizedUserId,
      departmentId,
      tenantId
    });

    // Store analysis results in clarity_scores table
    const { data: clarityScore, error: scoreError } = await supabase
      .from('clarity_scores')
      .insert({
        tenant_id: tenantId,
        document_id: typedDocument.id,
        analyzed_by: userId,
        overall_clarity_score: analysisResult.overallRisk,
        cultural_appropriateness_score: analysisResult.culturalHierarchyRisk,
        hierarchy_respect_score: analysisResult.hierarchyScore,
        directness_balance_score: analysisResult.directnessScore,
        formality_level_score: analysisResult.formalityScore,
        risk_level: analysisResult.riskLevel,
        compliance_risk_score: analysisResult.complianceRisk,
        identified_issues: analysisResult.issues,
        improvement_suggestions: analysisResult.suggestions,
        cultural_context_notes: analysisResult.culturalNotes,
        suggested_revisions: analysisResult.revisedText,
        analysis_model_version: 'kalam-ai-v1.0',
        confidence_level: analysisResult.confidence
      })
      .select()
      .single();

    if (scoreError || !clarityScore) {
      throw new Error(`Clarity score creation failed: ${scoreError?.message}`);
    }

    const typedClarityScore = clarityScore as ClarityScore;

    // Create audit log entry
    await supabase.from('audit_logs').insert({
      tenant_id: tenantId,
      user_id: userId,
      action_type: 'document_analysis',
      resource_type: 'document',
      resource_id: typedDocument.id,
      action_description: 'Cultural intelligence analysis performed on communication',
      risk_level: analysisResult.riskLevel,
      regulatory_impact: analysisResult.riskLevel === 'high' || analysisResult.riskLevel === 'critical',
      data_classification: 'confidential'
    });

    // Update document status
    await supabase
      .from('documents')
      .update({ 
        status: 'analyzed',
        analyzed_at: new Date().toISOString()
      })
      .eq('id', typedDocument.id);

    // Return analysis results to frontend
    res.status(200).json({
      success: true,
      analysisId: typedClarityScore.id,
      documentId: typedDocument.id,
      results: {
        overallRisk: analysisResult.overallRisk,
        culturalRisk: analysisResult.culturalHierarchyRisk,
        complianceRisk: analysisResult.complianceRisk,
        riskLevel: analysisResult.riskLevel,
        issues: analysisResult.issues,
        suggestions: analysisResult.suggestions,
        revisedText: analysisResult.revisedText,
        confidence: analysisResult.confidence
      }
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Cultural analysis error:', errorMessage);
    
    // Log error to audit trail
    if (req.body?.tenantId && req.body?.userId) {
      await supabase.from('audit_logs').insert({
        tenant_id: req.body.tenantId,
        user_id: req.body.userId,
        action_type: 'system',
        action_description: `Cultural analysis failed: ${errorMessage}`,
        risk_level: 'high'
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Analysis failed',
      message: 'Internal server error'
    });
  }
}
