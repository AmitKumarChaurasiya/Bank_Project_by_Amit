/**
 * SmartBank Initial Demo Seed Data
 * Student: Amit Kumar | B.Tech CSE | Lloyd Institute of Engineering and Technology
 */

export const INITIAL_DEPARTMENTS = [
  {
    id: 'dept-upi',
    name: 'Digital Banking & UPI',
    code: 'UPI',
    head: 'Priya Verma',
    email: 'upi-grievance@smartbank.demo',
    slaHours: 24,
    description: 'Handles UPI, IMPS, Mobile Banking, and Net Banking issues.'
  },
  {
    id: 'dept-cards',
    name: 'Card Operations & POS',
    code: 'CARDS',
    head: 'Rohan Gupta',
    email: 'cards@smartbank.demo',
    slaHours: 48,
    description: 'Debit card, credit card, ATM cash dispenser, and merchant chargebacks.'
  },
  {
    id: 'dept-fraud',
    name: 'Fraud & Risk Operations',
    code: 'FRAUD',
    head: 'Amit Chaurasiya',
    email: 'fraud-desk@smartbank.demo',
    slaHours: 12,
    description: 'Unauthorized transactions, phishing, suspicious debits, and card blocking.'
  },
  {
    id: 'dept-core',
    name: 'Core Banking & Accounts',
    code: 'CORE',
    head: 'Neha Sharma',
    email: 'accounts@smartbank.demo',
    slaHours: 72,
    description: 'Savings/Current accounts, KYC updates, interest credit, and branch clearance.'
  },
  {
    id: 'dept-loans',
    name: 'Loans & Credit Facilities',
    code: 'LOANS',
    head: 'Vikram Malhotra',
    email: 'loans@smartbank.demo',
    slaHours: 96,
    description: 'Home loan, personal loan, EMI deduction discrepancy, and NACH mandates.'
  },
  {
    id: 'dept-general',
    name: 'Customer Grievance Redressal',
    code: 'CGRC',
    head: 'Rajesh Nair',
    email: 'grievance.nodal@smartbank.demo',
    slaHours: 48,
    description: 'Escalated cases, ombudsman compliance, and multi-department service delays.'
  }
];

export const INITIAL_STAFF = [
  {
    id: 'staff-1',
    name: 'Priya Verma',
    role: 'Senior Grievance Officer',
    email: 'priya.verma@smartbank.demo',
    departmentId: 'dept-upi',
    departmentName: 'Digital Banking & UPI',
    phone: '+91 98110 44211',
    activeComplaints: 2,
    resolvedCount: 38,
    status: 'Active'
  },
  {
    id: 'staff-2',
    name: 'Amit Chaurasiya',
    role: 'Lead Fraud Investigator',
    email: 'amit.c@smartbank.demo',
    departmentId: 'dept-fraud',
    departmentName: 'Fraud & Risk Operations',
    phone: '+91 98220 55322',
    activeComplaints: 1,
    resolvedCount: 52,
    status: 'Active'
  },
  {
    id: 'staff-3',
    name: 'Rohan Gupta',
    role: 'Cards & Dispute Associate',
    email: 'rohan.gupta@smartbank.demo',
    departmentId: 'dept-cards',
    departmentName: 'Card Operations & POS',
    phone: '+91 98330 66433',
    activeComplaints: 3,
    resolvedCount: 29,
    status: 'Active'
  },
  {
    id: 'staff-4',
    name: 'Neha Sharma',
    role: 'Branch Operations Officer',
    email: 'neha.sharma@smartbank.demo',
    departmentId: 'dept-core',
    departmentName: 'Core Banking & Accounts',
    phone: '+91 98440 77544',
    activeComplaints: 1,
    resolvedCount: 44,
    status: 'Active'
  },
  {
    id: 'staff-5',
    name: 'Vikram Malhotra',
    role: 'Retail Lending Specialist',
    email: 'vikram.m@smartbank.demo',
    departmentId: 'dept-loans',
    departmentName: 'Loans & Credit Facilities',
    phone: '+91 98550 88655',
    activeComplaints: 1,
    resolvedCount: 31,
    status: 'Active'
  }
];

