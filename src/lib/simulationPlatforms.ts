import type { SimulationPlatform, SimulationCase } from '../types/newTypes';

export const SIMULATION_PLATFORMS: SimulationPlatform[] = [
  {
    id: 'sim-surgtrac',
    name: 'SurgTrac (eOsurgical)',
    provider: 'eoSurgical',
    description:
      'Instrument-tracking laparoscopic box training curriculum measuring path length, economy of motion, and bimanual dexterity.',
    websiteUrl: 'https://www.eosurgical.com/pages/surgtrac',
    isFree: false,
    isVRBased: false,
    isWebBased: true,
    requiresHardware: true,
    recommendedFor: ['General Surgery', 'MIS', 'Surgical Residents'],
    certificationsOffered: ['eoSurgical Modular Proficiency'],
    region: 'UK / Global',
  },
  {
    id: 'sim-lap-mentor',
    name: 'LAP Mentor',
    provider: 'Simbionix / 3D Systems',
    description:
      'High-fidelity haptic VR laparoscopic simulator covering cholecystectomy, appendectomy, sigmoid colectomy, and suturing.',
    websiteUrl: 'https://simbionix.com/simulators/lap-mentor/',
    isFree: false,
    isVRBased: true,
    isWebBased: false,
    requiresHardware: true,
    recommendedFor: ['General Surgery', 'Gynecology', 'Bariatric'],
    certificationsOffered: ['FES / FLS Readiness'],
    region: 'Global Skills Centers',
  },
  {
    id: 'sim-fls-fuse',
    name: 'FLS & FUSE Program',
    provider: 'SAGES',
    description:
      'Fundamentals of Laparoscopic Surgery & Fundamental Use of Surgical Energy cognitive and psychomotor certification curriculum.',
    websiteUrl: 'https://www.flsprogram.org/',
    isFree: false,
    isVRBased: false,
    isWebBased: true,
    requiresHardware: true,
    recommendedFor: ['PGY-1 to PGY-5', 'General Surgery', 'MIS Fellows'],
    certificationsOffered: ['SAGES FLS Certificate', 'SAGES FUSE Certificate'],
    region: 'North America / Global',
  },
  {
    id: 'sim-touch-surgery',
    name: 'Touch Surgery Enterprise',
    provider: 'Medtronic',
    description:
      'Interactive step-by-step cognitive surgical rehearsal across 200+ procedures on mobile and web with zero hardware needed.',
    websiteUrl: 'https://www.touchsurgery.com/',
    isFree: true,
    isVRBased: false,
    isWebBased: true,
    requiresHardware: false,
    recommendedFor: ['Residents', 'Medical Students', 'Specialty Trainees'],
    certificationsOffered: ['Procedure Cognitive Mastery Badge'],
    region: 'Global',
  },
  {
    id: 'sim-osso-vr',
    name: 'Osso VR',
    provider: 'Osso VR Inc.',
    description:
      'Multi-user immersive VR surgical training platform for orthopedic, spine, vascular, and minimally invasive procedures.',
    websiteUrl: 'https://www.ossovr.com/',
    isFree: false,
    isVRBased: true,
    isWebBased: false,
    requiresHardware: true,
    recommendedFor: ['Orthopedics', 'Vascular', 'MIS'],
    certificationsOffered: ['Institutional Competency Analytics'],
    region: 'US / Europe',
  },
  {
    id: 'sim-fls-box',
    name: 'Home FLS Laparoscopic Box Trainer',
    provider: 'SAGES / Open-Skill Labs',
    description:
      'Peg transfer, precision cutting, ligating loop, and extracorporeal/intracorporeal knot tying practice modules.',
    websiteUrl: 'https://www.sages.org/fls-program/',
    isFree: true,
    isVRBased: false,
    isWebBased: true,
    requiresHardware: true,
    recommendedFor: ['Junior Residents', 'Motor Skill Conditioning'],
    certificationsOffered: ['Timing Benchmark Log'],
    region: 'Global',
  },
  {
    id: 'sim-anastomosis',
    name: 'Vascular & Bowel Anastomosis Simulator',
    provider: 'STS / ESVS Training Labs',
    description:
      'Bench-top micro- and macro-vascular and intestinal end-to-end / end-to-side anastomotic fidelity trainers.',
    websiteUrl: 'https://www.esvs.org/education/esvs-academy/',
    isFree: false,
    isVRBased: false,
    isWebBased: false,
    requiresHardware: true,
    recommendedFor: ['Vascular Surgery', 'Cardiac Surgery', 'GI Surgery'],
    certificationsOffered: ['ESVS Technical Skills Workshop'],
    region: 'Europe / Global',
  },
  {
    id: 'sim-medsim',
    name: 'MedSim Clinical Decision Engine',
    provider: 'Academic Surgical Consortium',
    description:
      'Web-based diagnostic and perioperative decision-making simulator focused on emergency general surgery and sepsis.',
    websiteUrl: 'https://www.facs.org/for-medical-professionals/education/',
    isFree: true,
    isVRBased: false,
    isWebBased: true,
    requiresHardware: false,
    recommendedFor: ['All Surgical Specialties', 'Emergency On-Call'],
    certificationsOffered: ['CME Decision Credits'],
    region: 'Global',
  },
  {
    id: 'sim-vr-lap',
    name: 'Simbionix RobotiX & GI-BRONCH Mentor',
    provider: 'Surgical Science',
    description:
      'Robotic console ergonomics, EndoWrist articulation, and emergency hemorrhage control simulation modules.',
    websiteUrl: 'https://surgicalscience.com/simulators/',
    isFree: false,
    isVRBased: true,
    isWebBased: false,
    requiresHardware: true,
    recommendedFor: ['Robotic Fellows', 'Senior Residents'],
    certificationsOffered: ['Robotic Console Credentialing'],
    region: 'Global',
  },
  {
    id: 'sim-atls-team',
    name: 'ATLS Trauma Team Resuscitation Simulator',
    provider: 'ACS Committee on Trauma',
    description:
      'Structured primary/secondary survey team scenario rehearsal for polytrauma, hemorrhagic shock, and damage-control surgery.',
    websiteUrl: 'https://www.facs.org/quality-programs/trauma/education/advanced-trauma-life-support/',
    isFree: true,
    isVRBased: false,
    isWebBased: true,
    requiresHardware: false,
    recommendedFor: ['Trauma Surgery', 'Acute Care', 'On-Call Registrars'],
    certificationsOffered: ['ATLS Provider / Refresher Readiness'],
    region: 'Global',
  },
];

