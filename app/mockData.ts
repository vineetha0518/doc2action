import { AnalysisResult, ActionItem, ImportantDate, WarningRisk, RequiredInfoDoc } from './types';

export const SAMPLE_DOCUMENTS = [
  {
    name: "Apartment Lease Agreement (Sample)",
    type: "Lease",
    text: `RESIDENTIAL LEASE AGREEMENT
Landlord: Metro Housing Management Corp.
Tenant: Alex Johnson
Property: 404 Innovation Way, Apt 3B, Techville, CA 94016
Lease Term: May 1, 2026 to April 30, 2027

TERMS AND CONDITIONS:
1. Rent Payment: Monthly rent of $2,450 is due on the 1st day of each month. A late fee of $150 will be charged if rent is not received by the 5th of the month.
2. Security Deposit: $2,450 required prior to move-in date.
3. Notice to Vacate: Tenant must provide written notice at least 60 days prior to lease expiration (by March 1, 2027) if not renewing. Failure to provide notice results in automatic month-to-month conversion at a 15% rate increase.
4. Renters Insurance: Tenant MUST provide proof of active renters insurance with minimum $100,000 liability coverage before move-in key handoff (Deadline: April 25, 2026).
5. Maintenance Requests: Urgent maintenance must be submitted via online tenant portal within 24 hours of discovery.
6. Required Documentation: Valid Photo ID, 3 recent pay stubs, completed co-signer guarantee form, and proof of utility account creation (Electric & Water) due by April 28, 2026.`
  },
  {
    name: "Medical Pre-Authorization Letter (Sample)",
    type: "Healthcare",
    text: `HEALTH FIRST CARE - IMPORTANT NOTICE OF REQUIRED PRE-AUTHORIZATION
Date: April 10, 2026
Patient: Jordan Miller
Member ID: HF-9920184
Reference: Surgical Procedure Approval Request

DEAR MEMBER,
Your proposed Outpatient Knee Arthroscopy (CPT 29881) scheduled for May 15, 2026 requires additional clinical documentation before final authorization can be granted.

ACTION REQUIRED BY PATIENT / PROVIDER BY MAY 1, 2026:
1. Submit MRI Scan reports from the last 6 months.
2. Provide Physical Therapy progress notes showing at least 6 weeks of conservative treatment.
3. Complete and sign Form HC-109 (Medical Release Consent).

WARNING / FINANCIAL RISK:
If documents are not received and approved by May 1, 2026, coverage will be DENIED and the member may be personally responsible for 100% of facility and surgeon fees estimated at $14,200.

APPEAL RIGHTS:
If authorization is denied, written appeal must be filed within 30 days of denial notice.`
  },
  {
    name: "IRS Tax Compliance Notice (Sample)",
    type: "Legal & Tax",
    text: `DEPARTMENT OF THE TREASURY - INTERNAL REVENUE SERVICE
NOTICE CP504 - FINAL NOTICE OF INTENT TO LEVY
Date of Notice: April 15, 2026
Tax Year: 2024
Amount Due: $3,120.45

IMMEDIATE ACTION REQUIRED:
Our records show you still have an unpaid balance. Pay $3,120.45 immediately or contact us by May 15, 2026 to arrange a payment agreement.

CONSEQUENCES OF NON-PAYMENT:
If we do not receive your payment or hear from you by May 15, 2026, we may levy your bank accounts, state tax refunds, or wages.

REQUIRED DOCUMENTS TO SUBMIT IF DISPUTING:
- Copy of Form 1040 filed for tax year 2024
- Proof of payment (cancelled check, bank statement, or electronic confirmation receipt)
- Form 9465 (Installment Agreement Request) if requesting monthly payments`
  }
];

export function getMockAnalysis(text: string): AnalysisResult {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  const actions: ActionItem[] = [];
  const deadlines: ImportantDate[] = [];
  const warnings: WarningRisk[] = [];
  const requiredDocuments: RequiredInfoDoc[] = [];
  
  let actionId = 1;
  let deadlineId = 1;
  let warningId = 1;
  let docId = 1;
  
  // Very basic fallback logic to parse ANY text dynamically
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    // Check for deadlines
    if (lowerLine.includes('deadline') || lowerLine.includes('due') || lowerLine.includes('before')) {
      const dateMatch = line.match(/(january|february|march|april|may|june|july|august|september|october|november|december) \d{1,2}(, \d{4})?/i) 
                        || line.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
      const dateStr = dateMatch ? dateMatch[0] : 'Specified Date';
      
      deadlines.push({
        id: `dl-${deadlineId++}`,
        title: 'Deadline Found',
        date: dateStr,
        description: line.trim(),
        source: null
      });
    }
    
    // Check for actions
    if (lowerLine.includes('submit') || lowerLine.includes('pay') || lowerLine.includes('must') || lowerLine.includes('required to')) {
      let priority: 'URGENT' | 'IMPORTANT' | 'OPTIONAL' = 'IMPORTANT';
      if (lowerLine.includes('urgent') || lowerLine.includes('immediately')) priority = 'URGENT';
      
      actions.push({
        id: `act-${actionId++}`,
        title: 'Required Action',
        priority,
        instructions: line.trim(),
        deadline: null,
        why: 'Required by document',
        source: null,
        completed: false
      });
    }
    
    // Check for warnings
    if (lowerLine.includes('penalty') || lowerLine.includes('fee') || lowerLine.includes('fine') || lowerLine.includes('warning') || lowerLine.includes('fail')) {
      let severity: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
      if (lowerLine.includes('levy') || lowerLine.includes('denied') || lowerLine.includes('severe')) severity = 'HIGH';
      
      warnings.push({
        id: `warn-${warningId++}`,
        title: 'Risk/Penalty Identified',
        description: line.trim(),
        severity,
        source: null
      });
    }
    
    // Check for required documents
    if (lowerLine.includes('document') || lowerLine.includes('copy of') || lowerLine.includes('form ') || lowerLine.includes('proof of')) {
      requiredDocuments.push({
        id: `doc-${docId++}`,
        name: 'Requested Document',
        reason: line.trim(),
        source: null
      });
    }
  });

  return {
    documentTitle: "Document Analysis (Fallback)",
    documentType: "Document",
    summary: "This is a dynamically generated fallback analysis based on the extracted text. " + (lines.length > 0 ? "The document contains " + lines.length + " lines of text." : "The document appears to be empty."),
    actions: actions,
    deadlines: deadlines,
    warnings: warnings,
    requiredDocuments: requiredDocuments,
    keyInformation: []
  };
}
