const fs = require('fs');

async function test() {
  const textA = fs.readFileSync('test-a.txt', 'utf8');
  console.log('Sending text of length:', textA.length);
  const res = await fetch('http://127.0.0.1:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: textA })
  });
  console.log('Response status:', res.status);
  console.log(await res.text());
}

test();