export const INTERNAL_SIMULATION_CASES: SimulationCase[] = [
  {
    id: 'case-sim-appendicitis',
    title: 'Acute Abdomen — Perforated Appendicitis with Diffuse Peritonitis',
    category: 'General Surgery',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    scenario:
      'A 34-year-old male presents to the ED with a 48-hour history of periumbilical pain migrating to the RLQ, now generalized abdominal guarding, HR 118 bpm, BP 102/64 mmHg, temp 38.9°C, WBC 18.4×10⁹/L, and lactate 3.1 mmol/L. CT shows free intraperitoneal air around the cecum and pelvic fluid.',
    skillsTested: ['Sepsis Resuscitation', 'Laparoscopic Approach', 'Stump Management', 'Abscess Prevention'],
    questions: [
      {
        id: 'app-q1',
        question: 'What is the highest priority during the initial 30 minutes before entering the operating theatre?',
        options: [
          'Immediate transfer to OR without fluid resuscitation',
          'Isotonic crystalloid resuscitation, broad-spectrum IV antibiotics covering Gram-negatives & anaerobes, and analgesia',
          'Oral contrast CT re-imaging and wait 12 hours for interval appendectomy',
          'Discharge on oral amoxicillin-clavulanate with outpatient follow-up',
        ],
        correctIndex: 1,
        explanation:
          'Hemodynamically stressed patients with perforated appendicitis and elevated lactate require prompt fluid resuscitation and timely broad-spectrum antimicrobials alongside urgent source control.',
        rationale:
          'Surviving Sepsis and WSES Jerusalem Guidelines mandate crystalloid resuscitation and early broad-spectrum IV antibiotics prior to urgent laparoscopic/open source control.',
        reference: 'WSES Jerusalem Guidelines 2020',
      },
      {
        id: 'app-q2',
        question: 'Intraoperatively, the appendiceal base is friable and necrotic into the cecal wall. Which closure method is safest?',
        options: [
          'Single plain catgut endoloop over necrotic tissue',
          'Stapled partial cecectomy across healthy cecal tissue with linear endo-GIA stapler',
          'Leave the appendiceal base open with a Penrose drain',
          'Electrocautery fulguration of the stump without ligation',
        ],
        correctIndex: 1,
        explanation:
          'Placing an endoloop on a friable or necrotic base risks stump blowout. A stapled partial cecectomy in healthy tissue ensures a secure closure.',
        rationale:
          'Endoloop slippage or ischemia-induced stump leak is a preventable cause of postoperative fecal fistula when the base is necrotic.',
        reference: 'SAGES Guidelines for Laparoscopic Appendectomy',
      },
      {
        id: 'app-q3',
        question: 'What is the evidence-based recommendation regarding peritoneal lavage versus focused suctioning in perforated appendicitis?',
        options: [
          'High-volume (10 L) warm saline irrigation reduces postoperative intra-abdominal abscess',
          'Focused aspiration of purulent fluid and minimal selective irrigation avoids spreading contamination',
          'Povidone-iodine peritoneal wash is mandatory',
          'Routine placement of two bilateral pelvic drains prevents all abscesses',
        ],
        correctIndex: 1,
        explanation:
          'Randomized trials show meticulous suctioning of free pus without aggressive high-volume lavage does not increase—and may reduce—postoperative abscess formation.',
        rationale:
          'Aggressive irrigation can disseminate localized bacterial inoculum throughout the peritoneal recesses (subphrenic/pelvic spaces).',
        reference: 'St. Peter et al., Ann Surg; WSES Guidelines',
      },
      {
        id: 'app-q4',
        question: 'After adequate source control is achieved, what is the recommended postoperative IV/oral antibiotic duration?',
        options: [
          '14 full days of IV carbapenems regardless of clinical course',
          '3 to 5 days of targeted antimicrobial therapy with clinical reassessment',
          'Stop antibiotics immediately prior to skin closure',
          '30 days of oral metronidazole',
        ],
        correctIndex: 1,
        explanation:
          'Following adequate source control in complicated intra-abdominal infection, a short fixed course of 3–5 days (STOP-IT trial principle) is non-inferior to prolonged regimens.',
        rationale:
          'Limiting antibiotic duration lowers C. difficile risk and antimicrobial resistance without increasing infectious complications.',
        reference: 'Sawyer et al., NEJM (STOP-IT Trial)',
      },
    ],
  },
  {
    id: 'case-sim-cabg',
    title: 'CABG Decision-Making & Intraoperative Conduit Management',
    category: 'Cardiac Surgery',
    difficulty: 'advanced',
    estimatedMinutes: 20,
    scenario:
      'A 64-year-old diabetic male (HbA1c 8.4%, LVEF 42%) with severe three-vessel coronary artery disease including 85% proximal LAD, 90% OM1, and chronic total occlusion of RCA is scheduled for elective CABG.',
    skillsTested: ['Conduit Selection', 'Transit-Time Flowmetry', 'Cardioplegia Strategy', 'Post-CPB Low Output'],
    questions: [
      {
        id: 'cabg-q1',
        question: 'Which conduit strategy provides the strongest long-term patency and survival advantage for the LAD?',
        options: [
          'Reversed great saphenous vein graft to LAD',
          'In-situ pedicled or skeletonized Left Internal Mammary Artery (LIMA) to LAD',
          'Synthetic PTFE bypass conduit to LAD',
          'Radial artery graft only, preserving LIMA unused',
        ],
        correctIndex: 1,
        explanation:
          'LIMA-to-LAD grafting remains the Class I gold standard with >90% 10-year patency and proven survival benefit.',
        rationale:
          'Internal thoracic artery endothelium produces nitric oxide and prostacyclin, conferring unique resistance to atherosclerosis.',
        reference: 'ACC/AHA & ESC/EACTS Myocardial Revascularization Guidelines',
      },
      {
        id: 'cabg-q2',
        question: 'Why should skeletonized harvesting be considered if bilateral internal mammary arteries (BIMA) are used in a diabetic patient?',
        options: [
          'It doubles cross-clamp duration purposefully',
          'It preserves collateral sternal blood supply and reduces deep sternal wound infection risk',
          'It eliminates the need for systemic heparinization',
          'It prevents radial artery spasm',
        ],
        correctIndex: 1,
        explanation:
          'Skeletonized IMA harvesting avoids stripping sternal/intercostal perforators and venous drainage, lowering mediastinitis risk compared with pedicled BIMA.',
        rationale:
          'Diabetic patients undergoing BIMA face higher sternal devascularization risk unless skeletonization and strict glycemic control are applied.',
        reference: 'ART Trial Subanalysis / STS Guidelines',
      },
      {
        id: 'cabg-q3',
        question: 'After weaning from CPB, Transit-Time Flow Measurement (TTFM) on the LIMA-LAD shows flow 6 mL/min, Pulsatility Index (PI) 7.8, and diastolic filling 28%. What should you do?',
        options: [
          'Close the sternum immediately because flow above 2 mL/min is adequate',
          'Inspect the graft for torsion, kink, spasm, or anastomotic stenosis and revise the anastomosis if confirmed',
          'Administer protamine double dose to boost graft pressure',
          'Wait until ICU arrival for an echocardiogram next morning',
        ],
        correctIndex: 1,
        explanation:
          'A PI > 5.0 with very low flow (<15 mL/min) and poor diastolic filling strongly suggests mechanical anastomotic obstruction or conduit kinking that requires immediate intraoperative inspection.',
        rationale:
          'Correcting a technical graft issue before chest closure prevents perioperative myocardial infarction and hemodynamic collapse.',
        reference: 'ESC/EACTS Guidelines on Intraoperative Graft Assessment',
      },
      {
        id: 'cabg-q4',
        question: 'Regarding the radial artery as a second arterial conduit to an 85% stenotic obtuse marginal (OM1), which statement is accurate?',
        options: [
          'Radial arteries perform best on vessels with <40% mild stenosis',
          'Radial arteries require high-grade target stenosis (>=70-80%) to avoid competitive flow',
          'Radial artery harvesting never requires preoperative Allen/ulnar collateral assessment',
          'Calcium-channel blockers are contraindicated postoperatively',
        ],
        correctIndex: 1,
        explanation:
          'Because the radial artery is a muscular conduit prone to competitive-flow involution, guidelines recommend targeting vessels with severe (>=70%, ideally >=80%) stenosis.',
        rationale:
          'Higher patency over saphenous vein grafts is demonstrated when competitive flow from the native vessel is minimal.',
        reference: 'Gaudino et al., NEJM (RADIAL Meta-analysis)',
      },
    ],
  },
  {
    id: 'case-sim-lapchole',
    title: 'Laparoscopic Cholecystectomy — Safety & Bile Duct Injury Prevention',
    category: 'General Surgery',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    scenario:
      'A 49-year-old female undergoes laparoscopic cholecystectomy for recurrent acute calculous cholecystitis. Dense fibrosis obscures Calot triangle and the gallbladder infundibulum is adherent to the hepatoduodenal ligament.',
    skillsTested: ['Critical View of Safety', 'Bailout Strategies', 'Thermal Safety', 'Intraoperative Cholangiography'],
    questions: [
      {
        id: 'chole-q1',
        question: 'Which three criteria define Strasberg’s Critical View of Safety (CVS)?',
        options: [
          'Two clips on a single tubular structure + division + drain placement',
          'Hepatocystic triangle cleared of fat/fibrous tissue; lower third of gallbladder separated from cystic plate; exactly two structures seen entering gallbladder',
          'Visualizing the common hepatic duct bifurcation before touching the gallbladder',
          'Performing routine cholecystostomy tube in every acute case',
        ],
        correctIndex: 1,
        explanation:
          'All three CVS criteria must be met before any tubular structure is clipped or divided.',
        rationale:
          'Classical bile duct injury occurs when the common bile duct is misidentified as the cystic duct; CVS prevents misidentification.',
        reference: 'SAGES Safe Cholecystectomy Task Force',
      },
      {
        id: 'chole-q2',
        question: 'Despite 25 minutes of careful dissection, severe chronic inflammation prevents achieving the Critical View of Safety. What is the safest bailout option?',
        options: [
          'Blindly clip and divide the largest structure going toward the gallbladder',
          'Perform a subtotal fenestrating/reconstituting cholecystectomy (or convert/cholecystostomy) rather than forcing dissection in a hostile triangle',
          'Increase monopolar cautery wattage to 80W to burn through fibrosis',
          'Proceed with empiric bile duct exploration',
        ],
        correctIndex: 1,
        explanation:
          'SAGES and Tokyo Guidelines strongly recommend bailout procedures—such as laparoscopic subtotal cholecystectomy or conversion—when CVS cannot be safely obtained.',
        rationale:
          'Culture of safety prioritizes avoiding devastating Vasculobiliary Injury over completing a total cholecystectomy in a frozen triangle.',
        reference: 'Tokyo Guidelines 2018 & SAGES Multi-Society Consensus',
      },
      {
        id: 'chole-q3',
        question: 'Which anatomical landmark serves as a reliable extrahepatic reference plane indicating that dissection should stay ventral/cephalad to it?',
        options: [
          'Ligament of Treitz',
          'Rouviere sulcus (and the R4U line connecting Rouviere sulcus to segment IV base)',
          'Arcuate line of Douglas',
          'Pectineal ligament of Cooper',
        ],
        correctIndex: 1,
        explanation:
          'Dissecting above (ventral/cephalad to) the plane of Rouviere sulcus and the base of segment IV keeps instruments safely away from the common bile duct and right hepatic artery.',
        rationale:
          'The CBD typically courses dorsal/caudal to the R4U safety line.',
        reference: 'Hugh et al.; SAGES B-SAFE Landmarks',
      },
      {
        id: 'chole-q4',
        question: 'If bile leakage is recognized from a transected major duct intraoperatively and you lack specialist HPB reconstruction expertise, what is the immediate best action?',
        options: [
          'Perform an immediate end-to-end sutured anastomosis over no stent and close',
          'Do NOT attempt non-specialist repair; place wide closed-suction subhepatic drains, document clearly, and refer promptly to an HPB center',
          'Clip both proximal and distal bile duct ends permanently',
          'Remove the laparoscope and discharge same day',
        ],
        correctIndex: 1,
        explanation:
          'Non-specialist repair attempts substantially worsen long-term stricture rates; drainage and early HPB referral yield superior outcomes.',
        rationale:
          'Expert HPB Roux-en-Y hepaticojejunostomy achieves >90% long-term patency when tissue is not scarred by failed repairs.',
        reference: 'WSES Guidelines on Bile Duct Injury Management',
      },
    ],
  },
  {
    id: 'case-sim-cli',
    title: 'Critical Limb Ischemia — Femoropopliteal Revascularization Strategy',
    category: 'Vascular Surgery',
    difficulty: 'advanced',
    estimatedMinutes: 18,
    scenario:
      'A 71-year-old male with Rutherford Category 5 chronic limb-threatening ischemia (non-healing 1st toe ulcer, ABI 0.34, toe pressure 22 mmHg) has a 22-cm TASC D superficial femoral artery occlusion with good single-vessel peroneal runoff and an available 4.2-mm ipsilateral great saphenous vein (GSV).',
    skillsTested: ['CLTI Stratification (WIfI)', 'BEST-CLI Evidence', 'Vascular Anastomosis', 'Compartment Syndrome Vigilance'],
    questions: [
      {
        id: 'cli-q1',
        question: 'Based on the BEST-CLI trial, for a fit patient with an adequate single-segment GSV and long SFA occlusion, which initial strategy demonstrated superior outcomes?',
        options: [
          'Open surgical bypass with single-segment Great Saphenous Vein',
          'Primary above-knee amputation',
          'Prosthetic PTFE bypass despite available high-quality GSV',
          'Supervised walking therapy alone without revascularization',
        ],
        correctIndex: 0,
        explanation:
          'In Cohort 1 of the BEST-CLI randomized trial, surgical bypass with single-segment GSV significantly reduced major adverse limb events (MALE) or death compared with endovascular therapy.',
        rationale:
          'Autologous single-segment GSV remains the most durable conduit for infrainguinal CLTI revascularization in surgical-risk-appropriate patients.',
        reference: 'Farber et al., NEJM 2022 (BEST-CLI Trial)',
      },
      {
        id: 'cli-q2',
        question: 'Which classification system integrates Wound extent, Ischemia severity, and Foot Infection to predict 1-year amputation risk in CLTI?',
        options: [
          'Fontaine Classification alone',
          'SVS WIfI Classification System',
          'CEAP Classification',
          'Clavien-Dindo Classification',
        ],
        correctIndex: 1,
        explanation:
          'The Society for Vascular Surgery WIfI (Wound, Ischemia, foot Infection) system guides both amputation risk and benefit of revascularization.',
        rationale:
          'SVS/ESVS Global Vascular Guidelines (GVG) recommend WIfI staging for all patients presenting with CLTI.',
        reference: 'Global Vascular Guidelines (Conte et al., Eur J Vasc Endovasc Surg)',
      },
      {
        id: 'cli-q3',
        question: 'Prior to clamping the common femoral and popliteal arteries during bypass, what systemic medication is routinely administered?',
        options: [
          'Oral warfarin 10 mg bolus',
          'Intravenous unfractionated heparin (typically 80–100 IU/kg) with ACT monitoring',
          'Protamine sulfate prior to clamping',
          'Tranexamic acid 2 g bolus',
        ],
        correctIndex: 1,
        explanation:
          'Systemic IV heparin before arterial cross-clamping prevents stasis thrombosis in the distal microvascular bed and inflow vessels.',
        rationale:
          'Target ACT >= 200–250 seconds minimizes acute thromboembolic limb loss during clamping.',
        reference: 'Rutherford Vascular Surgery & Endovascular Therapy',
      },
      {
        id: 'cli-q4',
        question: 'Six hours after successful revascularization of severe acute-on-chronic ischemia, the patient develops severe calf pain on passive toe extension, tense anterior/lateral compartments, and paresthesia. Pedal Doppler signals are still present. What is the management?',
        options: [
          'Reassure patient because pedal Doppler signals are audible',
          'Perform emergent four-compartment lower-leg fasciotomy',
          'Elevate leg above heart level and apply tight elastic compression bandage',
          'Wait 24 hours for CK trend before intervention',
        ],
        correctIndex: 1,
        explanation:
          'Reperfusion compartment syndrome is a clinical emergency; palpable pulses or Doppler signals do NOT rule out elevated intracompartmental pressure causing neuromuscular necrosis.',
        rationale:
          'Delayed fasciotomy leads to irreversible Volkmann contracture, rhabdomyolysis, and limb loss.',
        reference: 'ESVS Guidelines on Acute & Chronic Limb Ischemia',
      },
      {
        id: 'cli-q5',
        question: 'Following infrageniculate autologous vein bypass, what surveillance protocol optimizes long-term primary-assisted patency?',
        options: [
          'No follow-up needed after staple removal',
          'Clinical exam + ankle-brachial indices + color duplex ultrasound graft surveillance (at 1, 3, 6, 12 months, then annually)',
          'Monthly diagnostic catheter angiography',
          'D-dimer blood testing only',
        ],
        correctIndex: 1,
        explanation:
          'Duplex ultrasound identifies flow-limiting vein graft stenoses (PSV > 300 cm/s or Vr > 3.5) prior to complete thrombosis, enabling prophylactic intervention.',
        rationale:
          'Preventing graft occlusion preserves limb salvage and secondary/assisted primary patency.',
        reference: 'SVS Follow-up Guidelines After Arterial Procedures',
      },
    ],
  },
];
