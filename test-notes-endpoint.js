async function main() {
  const response = await fetch('http://localhost:3000/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'test note',
      leadId: 1,
      userId: 1
    })
  });
  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
}
main();
