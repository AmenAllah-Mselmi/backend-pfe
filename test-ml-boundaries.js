// Find exact boundaries for Cold/Warm/Hot in the ML model
async function testBoundaries() {
  const base = 'http://localhost:8000/predict-score';

  const scenarios = [
    // Finding WARM boundary (score >= 40)
    { name: 'Test: 7 calls, 10 emails, 3 meetings, NEGOCIATION', data: { deal_value: 2000, calls: 7, emails: 10, meetings: 3, stage: 'NEGOCIATION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'Test: 8 calls, 12 emails, 3 meetings, NEGOCIATION', data: { deal_value: 2000, calls: 8, emails: 12, meetings: 3, stage: 'NEGOCIATION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'Test: 6 calls, 8 emails, 2 meetings, QUALIFIED', data: { deal_value: 2000, calls: 6, emails: 8, meetings: 2, stage: 'QUALIFIED', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'Test: 8 calls, 10 emails, 3 meetings, PROPOSITION', data: { deal_value: 2000, calls: 8, emails: 10, meetings: 3, stage: 'PROPOSITION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'Test: 9 calls, 12 emails, 4 meetings, NEGOCIATION', data: { deal_value: 2000, calls: 9, emails: 12, meetings: 4, stage: 'NEGOCIATION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'Test: 10 calls, 14 emails, 4 meetings, NEGOCIATION', data: { deal_value: 2000, calls: 10, emails: 14, meetings: 4, stage: 'NEGOCIATION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    // Test with PROPOSITION stage
    { name: 'Test: 10 calls, 15 emails, 5 meetings, PROPOSITION', data: { deal_value: 3000, calls: 10, emails: 15, meetings: 5, stage: 'PROPOSITION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    // More granular for WARM
    { name: 'WARM: 5 calls, 7 emails, 2 meetings, PROPOSITION', data: { deal_value: 3000, calls: 5, emails: 7, meetings: 2, stage: 'PROPOSITION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'WARM: 6 calls, 10 emails, 2 meetings, PROPOSITION', data: { deal_value: 3000, calls: 6, emails: 10, meetings: 2, stage: 'PROPOSITION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'WARM: 7 calls, 12 emails, 3 meetings, PROPOSITION', data: { deal_value: 3000, calls: 7, emails: 12, meetings: 3, stage: 'PROPOSITION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    // Cold > 0
    { name: 'COLD>0: 3 calls, 5 emails, 1 meeting, CONTACTED', data: { deal_value: 2000, calls: 3, emails: 5, meetings: 1, stage: 'CONTACTED', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'COLD>0: 4 calls, 6 emails, 1 meeting, CONTACTED', data: { deal_value: 2000, calls: 4, emails: 6, meetings: 1, stage: 'CONTACTED', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'COLD>0: 4 calls, 8 emails, 2 meetings, QUALIFIED', data: { deal_value: 3000, calls: 4, emails: 8, meetings: 2, stage: 'QUALIFIED', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'COLD>0: 5 calls, 6 emails, 1 meeting, QUALIFIED', data: { deal_value: 3000, calls: 5, emails: 6, meetings: 1, stage: 'QUALIFIED', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
  ];

  for (const s of scenarios) {
    try {
      const res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s.data)
      });
      const result = await res.json();
      const temp = result.score >= 70 ? 'HOT' : result.score >= 40 ? 'WARM' : 'COLD';
      console.log(`${s.name}`);
      console.log(`  → Score: ${result.score}, Temperature: ${temp}, Probability: ${result.probability}`);
    } catch (e) {
      console.error(`FAILED for ${s.name}:`, e.message);
    }
  }
}

testBoundaries();