export const DEMO_USERS = {
  customer: {
    id: 'usr-cust-1',
    name: 'Rahul Sharma',
    email: 'customer@smartbank.demo',
    role: 'Customer',
    accountNumber: '•••• •••• •••• 4092',
    accountType: 'Smart Privilege Savings',
    branch: 'Noida Sector 62 Branch',
    phone: '+91 98765 43210',
    avatarInitials: 'RS'
  },
  staff: {
    id: 'usr-staff-1',
    name: 'Priya Verma',
    email: 'staff@smartbank.demo',
    role: 'Bank Staff',
    department: 'Digital Banking & UPI',
    designation: 'Senior Grievance Officer',
    employeeId: 'EMP-9024',
    avatarInitials: 'PV'
  },
  admin: {
    id: 'usr-admin-1',
    name: 'Rajesh Nair',
    email: 'admin@smartbank.demo',
    role: 'Administrator',
    department: 'Executive Compliance & Ops',
    designation: 'Chief Compliance Officer',
    employeeId: 'ADM-1001',
    avatarInitials: 'RN'
  }
};

export const INITIAL_COMPLAINTS = [
  {
    id: 'SB-2026-1042',
    customerId: 'usr-cust-1',
    customerName: 'Rahul Sharma',
    customerEmail: 'customer@smartbank.demo',
    customerPhone: '+91 98765 43210',
    accountNumber: '•••• •••• •••• 4092',
    category: 'UPI & Digital Payments',
    subject: 'UPI ₹8,500 debited but failed at Merchant QR code',
    description: 'Initiated a UPI payment of ₹8,500 towards Apollo Pharmacy via QR code scan. Amount was debited immediately from my savings account with UTR 409823149811, however the merchant POS displayed transaction timed out. Money has not reversed after 48 hours.',
    transactionRef: 'UPI-409823149811',
    transactionDate: '2026-10-06',
    transactionAmount: '8,500.00',
    priority: 'High',
    departmentId: 'dept-upi',
    departmentName: 'Digital Banking & UPI',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Priya Verma',
    status: 'In Progress',
    createdAt: '2026-10-06T14:32:00Z',
    updatedAt: '2026-10-08T11:15:00Z',
    slaDeadline: '2026-10-09T14:32:00Z',
    resolutionRemarks: '',
    timeline: [
      {
        id: 't-101',
        status: 'Submitted',
        actor: 'Rahul Sharma (Customer)',
        timestamp: '2026-10-06T14:32:00Z',
        note: 'Complaint registered successfully with reference UTR UPI-409823149811.'
      },
      {
        id: 't-102',
        status: 'Under Review',
        actor: 'Automated Routing Engine',
        timestamp: '2026-10-06T15:00:00Z',
        note: 'Categorized under UPI Settlement disputes and routed to Digital Banking department.'
      },
      {
        id: 't-103',
        status: 'In Progress',
        actor: 'Priya Verma (Grievance Officer)',
        timestamp: '2026-10-08T11:15:00Z',
        note: 'Reconciliation log requested from NPCI Switch. Dual-credit check initiated with beneficiary bank.'
      }
    ]
  },
  {
    id: 'SB-2026-1039',
    customerId: 'usr-cust-1',
    customerName: 'Rahul Sharma',
    customerEmail: 'customer@smartbank.demo',
    customerPhone: '+91 98765 43210',
    accountNumber: '•••• •••• •••• 4092',
    category: 'ATM & Cash Withdrawal',
    subject: 'ATM cash not dispensed ₹10,000 at Sector 18 HDFC ATM',
    description: 'Attempted withdrawal of ₹10,000 using SmartBank Platinum Debit Card at Sector 18 offsite ATM. The ATM machine made a dispensing sound and rebooted with error code ERR-309. Slip not printed, but SMS received showing ₹10,000 debited.',
    transactionRef: 'ATM-20261004-9844',
    transactionDate: '2026-10-04',
    transactionAmount: '10,000.00',
    priority: 'Urgent',
    departmentId: 'dept-cards',
    departmentName: 'Card Operations & POS',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Rohan Gupta',
    status: 'Resolved',
    createdAt: '2026-10-04T18:20:00Z',
    updatedAt: '2026-10-06T16:45:00Z',
    slaDeadline: '2026-10-06T18:20:00Z',
    resolutionRemarks: 'ATM Electronic Journal and Cash Counter audit confirmed cash purge rollback. Full refund of ₹10,000 with statutory RBI compensation of ₹100 credited back to savings account on 2026-10-06.',
    timeline: [
      {
        id: 't-201',
        status: 'Submitted',
        actor: 'Rahul Sharma (Customer)',
        timestamp: '2026-10-04T18:20:00Z',
        note: 'Complaint filed along with ATM terminal location details.'
      },
      {
        id: 't-202',
        status: 'Under Review',
        actor: 'Rohan Gupta (Card Operations)',
        timestamp: '2026-10-05T09:30:00Z',
        note: 'EJ log retrieved from ATM switch partner CMS Info Systems.'
      },
      {
        id: 't-203',
        status: 'In Progress',
        actor: 'Rohan Gupta (Card Operations)',
        timestamp: '2026-10-05T14:10:00Z',
        note: 'Cash count mismatch verified. Chargeback cycle closed in customer favor.'
      },
      {
        id: 't-204',
        status: 'Resolved',
        actor: 'Rohan Gupta (Card Operations)',
        timestamp: '2026-10-06T16:45:00Z',
        note: 'Credit reversal batch executed. Customer notified via SMS and email.'
      }
    ]
  },
  {
    id: 'SB-2026-1035',
    customerId: 'usr-cust-1',
    customerName: 'Rahul Sharma',
    customerEmail: 'customer@smartbank.demo',
    customerPhone: '+91 98765 43210',
    accountNumber: '•••• •••• •••• 4092',
    category: 'Net Banking & Mobile App',
    subject: 'Biometric fingerprint login error on SmartBank mobile app v4.2',
    description: 'After the recent Android update to version 4.2.1, biometric fingerprint authentication fails consistently with message "Security context timeout (SEC-501)". Had to enter master password every time.',
    transactionRef: '',
    transactionDate: '',
    transactionAmount: '',
    priority: 'Normal',
    departmentId: 'dept-upi',
    departmentName: 'Digital Banking & UPI',
    assignedStaffId: 'staff-1',
    assignedStaffName: 'Priya Verma',
    status: 'Closed',
    createdAt: '2026-09-28T10:00:00Z',
    updatedAt: '2026-09-30T17:00:00Z',
    slaDeadline: '2026-09-29T10:00:00Z',
    resolutionRemarks: 'Advised customer to clear biometric cache in device settings and re-register fingerprint credential. Customer verified fix is working.',
    timeline: [
      {
        id: 't-301',
        status: 'Submitted',
        actor: 'Rahul Sharma (Customer)',
        timestamp: '2026-09-28T10:00:00Z',
        note: 'Mobile app bug report submitted.'
      },
      {
        id: 't-302',
        status: 'Resolved',
        actor: 'Priya Verma (Digital Banking)',
        timestamp: '2026-09-29T14:20:00Z',
        note: 'Resolution steps provided.'
      },
      {
        id: 't-303',
        status: 'Closed',
        actor: 'Rahul Sharma (Customer)',
        timestamp: '2026-09-30T17:00:00Z',
        note: 'Customer confirmed problem solved and closed ticket.'
      }
    ]
  },
  {
    id: 'SB-2026-1045',
    customerId: 'usr-cust-2',
    customerName: 'Ananya Roy',
    customerEmail: 'ananya.roy@example.com',
    customerPhone: '+91 98101 23456',
    accountNumber: '•••• •••• •••• 8812',
    category: 'Credit & Debit Cards',
    subject: 'Double billing for international flight ticket on Credit Card',
    description: 'Booked flights on Singapore Airlines portal for ₹48,200. Transaction was charged twice on my SmartBank Signature Credit Card with authorization codes 881902 and 881903 within 3 seconds of each other.',
    transactionRef: 'AUTH-881902-DUP',
    transactionDate: '2026-10-07',
    transactionAmount: '48,200.00',
    priority: 'Urgent',
    departmentId: 'dept-cards',
    departmentName: 'Card Operations & POS',
    assignedStaffId: 'staff-3',
    assignedStaffName: 'Rohan Gupta',
    status: 'Awaiting Customer Information',
    createdAt: '2026-10-07T11:05:00Z',
    updatedAt: '2026-10-08T09:40:00Z',
    slaDeadline: '2026-10-09T11:05:00Z',
    resolutionRemarks: '',
    timeline: [
      {
        id: 't-401',
        status: 'Submitted',
        actor: 'Ananya Roy (Customer)',
        timestamp: '2026-10-07T11:05:00Z',
        note: 'Dispute filed for unauthorized duplicate charge.'
      },
      {
        id: 't-402',
        status: 'Awaiting Customer Information',
        actor: 'Rohan Gupta (Card Operations)',
        timestamp: '2026-10-08T09:40:00Z',
        note: 'Requested airline booking confirmation showing single e-ticket issuance for dispute filing with VISA Network.'
      }
    ]
  },
  {
    id: 'SB-2026-1048',
    customerId: 'usr-cust-3',
    customerName: 'Vikrant Deshmukh',
    customerEmail: 'v.deshmukh@example.com',
    customerPhone: '+91 98202 34567',
    accountNumber: '•••• •••• •••• 1204',
    category: 'Fraud & Security',
    subject: 'Suspicious card authorization attempt of $120.00 from overseas IP',
    description: 'Received SMS alert for international e-commerce authorization at 03:15 AM from an unknown merchant "VALORANT RIOT STORE". Card was immediately temporarily frozen by customer via mobile app.',
    transactionRef: 'INT-AUTH-771290',
    transactionDate: '2026-10-08',
    transactionAmount: '10,140.00',
    priority: 'Urgent',
    departmentId: 'dept-fraud',
    departmentName: 'Fraud & Risk Operations',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'Amit Chaurasiya',
    status: 'Under Review',
    createdAt: '2026-10-08T03:45:00Z',
    updatedAt: '2026-10-08T07:15:00Z',
    slaDeadline: '2026-10-08T15:45:00Z',
    resolutionRemarks: '',
    timeline: [
      {
        id: 't-501',
        status: 'Submitted',
        actor: 'Vikrant Deshmukh (Customer)',
        timestamp: '2026-10-08T03:45:00Z',
        note: 'Emergency fraud ticket created.'
      },
      {
        id: 't-502',
        status: 'Under Review',
        actor: 'Amit Chaurasiya (Fraud Desk)',
        timestamp: '2026-10-08T07:15:00Z',
        note: 'Card permanently hotlisted. Replacement card dispatched with zero-liability protection.'
      }
    ]
  },
  {
    id: 'SB-2026-1049',
    customerId: 'usr-cust-4',
    customerName: 'Kavita Menon',
    customerEmail: 'kavita.m@example.com',
    customerPhone: '+91 98303 45678',
    accountNumber: '•••• •••• •••• 9921',
    category: 'Loans & EMI',
    subject: 'Excessive penal interest charged after NACH auto-debit cleared',
    description: 'Home loan EMI for October was debited successfully on 5th October as scheduled. However loan statement shows penal interest of ₹750 applied citing delayed clearance.',
    transactionRef: 'NACH-HL-882190',
    transactionDate: '2026-10-05',
    transactionAmount: '34,500.00',
    priority: 'Normal',
    departmentId: 'dept-loans',
    departmentName: 'Loans & Credit Facilities',
    assignedStaffId: 'staff-5',
    assignedStaffName: 'Vikram Malhotra',
    status: 'In Progress',
    createdAt: '2026-10-08T16:00:00Z',
    updatedAt: '2026-10-09T08:30:00Z',
    slaDeadline: '2026-10-12T16:00:00Z',
    resolutionRemarks: '',
    timeline: [
      {
        id: 't-601',
        status: 'Submitted',
        actor: 'Kavita Menon (Customer)',
        timestamp: '2026-10-08T16:00:00Z',
        note: 'Complaint lodged regarding penal interest error.'
      },
      {
        id: 't-602',
        status: 'In Progress',
        actor: 'Vikram Malhotra (Loan Specialist)',
        timestamp: '2026-10-09T08:30:00Z',
        note: 'Reconciling NACH mandate settlement timestamp with Clearing House.'
      }
    ]
  },
  {
    id: 'SB-2026-1050',
    customerId: 'usr-cust-5',
    customerName: 'Sanjay Singhania',
    customerEmail: 'sanjay.s@example.com',
    customerPhone: '+91 98404 56789',
    accountNumber: '•••• •••• •••• 3341',
    category: 'Account & Branch Services',
    subject: 'Delay in Video-KYC verification causing debit restriction',
    description: 'Completed Video-KYC slot on 2nd October. Representative confirmed all documents verified, but account is still marked "Re-KYC Pending" preventing RTGS outgoing transfer.',
    transactionRef: 'VKYC-20261002-441',
    transactionDate: '2026-10-02',
    transactionAmount: '',
    priority: 'Normal',
    departmentId: 'dept-core',
    departmentName: 'Core Banking & Accounts',
    assignedStaffId: 'staff-4',
    assignedStaffName: 'Neha Sharma',
    status: 'Submitted',
    createdAt: '2026-10-09T09:15:00Z',
    updatedAt: '2026-10-09T09:15:00Z',
    slaDeadline: '2026-10-12T09:15:00Z',
    resolutionRemarks: '',
    timeline: [
      {
        id: 't-701',
        status: 'Submitted',
        actor: 'Sanjay Singhania (Customer)',
        timestamp: '2026-10-09T09:15:00Z',
        note: 'Complaint submitted with V-KYC booking reference number.'
      }
    ]
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    complaintId: 'SB-2026-1050',
    actorName: 'Sanjay Singhania',
    role: 'Customer',
    action: 'Registered complaint',
    detail: 'Delay in Video-KYC verification causing debit restriction',
    timestamp: '2026-10-09T09:15:00Z'
  },
  {
    id: 'act-2',
    complaintId: 'SB-2026-1049',
    actorName: 'Vikram Malhotra',
    role: 'Bank Staff',
    action: 'Updated status to In Progress',
    detail: 'Reconciling NACH mandate settlement timestamp with Clearing House',
    timestamp: '2026-10-09T08:30:00Z'
  },
  {
    id: 'act-3',
    complaintId: 'SB-2026-1048',
    actorName: 'Amit Chaurasiya',
    role: 'Bank Staff',
    action: 'Updated status to Under Review',
    detail: 'Card permanently hotlisted. Replacement card dispatched.',
    timestamp: '2026-10-08T07:15:00Z'
  },
  {
    id: 'act-4',
    complaintId: 'SB-2026-1042',
    actorName: 'Priya Verma',
    role: 'Bank Staff',
    action: 'Updated status to In Progress',
    detail: 'Reconciliation log requested from NPCI Switch for ₹8,500.',
    timestamp: '2026-10-08T11:15:00Z'
  },
  {
    id: 'act-5',
    complaintId: 'SB-2026-1039',
    actorName: 'Rohan Gupta',
    role: 'Bank Staff',
    action: 'Resolved complaint',
    detail: '₹10,000 refund processed with statutory compensation.',
    timestamp: '2026-10-06T16:45:00Z'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Grievance Assigned to Officer',
    message: 'Your complaint SB-2026-1042 has been assigned to Priya Verma (Digital Banking & UPI).',
    complaintId: 'SB-2026-1042',
    targetRole: 'Customer',
    read: false,
    timestamp: '2026-10-08T11:15:00Z',
    type: 'status_update'
  },
  {
    id: 'notif-2',
    title: 'Complaint Resolved Successfully',
    message: 'Your complaint SB-2026-1039 (ATM cash not dispensed ₹10,000) has been resolved. Refund credited.',
    complaintId: 'SB-2026-1039',
    targetRole: 'Customer',
    read: true,
    timestamp: '2026-10-06T16:45:00Z',
    type: 'resolved'
  },
  {
    id: 'notif-3',
    title: 'High Priority Escalation: Urgent Fraud Alert',
    message: 'New Urgent Priority complaint SB-2026-1048 assigned to Fraud & Risk Operations.',
    complaintId: 'SB-2026-1048',
    targetRole: 'Bank Staff',
    read: false,
    timestamp: '2026-10-08T03:45:00Z',
    type: 'assignment'
  },
  {
    id: 'notif-4',
    title: 'System Milestone: Monthly Redressal Report',
    message: '94.2% complaints resolved within RBI prescribed turnaround time this cycle.',
    complaintId: null,
    targetRole: 'Administrator',
    read: true,
    timestamp: '2026-10-07T18:00:00Z',
    type: 'system'
  }
];

