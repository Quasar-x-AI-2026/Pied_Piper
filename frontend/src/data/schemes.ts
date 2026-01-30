import { Scheme } from '@/types';

export const schemesData: Scheme[] = [
  {
    id: '1',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    description: 'Housing scheme to provide affordable housing for the urban and rural poor with credit-linked subsidy on home loans.',
    targetBeneficiary: 'Economically Weaker Section (EWS) & Low Income Group (LIG)',
    keyBenefit: 'Subsidy up to ₹2.67 Lakh on home loans',
    type: 'central',
    category: 'housing',
    eligibility: [
      'Annual household income up to ₹18 Lakh',
      'Should not own a pucca house in any part of India',
      'First-time home buyer',
      'Valid Aadhaar card required'
    ],
    documents: [
      'Aadhaar Card',
      'Income Certificate',
      'Property Documents',
      'Bank Account Details',
      'Passport Size Photographs'
    ],
    applicationSteps: [
      'Visit the official PMAY website or nearest CSC center',
      'Fill the online application form',
      'Submit required documents',
      'Wait for verification and approval',
      'Receive subsidy directly to loan account'
    ],
    officialLink: 'https://pmaymis.gov.in/',
    lastUpdated: new Date('2024-12-01'),
    incomeLimit: 1800000,
    gender: 'any'
  },
  {
    id: '2',
    name: 'PM Kisan Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to farmer families across India, paid in three equal installments.',
    targetBeneficiary: 'Small and Marginal Farmers',
    keyBenefit: '₹6,000 per year in 3 installments',
    type: 'central',
    category: 'agriculture',
    eligibility: [
      'Must be a farmer with cultivable land',
      'Land records in the name of beneficiary',
      'Valid bank account linked with Aadhaar',
      'Not a government employee or pensioner'
    ],
    documents: [
      'Aadhaar Card',
      'Land Ownership Documents',
      'Bank Account Details',
      'Mobile Number'
    ],
    applicationSteps: [
      'Visit PM-KISAN portal or CSC center',
      'Complete farmer registration',
      'Submit land and bank details',
      'Verification by local authorities',
      'Receive installments directly to bank'
    ],
    officialLink: 'https://pmkisan.gov.in/',
    lastUpdated: new Date('2024-11-15'),
    gender: 'any'
  },
  {
    id: '3',
    name: 'Sukanya Samriddhi Yojana',
    description: 'Government-backed savings scheme for the girl child with attractive interest rates and tax benefits.',
    targetBeneficiary: 'Parents/Guardians of Girl Child',
    keyBenefit: '8.2% interest rate + Tax benefits under 80C',
    type: 'central',
    category: 'women',
    eligibility: [
      'Girl child must be below 10 years of age',
      'Only 2 accounts per family allowed',
      'Minimum deposit ₹250 per year',
      'Maximum deposit ₹1.5 Lakh per year'
    ],
    documents: [
      'Birth Certificate of Girl Child',
      'Identity Proof of Parent/Guardian',
      'Address Proof',
      'Passport Size Photographs'
    ],
    applicationSteps: [
      'Visit nearest post office or authorized bank',
      'Fill the account opening form',
      'Submit required documents',
      'Make initial deposit (min ₹250)',
      'Receive passbook'
    ],
    officialLink: 'https://www.indiapost.gov.in/',
    lastUpdated: new Date('2024-10-20'),
    ageRange: { max: 10 },
    gender: 'female'
  },
  {
    id: '4',
    name: 'Atal Pension Yojana',
    description: 'Pension scheme for unorganized sector workers with government co-contribution for eligible subscribers.',
    targetBeneficiary: 'Workers in Unorganized Sector',
    keyBenefit: 'Guaranteed pension ₹1,000 to ₹5,000/month',
    type: 'central',
    category: 'senior',
    eligibility: [
      'Age between 18-40 years',
      'Must have a savings bank account',
      'Linked to Aadhaar',
      'Not a taxpayer or covered under any statutory social security scheme'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Mobile Number',
      'Nominee Details'
    ],
    applicationSteps: [
      'Visit your bank branch',
      'Fill APY registration form',
      'Choose pension amount (₹1,000 to ₹5,000)',
      'Set up auto-debit for contributions',
      'Receive PRAN (Permanent Retirement Account Number)'
    ],
    officialLink: 'https://npscra.nsdl.co.in/scheme-details.php',
    lastUpdated: new Date('2024-11-01'),
    ageRange: { min: 18, max: 40 },
    gender: 'any'
  },
  {
    id: '5',
    name: 'National Scholarship Portal',
    description: 'Single-window platform for various central and state scholarships for students from different categories.',
    targetBeneficiary: 'Students from Class 1 to PhD',
    keyBenefit: 'Scholarships ranging ₹1,000 to ₹2,00,000',
    type: 'central',
    category: 'education',
    eligibility: [
      'Must be enrolled in recognized institution',
      'Meet specific scholarship criteria',
      'Annual family income as per scheme',
      'Valid caste certificate if applicable'
    ],
    documents: [
      'Aadhaar Card',
      'Income Certificate',
      'Marksheets',
      'Institution Verification',
      'Bank Account Details',
      'Caste Certificate (if applicable)'
    ],
    applicationSteps: [
      'Register on National Scholarship Portal',
      'Complete profile with accurate details',
      'Apply for eligible scholarships',
      'Upload required documents',
      'Track application status online'
    ],
    officialLink: 'https://scholarships.gov.in/',
    lastUpdated: new Date('2024-12-10'),
    gender: 'any'
  },
  {
    id: '6',
    name: 'Ayushman Bharat - PMJAY',
    description: 'Health insurance scheme providing coverage of ₹5 Lakh per family per year for secondary and tertiary hospitalization.',
    targetBeneficiary: 'Bottom 40% vulnerable families',
    keyBenefit: '₹5 Lakh health cover per family/year',
    type: 'central',
    category: 'health',
    eligibility: [
      'Listed in SECC 2011 database',
      'No age or family size limit',
      'Covers pre-existing diseases',
      'Can be used at any empaneled hospital'
    ],
    documents: [
      'Aadhaar Card',
      'Ration Card',
      'Family Details',
      'Mobile Number'
    ],
    applicationSteps: [
      'Check eligibility on mera.pmjay.gov.in',
      'Visit nearest CSC or empaneled hospital',
      'Get e-card generated',
      'Use at any empaneled hospital across India'
    ],
    officialLink: 'https://pmjay.gov.in/',
    lastUpdated: new Date('2024-11-20'),
    gender: 'any'
  },
  {
    id: '7',
    name: 'PM Mudra Yojana',
    description: 'Micro-finance scheme providing loans up to ₹10 Lakh to small businesses and entrepreneurs.',
    targetBeneficiary: 'Micro & Small Entrepreneurs',
    keyBenefit: 'Collateral-free loans up to ₹10 Lakh',
    type: 'central',
    category: 'employment',
    eligibility: [
      'Non-corporate, non-farm small/micro enterprises',
      'Existing or new businesses',
      'No collateral required for loans up to ₹10 Lakh',
      'Valid business plan or proposal'
    ],
    documents: [
      'Identity Proof',
      'Address Proof',
      'Business Plan',
      'Category Certificate (if applicable)',
      'Quotation of machinery/equipment'
    ],
    applicationSteps: [
      'Approach any bank, NBFC, or MFI',
      'Submit loan application with business plan',
      'Choose category: Shishu, Kishore, or Tarun',
      'Complete documentation',
      'Receive loan approval and disbursement'
    ],
    officialLink: 'https://www.mudra.org.in/',
    lastUpdated: new Date('2024-10-15'),
    gender: 'any'
  },
  {
    id: '8',
    name: 'Senior Citizen Savings Scheme',
    description: 'Government-backed savings scheme exclusively for senior citizens with attractive interest rates.',
    targetBeneficiary: 'Senior Citizens (60+ years)',
    keyBenefit: '8.2% interest rate with quarterly payouts',
    type: 'central',
    category: 'finance',
    eligibility: [
      'Age 60 years or above',
      'Retired defense personnel (55+ years)',
      'VRS optees (55-60 years)',
      'Maximum investment ₹30 Lakh'
    ],
    documents: [
      'Age Proof',
      'Identity Proof',
      'Address Proof',
      'Passport Size Photographs',
      'PAN Card'
    ],
    applicationSteps: [
      'Visit post office or authorized bank',
      'Fill account opening form',
      'Submit age and identity proof',
      'Deposit amount (min ₹1,000)',
      'Receive passbook and interest payouts quarterly'
    ],
    officialLink: 'https://www.indiapost.gov.in/',
    lastUpdated: new Date('2024-09-30'),
    ageRange: { min: 60 },
    gender: 'any'
  }
];
