// Test what the ML model predicts for different scenarios
async function testPredictions() {
  const base = 'http://localhost:8000/predict-score';

  const scenarios = [
    { name: 'COLD (1 email, 0 calls, 0 meetings, low deal)', data: { deal_value: 800, calls: 0, emails: 1, meetings: 0, stage: 'NEW', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'COLD (2 emails, 1 call, 0 meetings)', data: { deal_value: 1500, calls: 1, emails: 2, meetings: 0, stage: 'CONTACTED', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'WARM attempt (3 emails, 3 calls, 1 meeting)', data: { deal_value: 3000, calls: 3, emails: 3, meetings: 1, stage: 'QUALIFIED', industry: 'TECHNOLOGY', company_size: 'MEDIUM' } },
    { name: 'WARM attempt (5 emails, 5 calls, 2 meetings)', data: { deal_value: 5000, calls: 5, emails: 5, meetings: 2, stage: 'QUALIFIED', industry: 'TECHNOLOGY', company_size: 'MEDIUM' } },
    { name: 'WARM attempt (8 emails, 6 calls, 3 meetings)', data: { deal_value: 5000, calls: 6, emails: 8, meetings: 3, stage: 'NEGOCIATION', industry: 'TECHNOLOGY', company_size: 'MEDIUM' } },
    { name: 'HOT attempt (10 emails, 10 calls, 5 meetings, NEGOCIATION)', data: { deal_value: 3000, calls: 10, emails: 10, meetings: 5, stage: 'NEGOCIATION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'HOT attempt (15 emails, 12 calls, 5 meetings, WON)', data: { deal_value: 2000, calls: 12, emails: 15, meetings: 5, stage: 'WON', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'HOT attempt (20 emails, 15 calls, 6 meetings, PROPOSITION)', data: { deal_value: 5000, calls: 15, emails: 20, meetings: 6, stage: 'PROPOSITION', industry: 'TECHNOLOGY', company_size: 'SMALL' } },
    { name: 'HOT attempt (25 emails, 18 calls, 7 meetings, WON)', data: { deal_value: 10000, calls: 18, emails: 25, meetings: 7, stage: 'WON', industry: 'TECHNOLOGY', company_size: 'MEDIUM' } },
  ];

  for (const s of scenarios) {
    try {
      const res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s.data)
      });
      const result = await res.json();
      console.log(`${s.name}`);
      console.log(`  → Score: ${result.score}, Temperature: ${result.temperature}, Probability: ${result.probability}`);
      console.log('');
    } catch (e) {
      console.error(`FAILED for ${s.name}:`, e.message);
    }
  }
}

testPredictions();