export const CATEGORIES = [
  {
    id: 'upi',
    name: 'UPI & Digital Payments',
    departmentId: 'dept-upi',
    icon: 'Smartphone',
    description: 'Google Pay, PhonePe, Paytm, BHIM, QR code payments, IMPS'
  },
  {
    id: 'atm',
    name: 'ATM & Cash Withdrawal',
    departmentId: 'dept-cards',
    icon: 'CreditCard',
    description: 'Cash not dispensed, partial cash, card trapped in ATM, timeout'
  },
  {
    id: 'netbanking',
    name: 'Net Banking & Mobile App',
    departmentId: 'dept-upi',
    icon: 'Globe',
    description: 'Login issues, session disconnects, password reset, app bugs'
  },
  {
    id: 'cards',
    name: 'Credit & Debit Cards',
    departmentId: 'dept-cards',
    icon: 'Layers',
    description: 'POS swipe failures, duplicate billing, international usage, limits'
  },
  {
    id: 'fraud',
    name: 'Fraud & Security',
    departmentId: 'dept-fraud',
    icon: 'ShieldAlert',
    description: 'Phishing links, unauthorized debits, SIM swap, compromised credentials'
  },
  {
    id: 'loans',
    name: 'Loans & EMI',
    departmentId: 'dept-loans',
    icon: 'Landmark',
    description: 'Interest rates, foreclosure charges, NACH bounce, loan NOC delay'
  },
  {
    id: 'accounts',
    name: 'Account & Branch Services',
    departmentId: 'dept-core',
    icon: 'Building2',
    description: 'KYC renewal, cheque book, passbook statement, account freeze'
  }
];
