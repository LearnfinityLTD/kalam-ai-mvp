// /api/cultural-intelligence/intervention.ts
// API endpoint for handling user decisions on AI suggestions

import { NextApiRequest, NextApiResponse } from 'next';

export async function handleInterventionDecision(
  req: NextApiRequest, 
  res: NextApiResponse<InterventionDecisionResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ 
      success: false, 
      decision: 'rejected', 
      riskReduction: 0, 
      monetaryImpact: 0, 
      message: 'Method not allowed' 
    });
    return;
  }

  try {
    const { analysisId, decision, tenantId, userId }: InterventionDecisionRequest = req.body;
    
    // Validate decision
    if (!['accepted', 'rejected'].includes(decision)) {
      res.status(400).json({ 
        success: false, 
        decision: 'rejected', 
        riskReduction: 0, 
        monetaryImpact: 0, 
        message: 'Invalid decision value' 
      });
      return;
    }

    // Get original analysis
    const { data: clarityScore, error: fetchError } = await supabase
      .from('clarity_scores')
      .select('*')
      .eq('id', analysisId)
      .eq('tenant_id', tenantId)
      .single();

    if (fetchError || !clarityScore) {
      res.status(404).json({ 
        success: false, 
        decision: 'rejected', 
        riskReduction: 0, 
        monetaryImpact: 0, 
        message: 'Analysis not found' 
      });
      return;
    }

    const typedClarityScore = clarityScore as ClarityScore;

    // Calculate risk reduction based on decision
    const originalRisk: number = typedClarityScore.overall_clarity_score;
    const riskReduction: number = decision === 'accepted' ? 
      Math.round(originalRisk * 0.84) : 0; // 84% reduction if accepted

    // Calculate monetary value (average incident cost: $5,000)
    const monetaryImpact: number = decision === 'accepted' ? 
      Math.round((originalRisk / 100) * 5000) : 
      -Math.round((originalRisk / 100) * 5000);

    // Insert metrics record
    const { error: metricsError } = await supabase
      .from('analytics_metrics')
      .insert({
        tenant_id: tenantId,
        metric_type: 'risk_reduction',
        metric_name: decision === 'accepted' ? 
          'Cultural Risk Successfully Mitigated' : 
          'Unmitigated Cultural Risk Exposure',
        metric_value: monetaryImpact,
        metric_unit: 'USD',
        department: 'UNKNOWN',
        time_period: 'monthly',
        calculation_method: `AI intervention ${decision} * average incident cost`,
        data_source: 'cultural_intelligence_engine',
        confidence_level: typedClarityScore.confidence_level,
        recorded_date: new Date().toISOString().split('T')[0]
      });

    if (metricsError) {
      throw new Error(`Metrics insertion failed: ${metricsError.message}`);
    }

    // Create audit log for user decision
    await supabase.from('audit_logs').insert({
      tenant_id: tenantId,
      user_id: userId,
      action_type: 'document_analysis',
      resource_type: 'document',
      resource_id: typedClarityScore.document_id,
      action_description: `User ${decision} AI cultural intervention - ${decision === 'accepted' ? 'Risk mitigated' : 'Risk exposure maintained'}`,
      risk_level: typedClarityScore.risk_level,
      regulatory_impact: true,
      data_classification: 'confidential'
    });

    // Update user conversation log
    await supabase.from('user_conversations').insert({
      tenant_id: tenantId,
      user_id: userId,
      conversation_type: 'risk_analysis',
      document_id: typedClarityScore.document_id,
      messages: [{
        timestamp: new Date().toISOString(),
        type: 'intervention_decision',
        decision: decision,
        risk_reduction: riskReduction,
        monetary_impact: monetaryImpact
      }],
      total_messages: 1,
      cultural_accuracy_score: decision === 'accepted' ? 95 : 15
    });

    res.status(200).json({
      success: true,
      decision: decision,
      riskReduction: riskReduction,
      monetaryImpact: monetaryImpact,
      message: decision === 'accepted' ? 
        'Intervention accepted - Risk successfully mitigated' :
        'Intervention rejected - Risk exposure maintained'
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Intervention decision error:', errorMessage);
    res.status(500).json({ 
      success: false, 
      decision: 'rejected', 
      riskReduction: 0, 
      monetaryImpact: 0, 
      message: 'Failed to process decision' 
    });
  }
}
