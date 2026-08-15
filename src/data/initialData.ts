import { ClientProfile, Lead, PricingPlan, MinutePackage, CaseStudyProof, CallCenterComparison } from '../types';

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'client-1',
    companyName: 'Apex Cloud Logistics',
    contactName: 'Marcus Sterling',
    email: 'marcus@apexlogistics.io',
    industry: 'Supply Chain & Logistics',
    status: 'active',
    vapiAssistantId: 'asst_vapi_apex_9821',
    vapiVoiceId: 'cartesia-sonic-marcus',
    vapiVoiceName: 'Cartesia Sonic (Warm Authority)',
    twilioPhoneNumber: '+1 (415) 890-4321',
    twilioAccountSid: 'AC98df71b83e4590214a',
    systemPrompt: `You are Vela, the enterprise sales executive representing Apex Cloud Logistics. Your objective is to qualify VP/Directors of Supply Chain on optimizing their freight brokerage and spot freight booking using autonomous dispatch. Be consultative, handle budget objections by highlighting the 28% margin reduction, and book a 15-minute product tour with our logistics architect.`,
    firstMessage: `Hi there! This is Vela calling from Apex Cloud Logistics. I noticed you oversee supply chain operations at your firm—do you have 60 seconds to discuss how we are cutting spot freight quote response times down to under 45 seconds?`,
    talktimeMinutesTotal: 5000,
    talktimeMinutesUsed: 2180,
    activeLines: 12,
    callingHoursStart: '09:00',
    callingHoursEnd: '18:00',
    timezone: 'America/New_York (EST)',
    autoFollowupEnabled: true,
    followupDelayHours: 12,
    createdAt: '2026-07-10',
  },
  {
    id: 'client-2',
    companyName: 'RevPeak SaaS Sales',
    contactName: 'Elena Rostova',
    email: 'elena@revpeak.co',
    industry: 'B2B Software / Fintech',
    status: 'active',
    vapiAssistantId: 'asst_vapi_revpeak_3102',
    vapiVoiceId: 'elevenlabs-rachel-conversational',
    vapiVoiceName: 'ElevenLabs Conversational (Sarah)',
    twilioPhoneNumber: '+1 (650) 419-7700',
    twilioAccountSid: 'AC44a19028cb9e1208',
    systemPrompt: `You are Vela, outbound sales specialist for RevPeak Billing Automation. Your goal is to identify pain points in recurring subscription invoicing, reduce churn rates by 14%, and secure a demo calendar slot.`,
    firstMessage: `Hello! This is Vela with RevPeak. We work with high-growth SaaS founders to eliminate failed subscription payments. Are you currently reviewing your Q3 billing automation stack?`,
    talktimeMinutesTotal: 10000,
    talktimeMinutesUsed: 6420,
    activeLines: 25,
    callingHoursStart: '08:30',
    callingHoursEnd: '17:30',
    timezone: 'America/Chicago (CST)',
    autoFollowupEnabled: true,
    followupDelayHours: 12,
    createdAt: '2026-06-22',
  },
  {
    id: 'client-3',
    companyName: 'Helios Commercial Solar',
    contactName: 'David Chen',
    email: 'david@heliossolar.com',
    industry: 'Commercial Renewable Energy',
    status: 'active',
    vapiAssistantId: 'asst_vapi_helios_7741',
    vapiVoiceId: 'azure-neural-davis',
    vapiVoiceName: 'Azure Neural Pro (Davis)',
    twilioPhoneNumber: '+1 (512) 690-3341',
    systemPrompt: `You are Vela from Helios Commercial Solar. You qualify commercial property owners for the 30% Federal ITC tax credit and zero-down PPA commercial rooftop solar installations.`,
    firstMessage: `Good morning! Vela calling from Helios Commercial Energy. We are qualifying commercial buildings over 20,000 sq ft in your district for the new zero-capex solar incentives. Is the facility operations manager available?`,
    talktimeMinutesTotal: 3000,
    talktimeMinutesUsed: 940,
    activeLines: 8,
    callingHoursStart: '09:00',
    callingHoursEnd: '17:00',
    timezone: 'America/Los_Angeles (PST)',
    autoFollowupEnabled: true,
    followupDelayHours: 12,
    createdAt: '2026-08-01',
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    clientId: 'client-1',
    name: 'Robert Vance',
    phone: '+1 (312) 555-0192',
    email: 'rvance@vancerefrigeration.com',
    company: 'Vance Cold Storage Logistics',
    title: 'Chief Operating Officer',
    status: 'completed',
    callDurationSeconds: 168,
    callStartedAt: '2026-08-14T14:22:10Z',
    callEndedAt: '2026-08-14T14:24:58Z',
    sentiment: 'positive',
    conversionChance: 92,
    aiConclusion: 'High intent prospect. Frustrated with manual dispatch delays on refrigerated LTL freight. Agreed to demo call next Tuesday at 10 AM EST.',
    keyObjections: ['Wanted assurance on TMS API integration', 'Asked about spot market pricing volatility'],
    followupScheduledAt: '2026-08-15T02:24:58Z',
    followupSent: true,
    followupDraft: {
      channel: 'email',
      subject: 'Apex Logistics + Vance Refrigeration: Demo Confirmation & API Spec',
      body: 'Hi Robert,\n\nIt was fantastic speaking with you today! As discussed, here is the overview on how Apex Cloud integrates directly with your TMS in under 48 hours to automate spot freight quotes.\n\nI have reserved Tuesday at 10:00 AM EST for your product walkthrough. Looking forward to showing you the live dispatch engine.\n\nBest regards,\nVela AI & The Apex Team'
    },
    transcript: [
      { speaker: 'agent', text: 'Hi Robert! This is Vela from Apex Cloud Logistics. I noticed you oversee supply chain operations—do you have 60 seconds to discuss how we cut spot freight quote response times down to under 45 seconds?', timestamp: '00:02' },
      { speaker: 'lead', text: 'Hey Vela. We are pretty buried right now, but honestly our brokers take 20 minutes just to return a quote on reefers. What makes your system different?', timestamp: '00:15' },
      { speaker: 'agent', text: 'That is exactly why I reached out. Our autonomous pricing engine connects directly with your carrier network to bid, qualify, and lock in reefer capacity in under 45 seconds with 99.4% SLA adherence.', timestamp: '00:32' },
      { speaker: 'lead', text: 'Does it work with McLeod or custom TMS setups?', timestamp: '00:48' },
      { speaker: 'agent', text: 'Yes, we have native two-way Webhook and REST API connectors for McLeod, MercuryGate, and custom SQL databases.', timestamp: '01:02' },
      { speaker: 'lead', text: 'Alright, shoot me a calendar invite for Tuesday morning around 10 AM.', timestamp: '01:25' },
      { speaker: 'agent', text: 'Done! I have sent the invite over to your email at rvance@vancerefrigeration.com. Talk soon, Robert!', timestamp: '01:38' }
    ]
  },
  {
    id: 'lead-102',
    clientId: 'client-1',
    name: 'Samantha Hughes',
    phone: '+1 (404) 555-0834',
    email: 's.hughes@atlantafreight.net',
    company: 'Atlanta Intermodal Freight',
    title: 'Director of Procurement',
    status: 'completed',
    callDurationSeconds: 114,
    callStartedAt: '2026-08-14T15:10:00Z',
    callEndedAt: '2026-08-14T15:11:54Z',
    sentiment: 'neutral',
    conversionChance: 64,
    aiConclusion: 'Receptive to cost reduction benchmarks. Contract with incumbent broker ends in 60 days. Requested one-pager and case study on port drayage savings.',
    keyObjections: ['Locked in broker contract until October 2026', 'Requires security audit for cloud tool'],
    followupScheduledAt: '2026-08-15T03:10:00Z',
    followupSent: false,
    followupDraft: {
      channel: 'email',
      subject: 'Atlanta Intermodal + Apex Logistics: Port Drayage Case Study',
      body: 'Hi Samantha,\n\nFollowing up on our brief chat regarding your upcoming Q4 procurement cycle. Here is the case study detailing how Mid-Atlantic Freight reduced contract drayage fees by 22% with Apex AI.\n\nLet me know if you would like me to prepare a benchmark audit for your October renewal.\n\nWarm regards,\nVela AI'
    },
    transcript: [
      { speaker: 'agent', text: 'Hi Samantha! Vela calling from Apex Cloud Logistics. Hope your Friday is going smoothly.', timestamp: '00:02' },
      { speaker: 'lead', text: 'Hi. Who is this again?', timestamp: '00:06' },
      { speaker: 'agent', text: 'This is Vela from Apex Cloud. We help intermodal freight directors slash administrative overhead and speed up quote turnaround.', timestamp: '00:18' },
      { speaker: 'lead', text: 'We actually have an existing contract with our provider until October, so we cannot switch right now.', timestamp: '00:34' },
      { speaker: 'agent', text: 'Completely understand! Most of our tier-1 partners started their evaluation 60 days before contract expiry. If I email you our 2-page port drayage benchmark, could you take a quick look?', timestamp: '00:50' },
      { speaker: 'lead', text: 'Sure, you can send that over to s.hughes@atlantafreight.net.', timestamp: '01:04' },
      { speaker: 'agent', text: 'Perfect, sending it right now. Have a great afternoon Samantha!', timestamp: '01:12' }
    ]
  },
  {
    id: 'lead-103',
    clientId: 'client-1',
    name: 'Arthur Pendelton',
    phone: '+1 (214) 555-8890',
    email: 'apendelton@lone-star-distribution.com',
    company: 'Lone Star Distribution Hub',
    title: 'Fleet Operations VP',
    status: 'completed',
    callDurationSeconds: 42,
    callStartedAt: '2026-08-14T16:02:11Z',
    callEndedAt: '2026-08-14T16:02:53Z',
    sentiment: 'negative',
    conversionChance: 15,
    aiConclusion: 'Gatekeeper transferred to voicemail after initial prompt. Follow-up SMS queued for Monday morning.',
    keyObjections: ['In middle of warehouse shift turnover', 'Did not have time for voice pitch'],
    followupScheduledAt: '2026-08-15T04:02:11Z',
    followupSent: false,
    followupDraft: {
      channel: 'sms',
      body: 'Hi Arthur, Vela from Apex Logistics. Tried reaching you earlier regarding warehouse dispatch automation. Whenever you have 2 mins, check our quick intro here: apexlogistics.io/intro. Thanks!'
    },
    transcript: [
      { speaker: 'agent', text: 'Hi Arthur, this is Vela from Apex Cloud Logistics. Do you have a quick moment?', timestamp: '00:02' },
      { speaker: 'lead', text: 'Look I am on the warehouse floor managing an active unload right now. Call back another time.', timestamp: '00:14' },
      { speaker: 'agent', text: 'Understood completely Arthur! I will send you a quick SMS summary so you can review at your convenience. Have a safe shift!', timestamp: '00:26' }
    ]
  },
  {
    id: 'lead-104',
    clientId: 'client-1',
    name: 'Claire Moreau',
    phone: '+1 (206) 555-9301',
    email: 'claire@cascadiafreight.com',
    company: 'Cascadia Pacific Freight',
    title: 'Director of Carrier Relations',
    status: 'pending',
    notes: 'Uploaded via CSV batch dial queue #42.'
  },
  {
    id: 'lead-105',
    clientId: 'client-1',
    name: 'Michael Chang',
    phone: '+1 (415) 555-2248',
    email: 'm.chang@bayexpresscorp.com',
    company: 'Bay Express Logistics Corp',
    title: 'VP of Transportation',
    status: 'pending',
    notes: 'High priority lead - 1,200 monthly loads.'
  },
  {
    id: 'lead-106',
    clientId: 'client-1',
    name: 'Olivia Martinez',
    phone: '+1 (305) 555-7712',
    email: 'olivia@sunshinestatelogistics.com',
    company: 'Sunshine State Freight Lines',
    title: 'COO',
    status: 'pending',
    notes: 'South Florida cold chain specialist.'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan-starter',
    name: 'Starter Agent',
    tagline: 'Perfect for small teams replacing outbound manual cold dials.',
    monthlyPrice: 269,
    competitorPrice: 299, // 10% lower pricing
    includedMinutes: 1500,
    overageRatePerMinute: 0.14,
    popular: false,
    features: [
      '1,500 High-Definition Voice Minutes / mo',
      '1 Dedicated Twilio Virtual Local Number',
      'Ultra-low 450ms Voice Latency (Cartesia/Vapi)',
      'Autonomous CSV Lead Upload & Batch Auto-Dialer',
      'AI Call Conclusion & 0-100% Conversion Scoring',
      'Automated 12-Hour Email & SMS Follow-ups',
      'Standard CRM Webhooks (HubSpot, Zapier)'
    ]
  },
  {
    id: 'plan-growth',
    name: 'Growth Scale',
    tagline: 'The ultimate sales powerhouse replacing 3 full-time SDRs.',
    monthlyPrice: 629,
    competitorPrice: 699, // 10% lower pricing
    includedMinutes: 5000,
    overageRatePerMinute: 0.11,
    popular: true,
    features: [
      '5,000 High-Definition Voice Minutes / mo',
      '5 Dedicated Twilio Regional DID Numbers',
      'Multi-Line Concurrent Calling (Up to 30 Lines)',
      'Custom Voice Cloning & Tone Personalization',
      'Intelligent Objection Handling & Calendar Booking',
      'Autonomous 12-Hour Follow-Up Pipeline',
      'Full Call Audio Recordings & Live Transcripts',
      'Priority 15-Minute Credit Fulfillment & SLA'
    ]
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Fleet',
    tagline: 'Custom fleet deployment replacing 20+ call center seats.',
    monthlyPrice: 1799,
    competitorPrice: 1999, // 10% lower pricing
    includedMinutes: 20000,
    overageRatePerMinute: 0.08,
    popular: false,
    features: [
      '20,000 High-Definition Voice Minutes / mo',
      'Unlimited Twilio Local/Toll-Free DID Pool',
      'Unlimited Concurrent Calling Channels',
      'Custom LLM Fine-Tuning & Knowledge Base RAG',
      'Direct Two-Way Supabase / PostgreSQL Sync',
      'Live Human Escalation & SIP Trunking Transfer',
      'Dedicated Account Engineer & Custom SLA'
    ]
  }
];

