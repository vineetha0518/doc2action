const fs = require('fs');

async function test() {
  const textB = fs.readFileSync('test-b.txt', 'utf8');
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      documentText: textB,
      question: "What happens if I miss the deadline?"
    })
  });
  console.log("Q1:", await res.text());
  
  const res2 = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      documentText: textB,
      question: "Do I need to submit a student ID?"
    })
  });
  console.log("Q2:", await res2.text());
}

test();