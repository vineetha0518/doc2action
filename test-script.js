
const textA = "Scholarship Notice:\nStudents must submit the scholarship application before September 10, 2026.\nStudent ID card is required.\nApplications after the deadline will not be considered.";

const reqA = { text: textA, title: "Test A" };

fetch("http://127.0.0.1:3000/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(reqA)
}).then(r => r.json()).then(data => {
  console.log("--- TEST A RESULT ---");
  console.log(JSON.stringify(data, null, 2));
  
  const textB = "Insurance Payment Notice:\nThe annual insurance premium of ?5,000 must be paid before October 15, 2026.\nA late payment fee of ?500 applies after the due date.\nCustomers should retain the payment receipt.";

  return fetch("http://127.0.0.1:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: textB, title: "Test B" })
  });
}).then(r => r.json()).then(data => {
  console.log("--- TEST B RESULT ---");
  console.log(JSON.stringify(data, null, 2));
}).catch(console.error);