export const MINUTE_PACKAGES: MinutePackage[] = [
  {
    id: 'pack-500',
    name: 'Quick Boost',
    minutes: 500,
    price: 65,
    pricePerMinute: 0.13,
    discountPercentage: 0,
    badge: 'Popular for Testing'
  },
  {
    id: 'pack-2500',
    name: 'Growth Surge',
    minutes: 2500,
    price: 275,
    pricePerMinute: 0.11,
    discountPercentage: 15,
    badge: 'Best Value'
  },
  {
    id: 'pack-10000',
    name: 'Enterprise Bulk',
    minutes: 10000,
    price: 900,
    pricePerMinute: 0.09,
    discountPercentage: 30,
    badge: 'Max Savings'
  }
];

export const CALL_CENTER_COMPARISONS: CallCenterComparison[] = [
  {
    metric: 'Cost Per Outbound Minute',
    humanCallCenter: '$0.85 – $1.40 / min',
    velaAiAgent: '$0.09 – $0.14 / min',
    savings: '89% Cost Reduction'
  },
  {
    metric: 'Daily Outbound Call Capacity',
    humanCallCenter: '80 – 120 calls / rep / day',
    velaAiAgent: '15,000+ autonomous dials / day',
    savings: '125x Higher Throughput'
  },
  {
    metric: 'Response / Dial Latency',
    humanCallCenter: 'Manual dialing & queue waiting',
    velaAiAgent: '< 450ms human-grade response',
    savings: 'Sub-second real-time voice'
  },
  {
    metric: 'Follow-Up Accuracy & Speed',
    humanCallCenter: 'Manual notes, 24-48 hr delay',
    velaAiAgent: '100% automated 12-hr trigger',
    savings: 'Zero Lead Leakage'
  },
  {
    metric: 'Consistency & Script Adherence',
    humanCallCenter: 'Fatigue, mood variance (62%)',
    velaAiAgent: '100% relentless objection mastery',
    savings: '3.4x Higher Close Rate'
  },
  {
    metric: 'Onboarding & Training Time',
    humanCallCenter: '4 – 6 weeks per agent',
    velaAiAgent: 'Instant 2-minute prompt sync',
    savings: 'Zero ramp-up lag'
  }
];

