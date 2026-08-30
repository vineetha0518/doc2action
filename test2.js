const fs = require('fs');

async function test() {
  const textB = fs.readFileSync('test-b.txt', 'utf8');
  const res = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: textB })
  });
  console.log(await res.text());
}

test();