export const CASE_STUDIES: CaseStudyProof[] = [
  {
    company: 'Nexis Freight & Cargo',
    logoText: 'NEXIS FREIGHT',
    industry: 'Freight Brokerage',
    representative: 'Jason Vance',
    role: 'Head of Outbound Logistics',
    headline: 'Replaced 14 outsourced BPO seats with Vela, booking $420k in new monthly pipeline.',
    dialsPerDay: '12,400',
    conversionRate: '18.4%',
    monthlySavings: '$34,800/mo',
    quote: 'Vela sounds indistinguishable from our senior SDRs. The moment a broker answers, Vela handles carrier pricing objections seamlessly and pushes warm leads directly to our dispatch calendar.'
  },
  {
    company: 'AeroCloud Security',
    logoText: 'AEROCLOUD',
    industry: 'Cybersecurity SaaS',
    representative: 'Rachel Torres',
    role: 'VP of Revenue Operations',
    headline: 'Tripled discovery call volume while cutting SDR customer acquisition cost by 72%.',
    dialsPerDay: '8,200',
    conversionRate: '22.1%',
    monthlySavings: '$28,500/mo',
    quote: 'The 12-hour automated follow-up engine alone doubled our booked demos. With Lucent AI pricing being 10% cheaper than any competitor, switching to Vela was a no-brainer.'
  },
  {
    company: 'Solaria Clean Energy',
    logoText: 'SOLARIA ENERGY',
    industry: 'Commercial Solar',
    representative: 'Marcus Gutierrez',
    role: 'Chief Commercial Officer',
    headline: 'Scaled from 200 calls/day to 25,000 calls/day with zero human burnout.',
    dialsPerDay: '25,000',
    conversionRate: '15.9%',
    monthlySavings: '$62,000/mo',
    quote: 'Vela handles our commercial property owner outreach effortlessly. The conversion scoring accurately flags hot deals so our field closers only talk to pre-qualified buyers.'
  }
];

export const SAMPLE_CSV_DATA = `Name,Phone,Email,Company,Title,Notes
Marcus Wright,+14155550199,marcus.w@wrightlogistics.com,Wright Supply Chain,VP Ops,Needs reefer capacity
Sarah Jenkins,+13125550882,sjenkins@midwestfreight.io,Midwest Express,COO,Looking to cut dispatch costs
David Kincaid,+15125557731,dkincaid@austinenergycorp.com,Austin Clean Energy,Director Facilities,Interested in solar tax credits
Elena Vargas,+12065559944,elena@northwestsaas.io,Northwest Analytics,Head of Sales,Reviewing automated billing
Thomas Hall,+14045553311,thall@georgiahaulers.com,Georgia Cargo Lines,Fleet Manager,Spot market quote delays`;
