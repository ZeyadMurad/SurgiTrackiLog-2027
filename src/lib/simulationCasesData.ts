// ============================================================================
// simulationCasesData.ts — V2 Simulation Lab Cases (117 Cases, 351 MCQs)
// Across 19 Surgical Specialties with Urgency & Difficulty Stratification
// ============================================================================

import type { SimulationCase } from '../types/newTypes';

export const INTERNAL_SIMULATION_CASES_V2: SimulationCase[] = [
  {
    "id": "sim-v2-001",
    "title": "Perforated Appendicitis with Diffuse Peritonitis",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "34M with 48h migrating RLQ pain, HR 118, BP 102/64, temp 38.9\u00b0C, free intraperitoneal air on CT.",
    "skillsTested": [
      "Sepsis Resuscitation",
      "Laparoscopic Access",
      "Stump Closure",
      "Source Control"
    ],
    "questions": [
      {
        "id": "sim-v2-001-q1",
        "question": "Initial resuscitation before OR entry?",
        "options": [
          "Isotonic crystalloids + broad-spectrum IV antibiotics",
          "Oral contrast wait-and-see",
          "Delayed outpatient antibiotics",
          "Immediate discharge"
        ],
        "correctIndex": 0,
        "explanation": "Isotonic crystalloids + broad-spectrum IV antibiotics represents the evidence-based surgical priority in Perforated Appendicitis with Diffuse Peritonitis.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-001-q2",
        "question": "Intraoperative step if appendiceal base is necrotic?",
        "options": [
          "Simple catgut tie",
          "Leave stump open",
          "Cecum wedge stapling across healthy tissue",
          "Drain only without appendectomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, cecum wedge stapling across healthy tissue ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-001-q3",
        "question": "Post-op pelvic abscess management?",
        "options": [
          "Immediate re-laparotomy",
          "Stop antibiotics early",
          "Oral steroids",
          "CT-guided percutaneous drainage"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on ct-guided percutaneous drainage to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Perforated Appendicitis with Diffuse Peritonitis."
      }
    ]
  },
  {
    "id": "sim-v2-002",
    "title": "Acute Calculous Cholecystitis & Gangrenous Gallbladder",
    "category": "General Surgery",
    "difficulty": "beginner",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "52F with RUQ pain, Murphy sign, WBC 16.2, US wall 6mm with pericholecystic fluid.",
    "skillsTested": [
      "Calot Triangle",
      "Critical View of Safety",
      "Bailout Strategy",
      "Bile Duct Safety"
    ],
    "questions": [
      {
        "id": "sim-v2-002-q1",
        "question": "Key anatomic landmark above cystic structures?",
        "options": [
          "Umbilical fissure",
          "Rouviere sulcus",
          "Falciform notch",
          "Round ligament base"
        ],
        "correctIndex": 1,
        "explanation": "Rouviere sulcus represents the evidence-based surgical priority in Acute Calculous Cholecystitis & Gangrenous Gallbladder.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-002-q2",
        "question": "When Calot triangle is obliterated by severe inflammation?",
        "options": [
          "Blind clip application",
          "Forceful diathermy near CBD",
          "Subtotal fenestrating cholecystectomy",
          "Abort without drainage"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, subtotal fenestrating cholecystectomy ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-002-q3",
        "question": "Concern with bilious drain output Day 2?",
        "options": [
          "Observation with clamped drain",
          "Immediate liver resection",
          "Oral ursodiol only",
          "Cystic duct stump leak \u2014 ERCP sphincterotomy"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on cystic duct stump leak \u2014 ercp sphincterotomy to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Calculous Cholecystitis & Gangrenous Gallbladder."
      }
    ]
  },
  {
    "id": "sim-v2-003",
    "title": "Strangulated Inguinal Hernia with Bowel Compromise",
    "category": "General Surgery",
    "difficulty": "beginner",
    "urgency": "emergency",
    "estimatedMinutes": 21,
    "scenario": "68M with tender irreducible right groin mass x8h, tachycardia, elevated lactate 3.4.",
    "skillsTested": [
      "Groin Anatomy",
      "Bowel Viability",
      "Tissue Repair",
      "Sepsis Control"
    ],
    "questions": [
      {
        "id": "sim-v2-003-q1",
        "question": "Pre-op diagnostic approach for clear strangulation?",
        "options": [
          "Prompt surgical exploration after resuscitation",
          "Outpatient elective MRI",
          "Manual forceful taxis under sedation",
          "24h NG decompression alone"
        ],
        "correctIndex": 0,
        "explanation": "Prompt surgical exploration after resuscitation represents the evidence-based surgical priority in Strangulated Inguinal Hernia with Bowel Compromise.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-003-q2",
        "question": "Mesh choice in frank enteric spillage?",
        "options": [
          "Heavyweight polypropylene plug",
          "Synthetic ePTFE patch",
          "Non-mesh tissue repair (Bassini/Shouldice) or biologic",
          "Leave defect open"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, non-mesh tissue repair (bassini/shouldice) or biologic ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-003-q3",
        "question": "Post-op assessment of borderline ischemic ileal loop?",
        "options": [
          "Immediate primary closure without inspection",
          "Stoma in every case",
          "Topical heparin",
          "Warm saline packs & Doppler/ICG before resection decision"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on warm saline packs & doppler/icg before resection decision to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Strangulated Inguinal Hernia with Bowel Compromise."
      }
    ]
  },
  {
    "id": "sim-v2-004",
    "title": "Perforated Peptic Duodenal Ulcer (Graham Patch)",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 12,
    "scenario": "47M NSAID user with sudden epigastric pain, rigid board-like abdomen, free air under diaphragm.",
    "skillsTested": [
      "Foregut Emergency",
      "Graham Patch",
      "Peritoneal Lavage",
      "H. pylori Eradication"
    ],
    "questions": [
      {
        "id": "sim-v2-004-q1",
        "question": "Immediate pre-op triad?",
        "options": [
          "Upper endoscopy first",
          "NPO, NG tube, IV PPI, broad-spectrum antibiotics, crystalloids",
          "Barium swallow",
          "Oral antacids"
        ],
        "correctIndex": 1,
        "explanation": "NPO, NG tube, IV PPI, broad-spectrum antibiotics, crystalloids represents the evidence-based surgical priority in Perforated Peptic Duodenal Ulcer (Graham Patch).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-004-q2",
        "question": "Standard repair for 1 cm anterior duodenal perforation?",
        "options": [
          "Billroth II in unstable patient",
          "Pyloroplasty without patch",
          "Tension-free omental (Graham) patch repair",
          "Total gastrectomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, tension-free omental (graham) patch repair ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-004-q3",
        "question": "Mandatory post-op prevention?",
        "options": [
          "Lifetime TPN",
          "Immediate vagotomy on Day 3",
          "No acid suppression",
          "H. pylori testing/eradication & NSAID cessation"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on h. pylori testing/eradication & nsaid cessation to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Perforated Peptic Duodenal Ulcer (Graham Patch)."
      }
    ]
  },
  {
    "id": "sim-v2-005",
    "title": "Adhesive Small Bowel Obstruction with Closed-Loop Sign",
    "category": "General Surgery",
    "difficulty": "beginner",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "61F post-hysterectomy with bilious emesis, obstipation, CT whirl sign & mesenteric edema.",
    "skillsTested": [
      "SBO Triage",
      "Enterolysis",
      "Viability Check",
      "Mesenteric Release"
    ],
    "questions": [
      {
        "id": "sim-v2-005-q1",
        "question": "Indication for immediate surgery over Gastrografin challenge?",
        "options": [
          "CT closed-loop sign with mesenteric swirl & rising lactate",
          "Mild abdominal distension alone",
          "Single previous laparotomy",
          "Normal WBC with passing flatus"
        ],
        "correctIndex": 0,
        "explanation": "CT closed-loop sign with mesenteric swirl & rising lactate represents the evidence-based surgical priority in Adhesive Small Bowel Obstruction with Closed-Loop Sign.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-005-q2",
        "question": "Preferred approach for clear single adhesive band?",
        "options": [
          "Routine massive enterectomy",
          "Blind blind-loop bypass",
          "Careful lysis of adhesions avoiding serosal enterotomy",
          "Routine gastrostomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, careful lysis of adhesions avoiding serosal enterotomy ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-005-q3",
        "question": "Early post-op ileus vs mechanical obstruction differentiation?",
        "options": [
          "Immediate relaparotomy at 24h",
          "High-dose opioids",
          "Oral laxatives blindly",
          "CT with oral water-soluble contrast if persistent >5 days"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on ct with oral water-soluble contrast if persistent >5 days to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Adhesive Small Bowel Obstruction with Closed-Loop Sign."
      }
    ]
  },
  {
    "id": "sim-v2-006",
    "title": "Incarcerated Paraumbilical Hernia in Cirrhotic Ascites",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "58M Child-Pugh B cirrhosis with tense umbilical hernia ulceration and oozing ascites.",
    "skillsTested": [
      "Cirrhosis Risk",
      "Ascites Control",
      "Ventral Repair",
      "Portosystemic Balance"
    ],
    "questions": [
      {
        "id": "sim-v2-006-q1",
        "question": "Why urgent control of ascites before/during repair?",
        "options": [
          "Increases portal hypertension",
          "Reduces fascial tension, wound dehiscence, and SBP",
          "Eliminates need for sutures",
          "Replaces albumin synthesis"
        ],
        "correctIndex": 1,
        "explanation": "Reduces fascial tension, wound dehiscence, and SBP represents the evidence-based surgical priority in Incarcerated Paraumbilical Hernia in Cirrhotic Ascites.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-006-q2",
        "question": "Optimal perioperative medical optimization?",
        "options": [
          "Immediate TIPS during hernia repair only",
          "High-volume saline overload",
          "Diuretic titration, albumin repletion, SBP prophylaxis",
          "Routine open drain placement long-term"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, diuretic titration, albumin repletion, sbp prophylaxis ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-006-q3",
        "question": "Post-op drain management rule?",
        "options": [
          "Leave Foley inside peritoneum permanently",
          "Daily paracentesis via wound",
          "Stop spironolactone",
          "Avoid chronic open ascites drains; optimize medical ascites control"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on avoid chronic open ascites drains; optimize medical ascites control to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Incarcerated Paraumbilical Hernia in Cirrhotic Ascites."
      }
    ]
  },
  {
    "id": "sim-v2-007",
    "title": "Large Hiatal Hernia (Type III Paraesophageal) with Volvulus",
    "category": "General Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 21,
    "scenario": "71F with chest pain, retching, inability to pass NG tube (Borchardt triad).",
    "skillsTested": [
      "Hiatal Dissection",
      "Sac Excision",
      "Crural Repair",
      "Fundoplication"
    ],
    "questions": [
      {
        "id": "sim-v2-007-q1",
        "question": "Borchardt triad signifies?",
        "options": [
          "Acute gastric volvulus obstruction",
          "Simple GERD",
          "Esophageal achalasia",
          "Gallstone ileus"
        ],
        "correctIndex": 0,
        "explanation": "Acute gastric volvulus obstruction represents the evidence-based surgical priority in Large Hiatal Hernia (Type III Paraesophageal) with Volvulus.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-007-q2",
        "question": "Key operative step after gastric detorsion?",
        "options": [
          "No wrap and leave sac in mediastinum",
          "Right colectomy",
          "Complete hernia sac excision & crural closure",
          "Routine splenectomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, complete hernia sac excision & crural closure ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-007-q3",
        "question": "Post-op dysphagia at 2 weeks usually reflects?",
        "options": [
          "Missed colon cancer",
          "Aortic injury",
          "Immediate re-operation Day 14",
          "Edema around wrap/hiatus managed conservatively first"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on edema around wrap/hiatus managed conservatively first to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Large Hiatal Hernia (Type III Paraesophageal) with Volvulus."
      }
    ]
  },
  {
    "id": "sim-v2-008",
    "title": "Splenic Abscess in Immunocompromised Patient",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 12,
    "scenario": "49M post-chemotherapy with fever, LUQ pain, CT showing 7 cm multiloculated splenic abscess.",
    "skillsTested": [
      "RUQ/LUQ Sepsis",
      "Splenic Mobilization",
      "Hilar Control",
      "OPSI Prevention"
    ],
    "questions": [
      {
        "id": "sim-v2-008-q1",
        "question": "Best surgical option for multiloculated failed percutaneous drain?",
        "options": [
          "Repeat fine-needle aspiration alone",
          "Splenectomy with hilar ligation",
          "Observation",
          "Hepatic artery embolization"
        ],
        "correctIndex": 1,
        "explanation": "Splenectomy with hilar ligation represents the evidence-based surgical priority in Splenic Abscess in Immunocompromised Patient.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-008-q2",
        "question": "Key vascular anatomy at splenic hilum?",
        "options": [
          "Cystic artery",
          "Renal vein",
          "Splenic artery & vein close to pancreatic tail",
          "Middle colic artery"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, splenic artery & vein close to pancreatic tail ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-008-q3",
        "question": "Mandatory post-splenectomy prophylaxis?",
        "options": [
          "Lifelong antifungals",
          "No vaccines required",
          "Immediate bone marrow biopsy",
          "Vaccinations against S. pneumoniae, N. meningitidis, H. influenzae b"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on vaccinations against s. pneumoniae, n. meningitidis, h. influenzae b to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Splenic Abscess in Immunocompromised Patient."
      }
    ]
  },
  {
    "id": "sim-v2-009",
    "title": "Necrotizing Soft Tissue Infection (Fournier Gangrene)",
    "category": "General Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "56M diabetic with severe perineal pain out of proportion, crepitus, BP 86/52.",
    "skillsTested": [
      "LRINEC Triage",
      "Radical Debridement",
      "Broad Antibiotics",
      "Diversion"
    ],
    "questions": [
      {
        "id": "sim-v2-009-q1",
        "question": "Gold standard diagnostic and therapeutic action?",
        "options": [
          "Immediate surgical exploration and radical debridement + broad antibiotics",
          "Wait 24h for MRI confirmation",
          "Oral cephalexin",
          "Topical silver sulfadiazine alone"
        ],
        "correctIndex": 0,
        "explanation": "Immediate surgical exploration and radical debridement + broad antibiotics represents the evidence-based surgical priority in Necrotizing Soft Tissue Infection (Fournier Gangrene).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-009-q2",
        "question": "Empiric antimicrobial regimen must cover?",
        "options": [
          "Vancomycin monotherapy",
          "Fluconazole alone",
          "Polymicrobial aerobic/anaerobic + clindamycin antitoxin effect",
          "Doxycycline oral"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, polymicrobial aerobic/anaerobic + clindamycin antitoxin effect ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-009-q3",
        "question": "Planned follow-up at 24 hours?",
        "options": [
          "Primary skin closure at index case",
          "Discharge on Day 2",
          "Stop debridement if fever drops",
          "Mandatory scheduled second-look debridement in OR"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on mandatory scheduled second-look debridement in or to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Necrotizing Soft Tissue Infection (Fournier Gangrene)."
      }
    ]
  },
  {
    "id": "sim-v2-010",
    "title": "Pancreatic Pseudocyst vs Walled-Off Necrosis (Step-Up)",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "45M 6 weeks post-severe gallstone pancreatitis with 11 cm symptomatic retrogastric collection.",
    "skillsTested": [
      "Pancreatic Timing",
      "Cystgastrostomy",
      "Step-Up Approach",
      "Endoscopic Drainage"
    ],
    "questions": [
      {
        "id": "sim-v2-010-q1",
        "question": "Minimum waiting period before drainage when stable?",
        "options": [
          "Within 24 hours of admission",
          "4-6 weeks for mature wall formation",
          "6 months minimum",
          "Immediate open necrosectomy Day 3"
        ],
        "correctIndex": 1,
        "explanation": "4-6 weeks for mature wall formation represents the evidence-based surgical priority in Pancreatic Pseudocyst vs Walled-Off Necrosis (Step-Up).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-010-q2",
        "question": "Preferred initial modern approach for walled-off necrosis?",
        "options": [
          "Open Whipple resection",
          "Total pancreatectomy",
          "Endoscopic transluminal / percutaneous step-up drainage",
          "Hepaticojejunostomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, endoscopic transluminal / percutaneous step-up drainage ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-010-q3",
        "question": "Delayed hemorrhage during necrosectomy suggests?",
        "options": [
          "Benign ileus",
          "Cholelithiasis only",
          "Oral PPI failure",
          "Splenic/gastroduodenal pseudoaneurysm \u2014 CTA & angioembolization"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on splenic/gastroduodenal pseudoaneurysm \u2014 cta & angioembolization to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Pancreatic Pseudocyst vs Walled-Off Necrosis (Step-Up)."
      }
    ]
  },
  {
    "id": "sim-v2-011",
    "title": "Gastric Outlet Obstruction from Antral Ulcer Scarring",
    "category": "General Surgery",
    "difficulty": "beginner",
    "urgency": "emergency",
    "estimatedMinutes": 21,
    "scenario": "63M with recurrent non-bilious vomiting, hypochloremic hypokalemic metabolic alkalosis.",
    "skillsTested": [
      "Electrolyte Correction",
      "Biopsy Exclusion",
      "Gastrojejunostomy",
      "Acid Control"
    ],
    "questions": [
      {
        "id": "sim-v2-011-q1",
        "question": "Priority before anesthesia induction?",
        "options": [
          "Replete NaCl, KCl, and intravascular volume + NG decompression",
          "Immediate induction without electrolytes",
          "Give hypertonic bicarbonate",
          "Oral potassium tablets"
        ],
        "correctIndex": 0,
        "explanation": "Replete NaCl, KCl, and intravascular volume + NG decompression represents the evidence-based surgical priority in Gastric Outlet Obstruction from Antral Ulcer Scarring.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-011-q2",
        "question": "Essential intraoperative diagnostic step?",
        "options": [
          "Skip pathology",
          "Routine splenectomy",
          "Endoscopic/biopsy confirmation to exclude gastric malignancy",
          "Cecal biopsy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, endoscopic/biopsy confirmation to exclude gastric malignancy ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-011-q3",
        "question": "Definitive reconstruction if benign fibrotic pylorus?",
        "options": [
          "Esophagectomy",
          "Right hemicolectomy",
          "Appendectomy",
          "Gastrojejunostomy (with or without truncal vagotomy)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on gastrojejunostomy (with or without truncal vagotomy) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Gastric Outlet Obstruction from Antral Ulcer Scarring."
      }
    ]
  },
  {
    "id": "sim-v2-012",
    "title": "Biliary Ileus (Gallstone Ileus) \u2014 Rigler Triad",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 12,
    "scenario": "76F with intermittent SBO, pneumobilia, dilated bowel, and calcified 3.5 cm RLQ stone.",
    "skillsTested": [
      "Rigler Triad",
      "Enterolithotomy",
      "Bowel Palpation",
      "Staged Biliary"
    ],
    "questions": [
      {
        "id": "sim-v2-012-q1",
        "question": "Single-stage vs enterolithotomy alone in frail elderly?",
        "options": [
          "Mandatory simultaneous Whipple",
          "Simple enterolithotomy proximal to impaction (stage cholecystectomy)",
          "Wait for stone to pass",
          "ERCP stone crushing from mouth"
        ],
        "correctIndex": 1,
        "explanation": "Simple enterolithotomy proximal to impaction (stage cholecystectomy) represents the evidence-based surgical priority in Biliary Ileus (Gallstone Ileus) \u2014 Rigler Triad.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-012-q2",
        "question": "Critical intraoperative check during enterolithotomy?",
        "options": [
          "Close enterotomy longitudinally",
          "Leave gallbladder fistula bleeding",
          "Palpate entire bowel for synchronous second gallstones",
          "Ligate portal vein"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, palpate entire bowel for synchronous second gallstones ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-012-q3",
        "question": "Enterotomy closure orientation?",
        "options": [
          "End-to-side to stomach",
          "Open ostomy always",
          "Resect entire ileum",
          "Longitudinal enterotomy closed transversely (Heineke-Mikulicz)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on longitudinal enterotomy closed transversely (heineke-mikulicz) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Biliary Ileus (Gallstone Ileus) \u2014 Rigler Triad."
      }
    ]
  },
  {
    "id": "sim-v2-013",
    "title": "Laparoscopic Ventral/Incisional Hernia (IPOM vs eTEP)",
    "category": "General Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "54M BMI 33 with 6 cm midline incisional hernia containing omentum.",
    "skillsTested": [
      "Defect Sizing",
      "Overlap Margin",
      "Fascial Closure",
      "Adhesiolysis"
    ],
    "questions": [
      {
        "id": "sim-v2-013-q1",
        "question": "Minimum mesh overlap beyond fascial defect margin?",
        "options": [
          "At least 5 cm circumferentially",
          "1 cm edge-to-edge",
          "No overlap needed",
          "0.5 cm overlap"
        ],
        "correctIndex": 0,
        "explanation": "At least 5 cm circumferentially represents the evidence-based surgical priority in Laparoscopic Ventral/Incisional Hernia (IPOM vs eTEP).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-013-q2",
        "question": "Advantage of primary fascial defect closure prior to mesh?",
        "options": [
          "Increases recurrence rate",
          "Prevents mesh integration",
          "Restores abdominal wall tension and lowers seroma/bulging",
          "Requires double-layer skin excision"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, restores abdominal wall tension and lowers seroma/bulging ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-013-q3",
        "question": "Preferred plane in eTEP / Rives-Stoppa repair?",
        "options": [
          "Subcutaneous above anterior fascia",
          "Directly on skin",
          "Intraluminal",
          "Retrorectus / extraperitoneal space sparing visceral mesh contact"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on retrorectus / extraperitoneal space sparing visceral mesh contact to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Laparoscopic Ventral/Incisional Hernia (IPOM vs eTEP)."
      }
    ]
  },
  {
    "id": "sim-v2-014",
    "title": "Acute Mesenteric Ischemia (SMA Embolism)",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "74F with atrial fibrillation, sudden severe abdominal pain out of proportion to exam.",
    "skillsTested": [
      "CTA Protocol",
      "Embolectomy",
      "Second-Look",
      "Anticoagulation"
    ],
    "questions": [
      {
        "id": "sim-v2-014-q1",
        "question": "Diagnostic test of choice?",
        "options": [
          "Plain upright abdominal X-ray",
          "CT Angiography (arterial + venous phase)",
          "Ultrasound only",
          "Colonoscopy"
        ],
        "correctIndex": 1,
        "explanation": "CT Angiography (arterial + venous phase) represents the evidence-based surgical priority in Acute Mesenteric Ischemia (SMA Embolism).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-014-q2",
        "question": "Intraoperative arterial control after midline laparotomy?",
        "options": [
          "Portal vein ligation",
          "Gastrectomy",
          "SMA Fogarty embolectomy via transverse arteriotomy",
          "Appendectomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, sma fogarty embolectomy via transverse arteriotomy ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-014-q3",
        "question": "Protocol for questionable ischemic bowel segments?",
        "options": [
          "Resect all marginally dusky bowel immediately",
          "Never reopen",
          "Stop anticoagulation forever",
          "Revascularize first, leave open/temporary closure, mandatory 24-48h second-look"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on revascularize first, leave open/temporary closure, mandatory 24-48h second-look to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Mesenteric Ischemia (SMA Embolism)."
      }
    ]
  },
  {
    "id": "sim-v2-015",
    "title": "Gastrointestinal Stromal Tumor (GIST) of Stomach",
    "category": "General Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 21,
    "scenario": "59M with melena, EUS showing 4.5 cm submucosal gastric body mass, CD117/c-KIT+.",
    "skillsTested": [
      "Wedge Resection",
      "Capsule Integrity",
      "Margin Goal",
      "Targeted Therapy"
    ],
    "questions": [
      {
        "id": "sim-v2-015-q1",
        "question": "Oncologic surgical principle for primary gastric GIST?",
        "options": [
          "Wedge resection with negative margins without lymphadenectomy",
          "Mandatory extended D2 gastrectomy",
          "Piecewise enucleation rupture",
          "Routine splenectomy"
        ],
        "correctIndex": 0,
        "explanation": "Wedge resection with negative margins without lymphadenectomy represents the evidence-based surgical priority in Gastrointestinal Stromal Tumor (GIST) of Stomach.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-015-q2",
        "question": "Crucial intraoperative handling precaution?",
        "options": [
          "Biopsy tumor center intra-op",
          "Morcellate specimen freely",
          "Avoid tumor capsule rupture (spillage drives peritoneal recurrence)",
          "Skip margins"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, avoid tumor capsule rupture (spillage drives peritoneal recurrence) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-015-q3",
        "question": "Adjuvant therapy for high-risk KIT exon 11 mutation?",
        "options": [
          "Cisplatin monotherapy",
          "Radiotherapy alone",
          "No follow-up needed",
          "Imatinib mesylate"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on imatinib mesylate to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Gastrointestinal Stromal Tumor (GIST) of Stomach."
      }
    ]
  },
  {
    "id": "sim-v2-016",
    "title": "Symptomatic Splenic Cysts & Partial Splenectomy",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 12,
    "scenario": "29F with 8 cm benign epithelial splenic cyst causing early satiety and LUQ ache.",
    "skillsTested": [
      "Vascular Segments",
      "Parenchymal Preservation",
      "Deroofing",
      "Hemostasis"
    ],
    "questions": [
      {
        "id": "sim-v2-016-q1",
        "question": "Benefit of partial splenectomy / fenestration over total?",
        "options": [
          "Causes higher OPSI risk",
          "Preserves splenic immune function against encapsulated bacteria",
          "Eliminates diaphragm",
          "Doubles portal pressure"
        ],
        "correctIndex": 1,
        "explanation": "Preserves splenic immune function against encapsulated bacteria represents the evidence-based surgical priority in Symptomatic Splenic Cysts & Partial Splenectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-016-q2",
        "question": "Key anatomical plane enabling partial resection?",
        "options": [
          "Hepatic veins",
          "Renal pelvis",
          "Segmental terminal end-artery distribution of splenic poles",
          "Celiac plexus"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, segmental terminal end-artery distribution of splenic poles ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-016-q3",
        "question": "Best hemostatic adjunct on cut splenic edge?",
        "options": [
          "Direct skin suture",
          "Aortic clamp for 2h",
          "Total gastrectomy",
          "Energy device + fibrin/hemostatic matrix/omentoplasty"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on energy device + fibrin/hemostatic matrix/omentoplasty to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Symptomatic Splenic Cysts & Partial Splenectomy."
      }
    ]
  },
  {
    "id": "sim-v2-017",
    "title": "Laparoscopic Sleeve Gastrectomy \u2014 Leak & Staple Line Care",
    "category": "General Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "38F BMI 43 undergoing laparoscopic sleeve gastrectomy over 36-Fr bougie.",
    "skillsTested": [
      "Bougie Sizing",
      "GEJ Angle",
      "Incisura Check",
      "Leak Management"
    ],
    "questions": [
      {
        "id": "sim-v2-017-q1",
        "question": "High-risk zone for post-sleeve staple-line leak?",
        "options": [
          "Proximal staple line near gastroesophageal junction (Angle of His)",
          "Cecum",
          "Pyloric antrum",
          "Transverse colon"
        ],
        "correctIndex": 0,
        "explanation": "Proximal staple line near gastroesophageal junction (Angle of His) represents the evidence-based surgical priority in Laparoscopic Sleeve Gastrectomy \u2014 Leak & Staple Line Care.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-017-q2",
        "question": "Intraoperative prevention of gastric incisura stenosis?",
        "options": [
          "Staple right against lesser curve tightness",
          "Cut vagus nerves",
          "Maintain 36-40 Fr bougie alignment without lateral traction",
          "Omit crural inspection"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, maintain 36-40 fr bougie alignment without lateral traction ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-017-q3",
        "question": "Stable patient Day 7 post-op small GEJ leak management?",
        "options": [
          "Immediate total esophagectomy",
          "Oral contrast meal",
          "Discharge home",
          "NPO, IV antibiotics, drainage + endoscopic stent/internal pigtail"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on npo, iv antibiotics, drainage + endoscopic stent/internal pigtail to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Laparoscopic Sleeve Gastrectomy \u2014 Leak & Staple Line Care."
      }
    ]
  },
  {
    "id": "sim-v2-018",
    "title": "Breast Cancer \u2014 Sentinel Lymph Node Biopsy & BCS",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "51F T1N0 ER+/PR+/HER2- invasive ductal carcinoma undergoing lumpectomy + SLNB.",
    "skillsTested": [
      "Dual Tracer",
      "Axillary Landmarks",
      "Margin Assessment",
      "Specimen Orient"
    ],
    "questions": [
      {
        "id": "sim-v2-018-q1",
        "question": "Standard dual tracer for sentinel lymph node mapping?",
        "options": [
          "Barium sulfate",
          "Technetium-99m sulfur colloid + blue dye (or ICG)",
          "Gadolinium IV",
          "Oral methylene blue"
        ],
        "correctIndex": 1,
        "explanation": "Technetium-99m sulfur colloid + blue dye (or ICG) represents the evidence-based surgical priority in Breast Cancer \u2014 Sentinel Lymph Node Biopsy & BCS.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-018-q2",
        "question": "Adequate no-ink-on-tumor margin criterion for invasive cancer?",
        "options": [
          "Minimum 5 cm margin required",
          "Skin excision mandatory",
          "No tumor cells touching inked specimen edge",
          "Axillary dissection for every T1N0"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, no tumor cells touching inked specimen edge ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-018-q3",
        "question": "Axillary landmark separating Level I from Level II nodes?",
        "options": [
          "Latissimus dorsi",
          "Sternocleidomastoid",
          "Rectus abdominis",
          "Pectoralis minor muscle"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on pectoralis minor muscle to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Breast Cancer \u2014 Sentinel Lymph Node Biopsy & BCS."
      }
    ]
  },
  {
    "id": "sim-v2-019",
    "title": "Acute Cholangitis (Charcot Triad / Reynolds Pentad)",
    "category": "General Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 21,
    "scenario": "70M with fever 39.4\u00b0C, jaundice, RUQ pain, confusion, BP 84/50, dilated 13mm CBD.",
    "skillsTested": [
      "Biliary Sepsis",
      "Early ERCP",
      "Antibiotic Cover",
      "Fluid Bolus"
    ],
    "questions": [
      {
        "id": "sim-v2-019-q1",
        "question": "Reynolds pentad adds which two features to Charcot triad?",
        "options": [
          "Hypotension/shock and altered mental status",
          "Diarrhea and hematuria",
          "Chest pain and syncope",
          "Rash and arthralgia"
        ],
        "correctIndex": 0,
        "explanation": "Hypotension/shock and altered mental status represents the evidence-based surgical priority in Acute Cholangitis (Charcot Triad / Reynolds Pentad).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-019-q2",
        "question": "Definitive emergent source control for Grade III cholangitis?",
        "options": [
          "Elective cholecystectomy in 6 weeks",
          "Oral ursodeoxycholic acid",
          "Urgent biliary decompression (ERCP / PTBD) alongside IV antibiotics",
          "CT guided liver biopsy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, urgent biliary decompression (ercp / ptbd) alongside iv antibiotics ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-019-q3",
        "question": "Timing of laparoscopic cholecystectomy after recovery?",
        "options": [
          "Never remove gallbladder",
          "Wait 5 years",
          "Routine Whipple",
          "Same hospitalization / early interval after cholangitis resolution"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on same hospitalization / early interval after cholangitis resolution to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Cholangitis (Charcot Triad / Reynolds Pentad)."
      }
    ]
  },
  {
    "id": "sim-v2-020",
    "title": "Mirizzi Syndrome Type II Identification Intraoperatively",
    "category": "General Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 12,
    "scenario": "64F chronic gallstones with jaundiced presentation, stone eroding into lateral CHD wall.",
    "skillsTested": [
      "Mirizzi Types",
      "Bailout Subtotal",
      "Choledochoplasty",
      "Frozen Section"
    ],
    "questions": [
      {
        "id": "sim-v2-020-q1",
        "question": "Primary operative hazard in Mirizzi syndrome?",
        "options": [
          "Splenic avulsion",
          "Misidentifying compressed CBD as cystic duct causing major bile duct injury",
          "Ureteral transection",
          "Pneumothorax"
        ],
        "correctIndex": 1,
        "explanation": "Misidentifying compressed CBD as cystic duct causing major bile duct injury represents the evidence-based surgical priority in Mirizzi Syndrome Type II Identification Intraoperatively.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for General Surgery."
      },
      {
        "id": "sim-v2-020-q2",
        "question": "Appropriate repair for Type II (<1/3 CBD wall defect)?",
        "options": [
          "Clip across main CBD",
          "Ignore defect",
          "Subtotal cholecystectomy leaving cuff/flap for choledochoplasty or RYHJ",
          "Immediate right hepatectomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, subtotal cholecystectomy leaving cuff/flap for choledochoplasty or ryhj ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in General Surgery."
      },
      {
        "id": "sim-v2-020-q3",
        "question": "Mandatory exclusion before concluding chronic inflammation?",
        "options": [
          "Skip pathology",
          "Wait for PET in 1 year",
          "Routine appendectomy",
          "Intraoperative frozen section to rule out gallbladder carcinoma"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on intraoperative frozen section to rule out gallbladder carcinoma to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Mirizzi Syndrome Type II Identification Intraoperatively."
      }
    ]
  },
  {
    "id": "sim-v2-021",
    "title": "Tension Pneumothorax & Chest Tube Decompression",
    "category": "Trauma Surgery",
    "difficulty": "beginner",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "24M blunt chest MVC, absent left breath sounds, JVD, tracheal shift, BP 78/48.",
    "skillsTested": [
      "Primary Survey",
      "Needle/Finger Thoracostomy",
      "Tube Positioning",
      "Re-expansion Check"
    ],
    "questions": [
      {
        "id": "sim-v2-021-q1",
        "question": "Immediate life-saving maneuver before chest X-ray?",
        "options": [
          "Needle or finger decompression followed by tube thoracostomy",
          "Await upright CXR first",
          "CT chest angiography",
          "Bronchoscopy"
        ],
        "correctIndex": 0,
        "explanation": "Needle or finger decompression followed by tube thoracostomy represents the evidence-based surgical priority in Tension Pneumothorax & Chest Tube Decompression.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-021-q2",
        "question": "Triangle of safety borders for chest tube insertion?",
        "options": [
          "2nd ICS midclavicular only",
          "Posterior scapula border",
          "Lateral pectoralis major, anterior latissimus dorsi, 5th ICS above nipple/IMF",
          "Subxiphoid midline"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, lateral pectoralis major, anterior latissimus dorsi, 5th ics above nipple/imf ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-021-q3",
        "question": "Persistent massive air leak + >1500mL blood warrants?",
        "options": [
          "Clamp tube tightly",
          "Remove tube immediately",
          "Oral analgesics only",
          "Urgent thoracotomy"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on urgent thoracotomy to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Tension Pneumothorax & Chest Tube Decompression."
      }
    ]
  },
  {
    "id": "sim-v2-022",
    "title": "Massive Hemothorax Management After Penetrating Chest Wound",
    "category": "Trauma Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "30M stab wound right chest, 1650 mL blood immediately upon chest tube placement.",
    "skillsTested": [
      "Thoracotomy Criteria",
      "Autotransfusion",
      "Hilar Clamp",
      "Massive Transfusion"
    ],
    "questions": [
      {
        "id": "sim-v2-022-q1",
        "question": "Immediate threshold criteria met for urgent thoracotomy?",
        "options": [
          "100 mL initial output",
          ">1500 mL initial blood output (or >200 mL/hr x 2-4h)",
          "Small apical cap pneumothorax",
          "Pulse 88 bpm stable"
        ],
        "correctIndex": 1,
        "explanation": ">1500 mL initial blood output (or >200 mL/hr x 2-4h) represents the evidence-based surgical priority in Massive Hemothorax Management After Penetrating Chest Wound.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-022-q2",
        "question": "Preferred incision for unilateral right massive hemothorax?",
        "options": [
          "Suboccipital incision",
          "Pfannenstiel incision",
          "Right posterolateral or anterolateral thoracotomy (4th/5th ICS)",
          "Median neck incision"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, right posterolateral or anterolateral thoracotomy (4th/5th ics) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-022-q3",
        "question": "Resuscitation ratio target in massive transfusion protocol?",
        "options": [
          "10L normal saline alone",
          "Colloid starch only",
          "Platelets withheld",
          "Balanced 1:1:1 PRBC:FFP:platelets + TXA within 3h"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on balanced 1:1:1 prbc:ffp:platelets + txa within 3h to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Massive Hemothorax Management After Penetrating Chest Wound."
      }
    ]
  },
  {
    "id": "sim-v2-023",
    "title": "Blunt Splenic Injury Grade IV \u2014 Angioembolization vs OR",
    "category": "Trauma Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 21,
    "scenario": "28M motorcycle crash, BP 115/74 after 1L, CT shows Grade IV splenic laceration with blush.",
    "skillsTested": [
      "AAST Grading",
      "NOM Criteria",
      "Angioembolization",
      "Hemodynamic Trigger"
    ],
    "questions": [
      {
        "id": "sim-v2-023-q1",
        "question": "Best next step in a fluid-responder with active contrast blush?",
        "options": [
          "Urgent splenic artery angioembolization in IR suite",
          "Immediate discharge",
          "Observation with zero intervention despite blush",
          "Routine craniotomy"
        ],
        "correctIndex": 0,
        "explanation": "Urgent splenic artery angioembolization in IR suite represents the evidence-based surgical priority in Blunt Splenic Injury Grade IV \u2014 Angioembolization vs OR.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-023-q2",
        "question": "Transition trigger from NOM to emergent laparotomy?",
        "options": [
          "Single fever 37.8\u00b0C",
          "Mild LUQ bruise",
          "Hemodynamic instability refractory to resuscitation or peritonitis",
          "Amylase 120 U/L"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, hemodynamic instability refractory to resuscitation or peritonitis ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-023-q3",
        "question": "During trauma splenectomy, avoid injuring?",
        "options": [
          "Right ureter",
          "Sigmoid mesocolon",
          "Right hepatic vein",
          "Pancreatic tail and greater curvature short gastric vessels"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on pancreatic tail and greater curvature short gastric vessels to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Blunt Splenic Injury Grade IV \u2014 Angioembolization vs OR."
      }
    ]
  },
  {
    "id": "sim-v2-024",
    "title": "Damage Control Laparotomy \u2014 Lethal Triad Interruption",
    "category": "Trauma Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 12,
    "scenario": "36M GSW abdomen, BP 70/40, temp 34.4\u00b0C, pH 7.12, INR 2.1, diffuse bleeding.",
    "skillsTested": [
      "Lethal Triad",
      "Four-Quad Packing",
      "Temporary Closure",
      "ICU Rewarming"
    ],
    "questions": [
      {
        "id": "sim-v2-024-q1",
        "question": "Three components of trauma lethal triad (diamond includes Ca2+)?",
        "options": [
          "Hyperthermia, alkalosis, thrombocytosis",
          "Hypothermia, metabolic acidosis, and coagulopathy",
          "Hypertension, bradycardia, fever",
          "Hypoglycemia, hyperkalemia, edema"
        ],
        "correctIndex": 1,
        "explanation": "Hypothermia, metabolic acidosis, and coagulopathy represents the evidence-based surgical priority in Damage Control Laparotomy \u2014 Lethal Triad Interruption.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-024-q2",
        "question": "Duration/goal of initial damage control laparotomy?",
        "options": [
          "Perform definitive 4-hour formal Whipple + mesh repair",
          "Primary fascial closure under extreme tension",
          "Control hemorrhage & GI contamination quickly (<60-90 min), pack, temporary cover",
          "Leave GI perforations open without control"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, control hemorrhage & gi contamination quickly (<60-90 min), pack, temporary cover ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-024-q3",
        "question": "Correct return-to-OR timing for pack removal?",
        "options": [
          "At 2 hours while cold and acidotic",
          "Wait 3 weeks",
          "Never remove packs",
          "24-48h after physiology normalized (normothermia, pH >7.25, lactate clearing)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on 24-48h after physiology normalized (normothermia, ph >7.25, lactate clearing) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Damage Control Laparotomy \u2014 Lethal Triad Interruption."
      }
    ]
  },
  {
    "id": "sim-v2-025",
    "title": "Cardiac Tamponade & Resuscitative ED Thoracotomy",
    "category": "Trauma Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "22M precordial stab wound, loses pulses on arrival to trauma bay (witnessed <5 min).",
    "skillsTested": [
      "Beck Triad",
      "Left Anterolateral",
      "Pericardiotomy",
      "Aortic Clamp"
    ],
    "questions": [
      {
        "id": "sim-v2-025-q1",
        "question": "First step upon opening left 5th ICS chest in witnessed arrest?",
        "options": [
          "Longitudinal pericardiotomy anterior to phrenic nerve to relieve tamponade",
          "Blind chest compressions externally",
          "Wait for formal CT cardiac",
          "Give oral aspirin"
        ],
        "correctIndex": 0,
        "explanation": "Longitudinal pericardiotomy anterior to phrenic nerve to relieve tamponade represents the evidence-based surgical priority in Cardiac Tamponade & Resuscitative ED Thoracotomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-025-q2",
        "question": "Landmark to protect during pericardial incision?",
        "options": [
          "Thoracic duct",
          "Right vagus",
          "Left phrenic nerve running laterally along pericardium",
          "Brachial plexus"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, left phrenic nerve running laterally along pericardium ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-025-q3",
        "question": "Temporary control of 1.5 cm RV laceration in ED?",
        "options": [
          "Clamp right ventricle with Kocher",
          "Immediate cardiopulmonary bypass in bay",
          "Leave open",
          "Foley catheter balloon tamponade gently or digital pressure + pledgeted sutures"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on foley catheter balloon tamponade gently or digital pressure + pledgeted sutures to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Cardiac Tamponade & Resuscitative ED Thoracotomy."
      }
    ]
  },
  {
    "id": "sim-v2-026",
    "title": "Pelvic Ring Fracture with Hemodynamic Instability (Preperitoneal Packing)",
    "category": "Trauma Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "41M fall from 4th floor, open-book pelvic fracture, BP 75/45, negative FAST abdomen.",
    "skillsTested": [
      "Pelvic Binder",
      "Preperitoneal Packing",
      "Angiography",
      "External Fixator"
    ],
    "questions": [
      {
        "id": "sim-v2-026-q1",
        "question": "Immediate bedside mechanical stabilization in trauma bay?",
        "options": [
          "Binder high around ribs",
          "Circumferential pelvic binder centered over greater trochanters",
          "Internal hip arthroplasty in ED",
          "Prone positioning"
        ],
        "correctIndex": 1,
        "explanation": "Circumferential pelvic binder centered over greater trochanters represents the evidence-based surgical priority in Pelvic Ring Fracture with Hemodynamic Instability (Preperitoneal Packing).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-026-q2",
        "question": "If persistent shock despite pelvic binder and negative FAST?",
        "options": [
          "Wait for MRI pelvis",
          "Laparotomy for appendectomy",
          "Preperitoneal pelvic packing +/- external fixation +/- REBOA/angio",
          "Give 8L hypotonic dextrose"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, preperitoneal pelvic packing +/- external fixation +/- reboa/angio ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-026-q3",
        "question": "Main venous source of massive retroperitoneal pelvic bleeding?",
        "options": [
          "Common carotid artery",
          "Renal capsule",
          "Mesenteric root",
          "Presacral and perivesical venous plexus (~85% venous)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on presacral and perivesical venous plexus (~85% venous) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Pelvic Ring Fracture with Hemodynamic Instability (Preperitoneal Packing)."
      }
    ]
  },
  {
    "id": "sim-v2-027",
    "title": "Zone II Penetrating Neck Injury \u2014 Hard Signs Protocol",
    "category": "Trauma Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 21,
    "scenario": "27M stab wound right anterior neck Zone II with pulsatile bleeding & expanding hematoma.",
    "skillsTested": [
      "Neck Zones",
      "Hard Signs",
      "SCM Approach",
      "Aerodigestive Check"
    ],
    "questions": [
      {
        "id": "sim-v2-027-q1",
        "question": "Hard sign of vascular injury mandates?",
        "options": [
          "Immediate operative neck exploration via anterior SCM incision",
          "Outpatient ENT follow-up",
          "Watchful waiting for 48h",
          "Blind deep probing in trauma bay"
        ],
        "correctIndex": 0,
        "explanation": "Immediate operative neck exploration via anterior SCM incision represents the evidence-based surgical priority in Zone II Penetrating Neck Injury \u2014 Hard Signs Protocol.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-027-q2",
        "question": "Zone II neck boundaries?",
        "options": [
          "Clavicle to cricoid",
          "Angle of mandible to skull base",
          "Cricoid cartilage inferiorly to angle of mandible superiorly",
          "Suprasternal notch to umbilicus"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, cricoid cartilage inferiorly to angle of mandible superiorly ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-027-q3",
        "question": "Mandatory intraoperative evaluation alongside carotid/IJV repair?",
        "options": [
          "Leave esophagus unexamined",
          "Ligate both internal carotids",
          "Immediate tracheostomy in every case",
          "Inspect trachea and esophagus (endoscopy/methylene blue check)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on inspect trachea and esophagus (endoscopy/methylene blue check) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Zone II Penetrating Neck Injury \u2014 Hard Signs Protocol."
      }
    ]
  },
  {
    "id": "sim-v2-028",
    "title": "Duodenal Hematoma vs Retroperitoneal Perforation (Zone I)",
    "category": "Trauma Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 12,
    "scenario": "19M handlebar blunt epigastric trauma, CT shows retroperitoneal air & fluid near D2/D3.",
    "skillsTested": [
      "Kocher Maneuver",
      "Cattell-Braasch",
      "Primary Repair",
      "Pyloric Exclusion"
    ],
    "questions": [
      {
        "id": "sim-v2-028-q1",
        "question": "Operative exposure for posterior duodenum and pancreatic head?",
        "options": [
          "Left lateral thoracotomy",
          "Extended Kocher maneuver + Cattell-Braasch medial visceral rotation",
          "Mattox left-to-right rotation only",
          "McBurney incision"
        ],
        "correctIndex": 1,
        "explanation": "Extended Kocher maneuver + Cattell-Braasch medial visceral rotation represents the evidence-based surgical priority in Duodenal Hematoma vs Retroperitoneal Perforation (Zone I).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-028-q2",
        "question": "Management of clean >50% D2 duodenal tear without pancreatic duct injury?",
        "options": [
          "Observation NPO only despite free air",
          "Immediate total pancreatectomy",
          "Two-layer tension-free debridement & repair +/- pyloric exclusion/drainage",
          "Primary skin closure over open duodenum"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, two-layer tension-free debridement & repair +/- pyloric exclusion/drainage ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-028-q3",
        "question": "If blunt intramural duodenal hematoma WITHOUT perforation?",
        "options": [
          "Immediate Whipple Day 1",
          "Colectomy",
          "Splenectomy",
          "Conservative NPO, NG decompression, TPN for 10-14 days"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on conservative npo, ng decompression, tpn for 10-14 days to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Duodenal Hematoma vs Retroperitoneal Perforation (Zone I)."
      }
    ]
  },
  {
    "id": "sim-v2-029",
    "title": "Extremity Compartment Syndrome \u2014 Four-Compartment Fasciotomy",
    "category": "Trauma Surgery",
    "difficulty": "beginner",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "32M tibial plateau crush fracture, severe pain on passive stretch, tense calf, delta-P 18.",
    "skillsTested": [
      "Delta-P Formula",
      "Two-Incision Release",
      "Peroneal Nerve",
      "Delayed Closure"
    ],
    "questions": [
      {
        "id": "sim-v2-029-q1",
        "question": "Diagnostic perfusion pressure (Delta-P) threshold for compartment syndrome?",
        "options": [
          "Diastolic BP minus compartment pressure < 30 mmHg",
          "Systolic BP > 160 mmHg",
          "Compartment pressure < 5 mmHg",
          "Absent femoral pulse only"
        ],
        "correctIndex": 0,
        "explanation": "Diastolic BP minus compartment pressure < 30 mmHg represents the evidence-based surgical priority in Extremity Compartment Syndrome \u2014 Four-Compartment Fasciotomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-029-q2",
        "question": "Wait for pulselessness before fasciotomy?",
        "options": [
          "Yes, wait until foot turns black",
          "Wait 24h for MRI",
          "NO \u2014 pulselessness is a late sign; decompress on clinical/Delta-P criteria",
          "Elevate limb above chest tightly"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, no \u2014 pulselessness is a late sign; decompress on clinical/delta-p criteria ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-029-q3",
        "question": "Which four leg compartments must be released?",
        "options": [
          "Anterior only",
          "Posterior only",
          "Plantar foot only",
          "Anterior, lateral, superficial posterior, and deep posterior"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on anterior, lateral, superficial posterior, and deep posterior to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Extremity Compartment Syndrome \u2014 Four-Compartment Fasciotomy."
      }
    ]
  },
  {
    "id": "sim-v2-030",
    "title": "Pringle Maneuver & Hepatic Packing in Severe Liver Trauma",
    "category": "Trauma Surgery",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "35M high-speed MVC with Grade V liver laceration, massive venous hemorrhage on entry.",
    "skillsTested": [
      "Pringle Clamp",
      "Hepatic Packing",
      "Venous Bypass",
      "Bile Leak Check"
    ],
    "questions": [
      {
        "id": "sim-v2-030-q1",
        "question": "Pringle maneuver occludes which vessels?",
        "options": [
          "Retrohepatic IVC",
          "Hepatic artery and portal vein inside hepatoduodenal ligament",
          "Aorta and celiac trunk",
          "Splenic artery"
        ],
        "correctIndex": 1,
        "explanation": "Hepatic artery and portal vein inside hepatoduodenal ligament represents the evidence-based surgical priority in Pringle Maneuver & Hepatic Packing in Severe Liver Trauma.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Trauma Surgery."
      },
      {
        "id": "sim-v2-030-q2",
        "question": "If torrential dark bleeding CONTINUES despite tight Pringle clamp?",
        "options": [
          "Release packs and dissect blind behind liver",
          "Clamp abdominal aorta for 2 hours",
          "Suspect retrohepatic IVC or main hepatic vein injury \u2014 pack & avoid unroofing",
          "Perform immediate outpatient ultrasound"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, suspect retrohepatic ivc or main hepatic vein injury \u2014 pack & avoid unroofing ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Trauma Surgery."
      },
      {
        "id": "sim-v2-030-q3",
        "question": "Temporary perihepatic packing direction?",
        "options": [
          "Pack inside stomach",
          "Wrap bowel around hilum",
          "Use unsterile towels",
          "Compress liver parenchyma between diaphragm and costal margin without IVC kink"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on compress liver parenchyma between diaphragm and costal margin without ivc kink to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Pringle Maneuver & Hepatic Packing in Severe Liver Trauma."
      }
    ]
  },
  {
    "id": "sim-v2-031",
    "title": "Ruptured Abdominal Aortic Aneurysm (rAAA) \u2014 EVAR vs Open",
    "category": "Vascular Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 21,
    "scenario": "73M smoker with back pain, hypotension 82/50, pulsatile abdominal mass, CTA infrarenal rAAA.",
    "skillsTested": [
      "Permissive Hypotension",
      "Supraceliac Clamp",
      "EVAR Anatomy",
      "Abdominal Compartment"
    ],
    "questions": [
      {
        "id": "sim-v2-031-q1",
        "question": "Permissive hypotension target SBP in awake rAAA patient prior to control?",
        "options": [
          "70-90 mmHg (avoid blowing off retroperitoneal tamponade clot)",
          "180 mmHg with pressors",
          "Aggressive 6L crystalloid bolus",
          "Zero blood crossmatch"
        ],
        "correctIndex": 0,
        "explanation": "70-90 mmHg (avoid blowing off retroperitoneal tamponade clot) represents the evidence-based surgical priority in Ruptured Abdominal Aortic Aneurysm (rAAA) \u2014 EVAR vs Open.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-031-q2",
        "question": "Key anatomical requirement for emergent EVAR?",
        "options": [
          "Any thoracic arch aneurysm",
          "Absent renal arteries",
          "Adequate infrarenal aortic neck length (>=10-15mm) & iliac access",
          "Complete aortic occlusion"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, adequate infrarenal aortic neck length (>=10-15mm) & iliac access ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-031-q3",
        "question": "Major post-op complication after rAAA repair with oliguria & high airway pressures?",
        "options": [
          "Cholecystitis",
          "DVT only",
          "Migraine",
          "Abdominal compartment syndrome (bladder pressure >20 mmHg)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on abdominal compartment syndrome (bladder pressure >20 mmhg) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Ruptured Abdominal Aortic Aneurysm (rAAA) \u2014 EVAR vs Open."
      }
    ]
  },
  {
    "id": "sim-v2-032",
    "title": "Acute Limb Ischemia (Rutherford IIb) \u2014 Femoral Embolectomy",
    "category": "Vascular Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 12,
    "scenario": "77F with AF, sudden cold white painful foot, motor weakness, absent pedal Dopplers.",
    "skillsTested": [
      "Rutherford Class",
      "Heparin Bolus",
      "Fogarty Catheter",
      "Fasciotomy"
    ],
    "questions": [
      {
        "id": "sim-v2-032-q1",
        "question": "Immediate pharmacologic step in the ED?",
        "options": [
          "Aspirin only and MRI tomorrow",
          "Systemic IV unfractionated heparin bolus (80 U/kg) + vascular OR",
          "Elevate leg vertically",
          "Wait 72 hours for collateral growth"
        ],
        "correctIndex": 1,
        "explanation": "Systemic IV unfractionated heparin bolus (80 U/kg) + vascular OR represents the evidence-based surgical priority in Acute Limb Ischemia (Rutherford IIb) \u2014 Femoral Embolectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-032-q2",
        "question": "Rutherford IIb (motor deficit + sensory loss) indicates?",
        "options": [
          "Irreversible gangrene (amputate only)",
          "Mild claudication",
          "Immediately threatened limb requiring emergent surgical revascularization",
          "Venous insufficiency"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, immediately threatened limb requiring emergent surgical revascularization ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-032-q3",
        "question": "Critical post-reperfusion precaution after >6h ischemia?",
        "options": [
          "Tight elastic compression cast",
          "Stop IV hydration",
          "Immobilize cold",
          "Prophylactic 4-compartment fasciotomy & monitor for hyperkalemia/myoglobinuria"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on prophylactic 4-compartment fasciotomy & monitor for hyperkalemia/myoglobinuria to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Limb Ischemia (Rutherford IIb) \u2014 Femoral Embolectomy."
      }
    ]
  },
  {
    "id": "sim-v2-033",
    "title": "Symptomatic High-Grade Internal Carotid Artery Stenosis (CEA)",
    "category": "Vascular Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 15,
    "scenario": "69M recent left amaurosis fugax, duplex showing 85% left ICA stenosis.",
    "skillsTested": [
      "NASCET Criteria",
      "Cranial Nerves",
      "Selective Shunt",
      "Patch Closure"
    ],
    "questions": [
      {
        "id": "sim-v2-033-q1",
        "question": "Optimal timing of carotid endarterectomy after minor TIA/stroke?",
        "options": [
          "Within 14 days (ideally 48h-14d once stable)",
          "Delay 6 months",
          "Never operate",
          "Emergent surgery in massive hemorrhagic stroke"
        ],
        "correctIndex": 0,
        "explanation": "Within 14 days (ideally 48h-14d once stable) represents the evidence-based surgical priority in Symptomatic High-Grade Internal Carotid Artery Stenosis (CEA).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-033-q2",
        "question": "Which nerve crosses anteriorly over the carotid bifurcation near digastric?",
        "options": [
          "Sciatic nerve",
          "Phrenic nerve",
          "Hypoglossal nerve (CN XII)",
          "Median nerve"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, hypoglossal nerve (cn xii) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-033-q3",
        "question": "Post-op expanding neck hematoma causing stridor requires?",
        "options": [
          "Wait for CT neck",
          "Increase heparin",
          "Oral steroids alone",
          "Immediate bedside/OR wound opening to evacuate clot before intubation crash"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on immediate bedside/or wound opening to evacuate clot before intubation crash to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Symptomatic High-Grade Internal Carotid Artery Stenosis (CEA)."
      }
    ]
  },
  {
    "id": "sim-v2-034",
    "title": "Type B Acute Aortic Dissection \u2014 Complicated vs Uncomplicated",
    "category": "Vascular Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 18,
    "scenario": "62M severe tearing interscapular pain, BP 210/115, CTA dissection distal to left subclavian.",
    "skillsTested": [
      "Anti-Impulse Therapy",
      "Esmolol First",
      "Malperfusion Signs",
      "TEVAR Indications"
    ],
    "questions": [
      {
        "id": "sim-v2-034-q1",
        "question": "First-line antihypertensive drug sequence in acute Type B dissection?",
        "options": [
          "Nitroprusside alone first (causes reflex tachycardia)",
          "IV beta-blocker FIRST (esmolol/labetalol) HR <60, THEN vasodilator (nicardipine)",
          "Oral furosemide",
          "Thrombolytics (tPA)"
        ],
        "correctIndex": 1,
        "explanation": "IV beta-blocker FIRST (esmolol/labetalol) HR <60, THEN vasodilator (nicardipine) represents the evidence-based surgical priority in Type B Acute Aortic Dissection \u2014 Complicated vs Uncomplicated.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-034-q2",
        "question": "Indication for emergent TEVAR in acute Type B dissection?",
        "options": [
          "Uncomplicated asymptomatic chronic 4.0 cm",
          "Young athlete checkup",
          "Visceral/renal/limb malperfusion, rupture, or refractory pain/HTN",
          "Isolated radial pulse symmetry"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, visceral/renal/limb malperfusion, rupture, or refractory pain/htn ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-034-q3",
        "question": "Spinal cord protection step in extensive TEVAR?",
        "options": [
          "Drop MAP to 45 mmHg",
          "Ligate internal iliacs",
          "No BP monitoring",
          "Maintain MAP >80-90 mmHg, CSF lumbar drain if high risk, preserve left SCA"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on maintain map >80-90 mmhg, csf lumbar drain if high risk, preserve left sca to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Type B Acute Aortic Dissection \u2014 Complicated vs Uncomplicated."
      }
    ]
  },
  {
    "id": "sim-v2-035",
    "title": "Critical Limb-Threatening Ischemia (Femoral-Tibial Bypass)",
    "category": "Vascular Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 21,
    "scenario": "66M diabetic with non-healing 1st toe ulcer, ABI 0.34, long SFA occlusion.",
    "skillsTested": [
      "Angiogram Runoff",
      "GSV Conduit",
      "Distal Target",
      "Graft Surveillance"
    ],
    "questions": [
      {
        "id": "sim-v2-035-q1",
        "question": "Superior conduit for infrapopliteal arterial bypass?",
        "options": [
          "Autologous single-segment great saphenous vein (GSV)",
          "Dacron below knee",
          "Nylon suture graft",
          "No conduit needed"
        ],
        "correctIndex": 0,
        "explanation": "Autologous single-segment great saphenous vein (GSV) represents the evidence-based surgical priority in Critical Limb-Threatening Ischemia (Femoral-Tibial Bypass).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-035-q2",
        "question": "Essential pre-op imaging before distal bypass?",
        "options": [
          "CXR alone",
          "Bone scan",
          "Diagnostic angiogram/CTA showing inflow and distal tibial target vessel runoff",
          "No imaging"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, diagnostic angiogram/cta showing inflow and distal tibial target vessel runoff ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-035-q3",
        "question": "Post-op duplex surveillance schedule purpose?",
        "options": [
          "Check DVT only",
          "Look for osteomyelitis",
          "Replace antibiotics",
          "Detect failing-graft intimal hyperplasia before thrombosis occurs"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on detect failing-graft intimal hyperplasia before thrombosis occurs to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Critical Limb-Threatening Ischemia (Femoral-Tibial Bypass)."
      }
    ]
  },
  {
    "id": "sim-v2-036",
    "title": "Arteriovenous Fistula Creation (Radiocephalic vs Brachiocephalic)",
    "category": "Vascular Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 12,
    "scenario": "54F CKD stage 5 requiring permanent hemodialysis access, radial pulse strong, vein 3.2mm.",
    "skillsTested": [
      "Vein Mapping",
      "Rule of 6s",
      "Steal Syndrome",
      "Distal First"
    ],
    "questions": [
      {
        "id": "sim-v2-036-q1",
        "question": "Standard sequence principle for hemodialysis access?",
        "options": [
          "Femoral prosthetic graft first",
          "Distal-to-proximal, autogenous fistula first (radiocephalic > brachiocephalic > graft)",
          "Internal jugular tunneled catheter permanently",
          "Brachial ligation"
        ],
        "correctIndex": 1,
        "explanation": "Distal-to-proximal, autogenous fistula first (radiocephalic > brachiocephalic > graft) represents the evidence-based surgical priority in Arteriovenous Fistula Creation (Radiocephalic vs Brachiocephalic).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-036-q2",
        "question": "Rule of 6s for mature AVF readiness?",
        "options": [
          "100 mL/min at 6 days",
          "2 cm deep at 6 months",
          "Flow >=600 mL/min, diameter >=6 mm, depth <=6 mm at ~6 weeks",
          "No thrill required"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, flow >=600 ml/min, diameter >=6 mm, depth <=6 mm at ~6 weeks ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-036-q3",
        "question": "Painful cold pale hand immediately after brachiocephalic AVF indicates?",
        "options": [
          "Expected normal finding",
          "Cellulitis",
          "Allergic reaction",
          "Dialysis access-associated steal syndrome (DRIL/banding evaluation)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on dialysis access-associated steal syndrome (dril/banding evaluation) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Arteriovenous Fistula Creation (Radiocephalic vs Brachiocephalic)."
      }
    ]
  },
  {
    "id": "sim-v2-037",
    "title": "Popliteal Artery Aneurysm with Acute Thrombosis Risk",
    "category": "Vascular Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 15,
    "scenario": "71M with bilateral prominent popliteal pulses, US shows 2.8 cm right popliteal aneurysm with mural thrombus.",
    "skillsTested": [
      "Thromboembolism Risk",
      "Saphenous Bypass",
      "Ligation Exclusion",
      "AAA Screening"
    ],
    "questions": [
      {
        "id": "sim-v2-037-q1",
        "question": "Primary complication of popliteal artery aneurysms (unlike AAA)?",
        "options": [
          "Distal thromboembolization and acute thrombosis rather than free rupture",
          "Rupture >90%",
          "Fistula to ureter",
          "Hypertension"
        ],
        "correctIndex": 0,
        "explanation": "Distal thromboembolization and acute thrombosis rather than free rupture represents the evidence-based surgical priority in Popliteal Artery Aneurysm with Acute Thrombosis Risk.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-037-q2",
        "question": "Mandatory contralateral screening test in any popliteal aneurysm patient?",
        "options": [
          "Screen carotid sinus only",
          "Order head CT",
          "Screen contralateral popliteal artery AND abdominal aorta (high coexistence)",
          "Check plantar fascia"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, screen contralateral popliteal artery and abdominal aorta (high coexistence) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-037-q3",
        "question": "Standard surgical repair method?",
        "options": [
          "Simple observation at 3.5 cm",
          "Anticoagulation alone",
          "Above-knee amputation first",
          "Ligation (exclusion) + great saphenous vein bypass (medial approach)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on ligation (exclusion) + great saphenous vein bypass (medial approach) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Popliteal Artery Aneurysm with Acute Thrombosis Risk."
      }
    ]
  },
  {
    "id": "sim-v2-038",
    "title": "Phlegmasia Cerulea Dolens \u2014 Emergent Venous Thrombectomy",
    "category": "Vascular Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 18,
    "scenario": "58F malignancy with massively swollen cyanotic painful left leg, blistered skin, weak pedal pulse.",
    "skillsTested": [
      "Iliofemoral DVT",
      "Anticoagulation",
      "Catheter Thrombolysis",
      "Compartment Check"
    ],
    "questions": [
      {
        "id": "sim-v2-038-q1",
        "question": "Urgent danger in phlegmasia cerulea dolens?",
        "options": [
          "Superficial varicosities only",
          "Venous gangrene, hypovolemic shock, and limb loss",
          "Benign lymphedema",
          "Muscle cramp"
        ],
        "correctIndex": 1,
        "explanation": "Venous gangrene, hypovolemic shock, and limb loss represents the evidence-based surgical priority in Phlegmasia Cerulea Dolens \u2014 Emergent Venous Thrombectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-038-q2",
        "question": "Immediate treatment initiation?",
        "options": [
          "Outpatient compression stocking only",
          "Diuretics and bedrest only",
          "Immediate systemic heparin, leg elevation, fluid resuscitation + CDT/mechanical thrombectomy",
          "Arterial ligation"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, immediate systemic heparin, leg elevation, fluid resuscitation + cdt/mechanical thrombectomy ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-038-q3",
        "question": "Assess May-Thurner anatomic compression at?",
        "options": [
          "Popliteal fossa",
          "Superior vena cava",
          "Femoral neck",
          "Left common iliac vein compressed by right common iliac artery"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on left common iliac vein compressed by right common iliac artery to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Phlegmasia Cerulea Dolens \u2014 Emergent Venous Thrombectomy."
      }
    ]
  },
  {
    "id": "sim-v2-039",
    "title": "Mesenteric Bypass for Chronic Mesenteric Ischemia",
    "category": "Vascular Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 21,
    "scenario": "67F with postprandial pain ('food fear'), 15 kg weight loss, CTA severe celiac + SMA stenosis.",
    "skillsTested": [
      "Postprandial Pain",
      "Endovascular First",
      "Open Bypass",
      "Re-feeding Care"
    ],
    "questions": [
      {
        "id": "sim-v2-039-q1",
        "question": "Minimum mesenteric vessels typically compromised for symptomatic CMI?",
        "options": [
          "At least two of the three mesenteric arteries (celiac, SMA, IMA)",
          "IMA alone",
          "Single splenic branch",
          "Appendiceal artery"
        ],
        "correctIndex": 0,
        "explanation": "At least two of the three mesenteric arteries (celiac, SMA, IMA) represents the evidence-based surgical priority in Mesenteric Bypass for Chronic Mesenteric Ischemia.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-039-q2",
        "question": "First-line approach in suitable focal ostial SMA/celiac lesions?",
        "options": [
          "Total colectomy",
          "Gastrectomy",
          "Endovascular angioplasty and stenting (open bypass if anatomy unsuitable)",
          "No revascularization"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, endovascular angioplasty and stenting (open bypass if anatomy unsuitable) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-039-q3",
        "question": "Monitor post-revascularization for?",
        "options": [
          "Thyroid storm",
          "Pneumothorax",
          "Retinal detachment",
          "Bowel edema/reperfusion syndrome & early refeeding electrolyte shifts"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on bowel edema/reperfusion syndrome & early refeeding electrolyte shifts to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Mesenteric Bypass for Chronic Mesenteric Ischemia."
      }
    ]
  },
  {
    "id": "sim-v2-040",
    "title": "Infected Femoral Prosthetic Graft \u2014 Explantation & Cryopreserved/Vein",
    "category": "Vascular Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 12,
    "scenario": "65M 4 months post-aortobifemoral Dacron graft presents with groin sinus tract & MRSA bacteremia.",
    "skillsTested": [
      "Graft Infection",
      "Total Excision",
      "Extra-Anatomic",
      "Sartorius Flap"
    ],
    "questions": [
      {
        "id": "sim-v2-040-q1",
        "question": "Definitive principle for exposed infected prosthetic arterial graft?",
        "options": [
          "Oral amoxicillin for 7 days leaving graft",
          "Complete excision of infected graft + autogenous/cryopreserved or extra-anatomic bypass",
          "Simple skin stitch over pus",
          "Superficial dressing changes forever"
        ],
        "correctIndex": 1,
        "explanation": "Complete excision of infected graft + autogenous/cryopreserved or extra-anatomic bypass represents the evidence-based surgical priority in Infected Femoral Prosthetic Graft \u2014 Explantation & Cryopreserved/Vein.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Vascular Surgery."
      },
      {
        "id": "sim-v2-040-q2",
        "question": "Muscle flap commonly used to cover exposed femoral vessels after debridement?",
        "options": [
          "Rectus capitis",
          "Masseter flap",
          "Sartorius muscle transposition flap",
          "Soleus flap"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, sartorius muscle transposition flap ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Vascular Surgery."
      },
      {
        "id": "sim-v2-040-q3",
        "question": "Extra-anatomic bypass route bypassing infected groin?",
        "options": [
          "Directly through abscess cavity",
          "Trans-hepatic",
          "None needed",
          "Obturator or axillofemoral/femoral-femoral clean tunnel"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on obturator or axillofemoral/femoral-femoral clean tunnel to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Infected Femoral Prosthetic Graft \u2014 Explantation & Cryopreserved/Vein."
      }
    ]
  },
  {
    "id": "sim-v2-041",
    "title": "Left Main Coronary Artery Disease \u2014 On-Pump CABG",
    "category": "Cardiac Surgery",
    "difficulty": "beginner",
    "urgency": "urgent",
    "estimatedMinutes": 15,
    "scenario": "64M with 80% distal left main stenosis and diabetes (SYNTAX 36), EF 45%.",
    "skillsTested": [
      "LIMA Harvesting",
      "Cardioplegia",
      "Distal Anastomosis",
      "Protamine Reversal"
    ],
    "questions": [
      {
        "id": "sim-v2-041-q1",
        "question": "Gold-standard conduit to LAD for long-term survival?",
        "options": [
          "Left internal mammary artery (LIMA) pedicled/skeletonized",
          "Prosthetic PTFE",
          "Basilic vein",
          "Radial graft to RCA only"
        ],
        "correctIndex": 0,
        "explanation": "Left internal mammary artery (LIMA) pedicled/skeletonized represents the evidence-based surgical priority in Left Main Coronary Artery Disease \u2014 On-Pump CABG.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-041-q2",
        "question": "Target Activated Clotting Time (ACT) before initiating CPB?",
        "options": [
          "120 seconds",
          "50 seconds",
          ">= 480 seconds (typically >400-480s)",
          "900 seconds mandatory"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, >= 480 seconds (typically >400-480s) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-041-q3",
        "question": "Watch for acute hypotension + pulmonary vasoconstriction during?",
        "options": [
          "Skin incision",
          "Chest tube removal Day 3",
          "Sternal wire tightening",
          "Protamine sulfate administration (anaphylactoid/heparin-protamine reaction)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on protamine sulfate administration (anaphylactoid/heparin-protamine reaction) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Left Main Coronary Artery Disease \u2014 On-Pump CABG."
      }
    ]
  },
  {
    "id": "sim-v2-042",
    "title": "Acute Type A Aortic Dissection \u2014 Ascending Replacement",
    "category": "Cardiac Surgery",
    "difficulty": "urgent",
    "urgency": "urgent",
    "estimatedMinutes": 18,
    "scenario": "55M hypertensive with sudden chest pain, new aortic regurgitation, CTA flap from root to arch.",
    "skillsTested": [
      "Emergent OR",
      "Axillary Cannulation",
      "Hemiarch Repair",
      "DHCA"
    ],
    "questions": [
      {
        "id": "sim-v2-042-q1",
        "question": "Why is Acute Type A aortic dissection an immediate surgical emergency?",
        "options": [
          "Can wait 3 weeks on beta-blockers",
          "Risk of free intrapericardial tamponade, coronary occlusion, and acute AR",
          "Treated by TEVAR alone",
          "Heals spontaneously"
        ],
        "correctIndex": 1,
        "explanation": "Risk of free intrapericardial tamponade, coronary occlusion, and acute AR represents the evidence-based surgical priority in Acute Type A Aortic Dissection \u2014 Ascending Replacement.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-042-q2",
        "question": "Preferred arterial cannulation site preserving true-lumen & cerebral perfusion?",
        "options": [
          "Blind retrograde femoral in dissected lumen",
          "Pulmonary artery",
          "Right axillary artery (or direct central true lumen)",
          "Coronary sinus"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, right axillary artery (or direct central true lumen) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-042-q3",
        "question": "Goal of proximal and distal surgical repair?",
        "options": [
          "Wrap aorta with gauze",
          "Stent coronary only",
          "Pericardiocentesis alone",
          "Resect primary intimal tear, resuspend/replace valve, open distal hemiarch under arrest"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on resect primary intimal tear, resuspend/replace valve, open distal hemiarch under arrest to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Type A Aortic Dissection \u2014 Ascending Replacement."
      }
    ]
  },
  {
    "id": "sim-v2-043",
    "title": "Severe Symptomatic Aortic Stenosis \u2014 SAVR Mechanical vs Bioprosthetic",
    "category": "Cardiac Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 21,
    "scenario": "58M active patient with bicuspid calcific severe AS (AVA 0.7 cm2), annular diameter 23mm.",
    "skillsTested": [
      "Valve Choice",
      "Aortotomy",
      "Debridement Safety",
      "AV Block Risk"
    ],
    "questions": [
      {
        "id": "sim-v2-043-q1",
        "question": "Major trade-off in choosing mechanical vs tissue valve at age 58?",
        "options": [
          "Mechanical: lifelong warfarin + durability vs Tissue: structural degeneration risk",
          "Tissue needs lifelong warfarin",
          "Mechanical lasts 5 years",
          "Zero difference"
        ],
        "correctIndex": 0,
        "explanation": "Mechanical: lifelong warfarin + durability vs Tissue: structural degeneration risk represents the evidence-based surgical priority in Severe Symptomatic Aortic Stenosis \u2014 SAVR Mechanical vs Bioprosthetic.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-043-q2",
        "question": "Conduction injury risk when debriding calcium near non-coronary/right cusp?",
        "options": [
          "Wound numbness",
          "Femoral nerve palsy",
          "Complete heart block (AV node / Bundle of His injury)",
          "Vocal cord spasm"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, complete heart block (av node / bundle of his injury) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-043-q3",
        "question": "Target INR for modern bileaflet mechanical aortic valve (no AF)?",
        "options": [
          "1.0",
          "5.5",
          "0.8",
          "2.0 - 3.0 (typically 2.5)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on 2.0 - 3.0 (typically 2.5) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Severe Symptomatic Aortic Stenosis \u2014 SAVR Mechanical vs Bioprosthetic."
      }
    ]
  },
  {
    "id": "sim-v2-044",
    "title": "Post-Op Cardiac Tamponade After Sternotomy",
    "category": "Cardiac Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 12,
    "scenario": "66M 4 hours post-CABG: chest tube output suddenly drops from 180 to 0 mL/h, CVP 22, BP 74/48.",
    "skillsTested": [
      "Clogged Drain",
      "BECK Triad ICU",
      "Emergent Restenotomy",
      "Fluid Bolus"
    ],
    "questions": [
      {
        "id": "sim-v2-044-q1",
        "question": "Most urgent likely diagnosis when drain output abruptly ceases with shock?",
        "options": [
          "Benign diuresis",
          "Acute mediastinal clot tamponade compressing right heart chambers",
          "Mild pain",
          "Statin side effect"
        ],
        "correctIndex": 1,
        "explanation": "Acute mediastinal clot tamponade compressing right heart chambers represents the evidence-based surgical priority in Post-Op Cardiac Tamponade After Sternotomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-044-q2",
        "question": "Immediate management in ICU hemodynamic collapse?",
        "options": [
          "Wait 12h for TTE",
          "Give furosemide 80 mg",
          "Prepare for emergent bedside/OR chest reopening (resternotomy) + fluid/inotropes",
          "Turn off pressors"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, prepare for emergent bedside/or chest reopening (resternotomy) + fluid/inotropes ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-044-q3",
        "question": "Chest tube stripping rule?",
        "options": [
          "Pull tubes out entirely without backup",
          "Inject air into mediastinum",
          "Wait for morning rounds",
          "Milk/strip carefully or check patency; never delay chest opening if tamponading"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on milk/strip carefully or check patency; never delay chest opening if tamponading to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Post-Op Cardiac Tamponade After Sternotomy."
      }
    ]
  },
  {
    "id": "sim-v2-045",
    "title": "Infective Endocarditis with Root Abscess (Commando/Bentall)",
    "category": "Cardiac Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 15,
    "scenario": "48M IVDU with prosthetic aortic valve S. aureus endocarditis, PR prolongation, root abscess.",
    "skillsTested": [
      "Root Abscess",
      "Complete Debridement",
      "Homograft/Xenograft",
      "Pacing Leads"
    ],
    "questions": [
      {
        "id": "sim-v2-045-q1",
        "question": "What does new PR prolongation/AV block indicate in aortic valve endocarditis?",
        "options": [
          "Periannular abscess extension into the membranous septum/AV node",
          "Benign vagal tone",
          "Hypokalemia only",
          "Lung atelectasis"
        ],
        "correctIndex": 0,
        "explanation": "Periannular abscess extension into the membranous septum/AV node represents the evidence-based surgical priority in Infective Endocarditis with Root Abscess (Commando/Bentall).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-045-q2",
        "question": "Surgical principle for aortic root abscess?",
        "options": [
          "Antibiotics alone despite abscess and heart failure",
          "Superficial scraping only",
          "Radical debridement of all infected tissue + patch/homograft root reconstruction",
          "Simple mechanical valve over pus"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, radical debridement of all infected tissue + patch/homograft root reconstruction ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-045-q3",
        "question": "Minimum post-op IV antibiotic duration?",
        "options": [
          "3 days",
          "Oral cephalexin 5 days",
          "None",
          "4-6 weeks targeted bactericidal therapy"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on 4-6 weeks targeted bactericidal therapy to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Infective Endocarditis with Root Abscess (Commando/Bentall)."
      }
    ]
  },
  {
    "id": "sim-v2-046",
    "title": "Degenerative Mitral Regurgitation (P2 Prolapse Repair)",
    "category": "Cardiac Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 18,
    "scenario": "60F severe asymptomatic MR with LVESD 42mm, EF 58%, isolated P2 scallop prolapse.",
    "skillsTested": [
      "Carpentier Class",
      "Triangular Resection",
      "Neochordae",
      "Annuloplasty Ring"
    ],
    "questions": [
      {
        "id": "sim-v2-046-q1",
        "question": "Why repair mitral valve rather than replace when feasible?",
        "options": [
          "Higher stroke rate",
          "Lower operative mortality, preserves LV function, avoids prosthetic complications",
          "Requires double anticoagulation",
          "Impossible for P2"
        ],
        "correctIndex": 1,
        "explanation": "Lower operative mortality, preserves LV function, avoids prosthetic complications represents the evidence-based surgical priority in Degenerative Mitral Regurgitation (P2 Prolapse Repair).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-046-q2",
        "question": "Standard surgical repair for focal P2 flail/prolapse?",
        "options": [
          "Ligate mitral orifice",
          "Leave chordae ruptured",
          "Triangular/quadrangular resection or PTFE neochordae + annuloplasty ring",
          "Replace with tricuspid valve"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, triangular/quadrangular resection or ptfe neochordae + annuloplasty ring ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-046-q3",
        "question": "Intraoperative TEE check prior to leaving OR?",
        "options": [
          "Skip TEE",
          "Assess liver size",
          "Clamp LAD",
          "Verify trace/mild residual MR, coaptation height >=8mm, no SAM"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on verify trace/mild residual mr, coaptation height >=8mm, no sam to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Degenerative Mitral Regurgitation (P2 Prolapse Repair)."
      }
    ]
  },
  {
    "id": "sim-v2-047",
    "title": "Atrial Myxoma Resection \u2014 Biatrial Exposure",
    "category": "Cardiac Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 21,
    "scenario": "44F exertional syncope, TTE shows mobile 5 cm left atrial mass attached to fossa ovalis.",
    "skillsTested": [
      "Pedicle Excision",
      "Avoid Fragmentation",
      "Ventricular Check",
      "Patch Septum"
    ],
    "questions": [
      {
        "id": "sim-v2-047-q1",
        "question": "Primary surgical risk if mass is manipulated prior to cross-clamp?",
        "options": [
          "Systemic tumor embolization (stroke/mesenteric/limb)",
          "Hyperkalemia",
          "Spontaneous shrinkage",
          "Hypertension"
        ],
        "correctIndex": 0,
        "explanation": "Systemic tumor embolization (stroke/mesenteric/limb) represents the evidence-based surgical priority in Atrial Myxoma Resection \u2014 Biatrial Exposure.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-047-q2",
        "question": "Operative resection extent at stalk attachment?",
        "options": [
          "Shave surface only",
          "Leave stalk intact",
          "Full-thickness excision of fossa ovalis stalk base + pericardial/direct septal closure",
          "Radiation only"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, full-thickness excision of fossa ovalis stalk base + pericardial/direct septal closure ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-047-q3",
        "question": "Inspect all four chambers intraoperatively to rule out?",
        "options": [
          "Thyroid nodules",
          "Stones",
          "Aneurysm",
          "Synchronous myxomas or valvular trauma"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on synchronous myxomas or valvular trauma to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Atrial Myxoma Resection \u2014 Biatrial Exposure."
      }
    ]
  },
  {
    "id": "sim-v2-048",
    "title": "Post-Infarction Ventricular Septal Rupture (VSR)",
    "category": "Cardiac Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 12,
    "scenario": "69M 4 days post-anterior STEMI, sudden cardiogenic shock, loud holosystolic murmur, Qp:Qs 3.1.",
    "skillsTested": [
      "IABP Support",
      "Delayed vs Emergent",
      "Infarct Exclusion",
      "Double Patch"
    ],
    "questions": [
      {
        "id": "sim-v2-048-q1",
        "question": "Bedside stabilization bridge while planning VSR repair?",
        "options": [
          "Heavy beta-blockade in shock",
          "Afterload reduction + Intra-Aortic Balloon Pump (IABP) / MCS",
          "High-dose vasoconstrictors alone",
          "Immediate discharge"
        ],
        "correctIndex": 1,
        "explanation": "Afterload reduction + Intra-Aortic Balloon Pump (IABP) / MCS represents the evidence-based surgical priority in Post-Infarction Ventricular Septal Rupture (VSR).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-048-q2",
        "question": "Technical principle of David infarct exclusion repair?",
        "options": [
          "Close necrotic friable muscle edge-to-edge without patch",
          "Ligate LAD again",
          "Suture large bovine pericardial patch onto healthy remote LV myocardium",
          "Aortic root replacement"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, suture large bovine pericardial patch onto healthy remote lv myocardium ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-048-q3",
        "question": "Diagnostic bedside tool differentiating acute MR vs VSR?",
        "options": [
          "D-dimer",
          "Chest tube",
          "ECG alone",
          "Transthoracic/Transesophageal Echo with color Doppler"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on transthoracic/transesophageal echo with color doppler to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Post-Infarction Ventricular Septal Rupture (VSR)."
      }
    ]
  },
  {
    "id": "sim-v2-049",
    "title": "Deep Sternal Wound Infection (Mediastinitis) \u2014 NPWT & Flap",
    "category": "Cardiac Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 15,
    "scenario": "67M obese diabetic 12 days post-bilateral IMA CABG, sternal instability, purulent drainage.",
    "skillsTested": [
      "Sternal Debridement",
      "NPWT Bridge",
      "Pectoralis Flap",
      "Targeted Abx"
    ],
    "questions": [
      {
        "id": "sim-v2-049-q1",
        "question": "Bilateral IMA harvest raises mediastinitis risk due to?",
        "options": [
          "Sternal devascularization",
          "Increased cardiac output",
          "Pleural effusion",
          "Coronary spasm"
        ],
        "correctIndex": 0,
        "explanation": "Sternal devascularization represents the evidence-based surgical priority in Deep Sternal Wound Infection (Mediastinitis) \u2014 NPWT & Flap.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Cardiac Surgery."
      },
      {
        "id": "sim-v2-049-q2",
        "question": "First surgical stage for deep sternal wound infection?",
        "options": [
          "Close skin tightly with nylon",
          "Oral antibiotics alone",
          "Wound reopening, sternal wire removal, sharp bony/soft-tissue debridement + NPWT",
          "Wait 3 months"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, wound reopening, sternal wire removal, sharp bony/soft-tissue debridement + npwt ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Cardiac Surgery."
      },
      {
        "id": "sim-v2-049-q3",
        "question": "Definitive sternal dead-space coverage once clean?",
        "options": [
          "Leave bone exposed permanently",
          "Split skin graft onto bare wires",
          "Tape only",
          "Pectoralis major myocutaneous advancement/turnover flap or omental flap"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on pectoralis major myocutaneous advancement/turnover flap or omental flap to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Deep Sternal Wound Infection (Mediastinitis) \u2014 NPWT & Flap."
      }
    ]
  },
  {
    "id": "sim-v2-050",
    "title": "Early-Stage NSCLC (Stage IA) \u2014 Anatomical VATS Lobectomy",
    "category": "Thoracic Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 18,
    "scenario": "65M 40-pack-year smoker, 2.2 cm RUL spiculated nodule, PET+ N0, FEV1 78%.",
    "skillsTested": [
      "Pulmonary Eval",
      "Anatomic Lobectomy",
      "Mediastinal Nodes",
      "Pain Control"
    ],
    "questions": [
      {
        "id": "sim-v2-050-q1",
        "question": "Pre-op functional test predicting post-resection pulmonary reserve?",
        "options": [
          "ECG alone",
          "FEV1 and DLCO (calculate ppoFEV1% and ppoDLCO%)",
          "Serum creatinine",
          "Barium swallow"
        ],
        "correctIndex": 1,
        "explanation": "FEV1 and DLCO (calculate ppoFEV1% and ppoDLCO%) represents the evidence-based surgical priority in Early-Stage NSCLC (Stage IA) \u2014 Anatomical VATS Lobectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Thoracic Surgery."
      },
      {
        "id": "sim-v2-050-q2",
        "question": "Oncologic standard resection for Stage I NSCLC in fit patient?",
        "options": [
          "Enucleation without nodes",
          "Palliative chemo alone",
          "Anatomic lobectomy (or segmentectomy if <=2 cm) + systematic mediastinal LND",
          "Pneumonectomy routinely"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, anatomic lobectomy (or segmentectomy if <=2 cm) + systematic mediastinal lnd ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Thoracic Surgery."
      },
      {
        "id": "sim-v2-050-q3",
        "question": "Which nerve runs posterior to right lung hilum / trachea?",
        "options": [
          "Femoral nerve",
          "Hypoglossal",
          "Sciatic",
          "Right vagus nerve (recurrent laryngeal loops subclavian)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on right vagus nerve (recurrent laryngeal loops subclavian) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Early-Stage NSCLC (Stage IA) \u2014 Anatomical VATS Lobectomy."
      }
    ]
  },
  {
    "id": "sim-v2-051",
    "title": "Primary Spontaneous Pneumothorax \u2014 VATS Blebectomy & Pleurodesis",
    "category": "Thoracic Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 21,
    "scenario": "23M tall thin smoker with recurrent right spontaneous pneumothorax (2nd episode).",
    "skillsTested": [
      "Apical Blebs",
      "Stapled Wedge",
      "Mechanical Pleurodesis",
      "Recurrence Drop"
    ],
    "questions": [
      {
        "id": "sim-v2-051-q1",
        "question": "Indication for VATS surgical pleurodesis here?",
        "options": [
          "Recurrent ipsilateral spontaneous pneumothorax",
          "First tiny <10% asymptomatic",
          "Muscle strain",
          "Asthma"
        ],
        "correctIndex": 0,
        "explanation": "Recurrent ipsilateral spontaneous pneumothorax represents the evidence-based surgical priority in Primary Spontaneous Pneumothorax \u2014 VATS Blebectomy & Pleurodesis.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Thoracic Surgery."
      },
      {
        "id": "sim-v2-051-q2",
        "question": "Target apical lesion typically resected?",
        "options": [
          "Middle lobe bronchus",
          "Diaphragm",
          "Apical bullae/blebs in superior upper lobe / superior lower lobe",
          "Pericardium"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, apical bullae/blebs in superior upper lobe / superior lower lobe ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Thoracic Surgery."
      },
      {
        "id": "sim-v2-051-q3",
        "question": "Procedure added to blebectomy to prevent recurrence?",
        "options": [
          "Diaphragm plication",
          "Vagotomy",
          "Bronchial ligation",
          "Mechanical pleural abrasion or apical pleurectomy"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on mechanical pleural abrasion or apical pleurectomy to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Primary Spontaneous Pneumothorax \u2014 VATS Blebectomy & Pleurodesis."
      }
    ]
  },
  {
    "id": "sim-v2-052",
    "title": "Loculated Empyema (Fibrinopurulent Stage II) \u2014 VATS Decortication",
    "category": "Thoracic Surgery",
    "difficulty": "advanced",
    "urgency": "urgent",
    "estimatedMinutes": 12,
    "scenario": "54M post-pneumonia fever, trapped lung with multi-loculated thick pleural peel on CT.",
    "skillsTested": [
      "Stage II/III",
      "VATS Decortication",
      "Peel Removal",
      "Lung Expansion"
    ],
    "questions": [
      {
        "id": "sim-v2-052-q1",
        "question": "Why chest tube alone fails in multiloculated fibrinopurulent empyema?",
        "options": [
          "Too much oxygen",
          "Fibrous septations and visceral cortex prevent lung re-expansion",
          "Patient age",
          "Wrong side"
        ],
        "correctIndex": 1,
        "explanation": "Fibrous septations and visceral cortex prevent lung re-expansion represents the evidence-based surgical priority in Loculated Empyema (Fibrinopurulent Stage II) \u2014 VATS Decortication.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Thoracic Surgery."
      },
      {
        "id": "sim-v2-052-q2",
        "question": "Goal of VATS decortication?",
        "options": [
          "Resect entire lung",
          "Ligate pulmonary vein",
          "Evacuate purulent loculations & peel visceral cortex to allow full lung expansion",
          "Inject steroids intrapleurally"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, evacuate purulent loculations & peel visceral cortex to allow full lung expansion ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Thoracic Surgery."
      },
      {
        "id": "sim-v2-052-q3",
        "question": "Key intraoperative check before closing chest?",
        "options": [
          "Deflate lung permanently",
          "Clamp endotracheal tube",
          "Leave chest open",
          "Positive-pressure ventilation confirming full visceral lung expansion to chest wall"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on positive-pressure ventilation confirming full visceral lung expansion to chest wall to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Loculated Empyema (Fibrinopurulent Stage II) \u2014 VATS Decortication."
      }
    ]
  },
  {
    "id": "sim-v2-053",
    "title": "Esophageal Perforation (Boerhaave Syndrome) Within 12 Hours",
    "category": "Thoracic Surgery",
    "difficulty": "intermediate",
    "urgency": "urgent",
    "estimatedMinutes": 15,
    "scenario": "57M forceful vomiting followed by chest pain, subcutaneous emphysema, left pleural effusion.",
    "skillsTested": [
      "Water-Soluble Swallow",
      "Primary Repair",
      "Muscle Buttress",
      "Drainage"
    ],
    "questions": [
      {
        "id": "sim-v2-053-q1",
        "question": "Preferred initial contrast agent for suspected esophageal perforation?",
        "options": [
          "Water-soluble contrast (Gastrografin), NOT barium initially",
          "Thick barium first",
          "Oral colonoscopy prep",
          "No imaging ever"
        ],
        "correctIndex": 0,
        "explanation": "Water-soluble contrast (Gastrografin), NOT barium initially represents the evidence-based surgical priority in Esophageal Perforation (Boerhaave Syndrome) Within 12 Hours.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Thoracic Surgery."
      },
      {
        "id": "sim-v2-053-q2",
        "question": "Classic surgical repair if diagnosed early (<24h) in stable patient?",
        "options": [
          "Wait 2 weeks NPO without drainage",
          "Immediate colon interposition",
          "Debride necrotic edges, close mucosa & muscle in 2 layers + vascularized pleural/intercostal flap",
          "Simple NG tube only"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, debride necrotic edges, close mucosa & muscle in 2 layers + vascularized pleural/intercostal flap ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Thoracic Surgery."
      },
      {
        "id": "sim-v2-053-q3",
        "question": "Most critical anatomical site of Boerhaave rupture?",
        "options": [
          "Upper cervical esophagus",
          "Mid-stomach",
          "Duodenum D3",
          "Left posterolateral distal esophagus just above GEJ"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on left posterolateral distal esophagus just above gej to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Esophageal Perforation (Boerhaave Syndrome) Within 12 Hours."
      }
    ]
  },
  {
    "id": "sim-v2-054",
    "title": "Anterior Mediastinal Mass (Thymoma) with Myasthenia Gravis",
    "category": "Thoracic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "43F ptosis/diplopia, anti-AChR+, CT shows well-circumscribed 4 cm anterior mediastinal thymoma.",
    "skillsTested": [
      "Myasthenic Crisis",
      "Extended Thymectomy",
      "Phrenic Protection",
      "Pre-op Plasmapheresis"
    ],
    "questions": [
      {
        "id": "sim-v2-054-q1",
        "question": "Should needle biopsy precede resection of classic resectable encapsulated thymoma?",
        "options": [
          "Mandatory open core biopsy",
          "Avoid transpleural biopsy if resectable to prevent needle-tract seeding",
          "Always wait 2 years",
          "Give high-dose aminoglycosides"
        ],
        "correctIndex": 1,
        "explanation": "Avoid transpleural biopsy if resectable to prevent needle-tract seeding represents the evidence-based surgical priority in Anterior Mediastinal Mass (Thymoma) with Myasthenia Gravis.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Thoracic Surgery."
      },
      {
        "id": "sim-v2-054-q2",
        "question": "Operative completeness required for thymoma with MG?",
        "options": [
          "Enucleate capsule partially",
          "Left pneumonectomy",
          "Total extended thymectomy removing all mediastinal fat phrenic-to-phrenic",
          "Radiation only"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, total extended thymectomy removing all mediastinal fat phrenic-to-phrenic ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Thoracic Surgery."
      },
      {
        "id": "sim-v2-054-q3",
        "question": "Drugs strictly avoided perioperatively in Myasthenia Gravis?",
        "options": [
          "Paracetamol",
          "Cefazolin",
          "Ondansetron",
          "Aminoglycosides, magnesium, excessive neuromuscular blockers"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on aminoglycosides, magnesium, excessive neuromuscular blockers to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Anterior Mediastinal Mass (Thymoma) with Myasthenia Gravis."
      }
    ]
  },
  {
    "id": "sim-v2-055",
    "title": "Esophageal Adenocarcinoma \u2014 Ivor Lewis Esophagectomy",
    "category": "Thoracic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "62M post-neoadjuvant chemoradiation for Siewert I distal esophageal adenocarcinoma.",
    "skillsTested": [
      "Gastric Conduit",
      "Right Gastroepiploic",
      "Pyloric Drainage",
      "Leak Surveillance"
    ],
    "questions": [
      {
        "id": "sim-v2-055-q1",
        "question": "Sole arterial pedicle nourishing the pulled-up gastric conduit?",
        "options": [
          "Right gastroepiploic artery",
          "Left gastric artery",
          "Short gastric arteries",
          "Splenic artery"
        ],
        "correctIndex": 0,
        "explanation": "Right gastroepiploic artery represents the evidence-based surgical priority in Esophageal Adenocarcinoma \u2014 Ivor Lewis Esophagectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Thoracic Surgery."
      },
      {
        "id": "sim-v2-055-q2",
        "question": "Why perform azygos vein division during thoracic phase?",
        "options": [
          "Prevents hepatic failure",
          "Treats hiatal hernia",
          "Improves exposure to mid/upper thoracic esophagus and mediastinal anastomosis",
          "Replaces thoracic duct"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, improves exposure to mid/upper thoracic esophagus and mediastinal anastomosis ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Thoracic Surgery."
      },
      {
        "id": "sim-v2-055-q3",
        "question": "Milky white high-volume chest tube output after starting enteral feeds indicates?",
        "options": [
          "Empyema",
          "Hemothorax",
          "Air leak",
          "Chylothorax (thoracic duct injury)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on chylothorax (thoracic duct injury) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Esophageal Adenocarcinoma \u2014 Ivor Lewis Esophagectomy."
      }
    ]
  },
  {
    "id": "sim-v2-056",
    "title": "Chylothorax After Esophagectomy \u2014 Thoracic Duct Ligation",
    "category": "Thoracic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "62M Day 5 post-esophagectomy draining 1400 mL/day milky fluid, triglycerides 420 mg/dL.",
    "skillsTested": [
      "Triglyceride Cutoff",
      "MCT / NPO",
      "Mass Ligation",
      "Cisterna Chyli"
    ],
    "questions": [
      {
        "id": "sim-v2-056-q1",
        "question": "Pleural fluid triglyceride cutoff diagnostic of chylothorax?",
        "options": [
          "< 20 mg/dL",
          "> 110 mg/dL (plus chylomicrons)",
          "Amylase >1000",
          "Glucose >200"
        ],
        "correctIndex": 1,
        "explanation": "> 110 mg/dL (plus chylomicrons) represents the evidence-based surgical priority in Chylothorax After Esophagectomy \u2014 Thoracic Duct Ligation.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Thoracic Surgery."
      },
      {
        "id": "sim-v2-056-q2",
        "question": "Initial conservative medical management for low-output chylothorax?",
        "options": [
          "High-fat cream diet",
          "Remove chest tube immediately",
          "NPO + TPN (or medium-chain triglyceride diet) + somatostatin analog",
          "Thoracoplasty"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, npo + tpn (or medium-chain triglyceride diet) + somatostatin analog ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Thoracic Surgery."
      },
      {
        "id": "sim-v2-056-q3",
        "question": "Anatomic site for mass ligation in refractory high-output (>1L/d) leak?",
        "options": [
          "Left pulmonary hilum",
          "Carina anterior",
          "Neck thyroid notch",
          "Between aorta and azygos vein just above right diaphragmatic hiatus"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on between aorta and azygos vein just above right diaphragmatic hiatus to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Chylothorax After Esophagectomy \u2014 Thoracic Duct Ligation."
      }
    ]
  },
  {
    "id": "sim-v2-057",
    "title": "Benign Esophageal Stricture / Zenker Diverticulum Repair",
    "category": "Thoracic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "73M dysphagia, regurgitation of undigested food, halitosis, barium shows posterior pouch.",
    "skillsTested": [
      "Killian Triangle",
      "Cricopharyngeal Myotomy",
      "Stapled vs Open",
      "Recurrent Nerve"
    ],
    "questions": [
      {
        "id": "sim-v2-057-q1",
        "question": "Anatomical triangle of Zenker diverticulum herniation?",
        "options": [
          "Killian triangle (between thyropharyngeus and cricopharyngeus muscles)",
          "Calot triangle",
          "Hesselbach triangle",
          "Triangle of doom"
        ],
        "correctIndex": 0,
        "explanation": "Killian triangle (between thyropharyngeus and cricopharyngeus muscles) represents the evidence-based surgical priority in Benign Esophageal Stricture / Zenker Diverticulum Repair.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Thoracic Surgery."
      },
      {
        "id": "sim-v2-057-q2",
        "question": "Mandatory component of ANY Zenker repair to prevent recurrence?",
        "options": [
          "Gastric wrap",
          "Tracheostomy",
          "Cricopharyngeal myotomy",
          "Parathyroidectomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, cricopharyngeal myotomy ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Thoracic Surgery."
      },
      {
        "id": "sim-v2-057-q3",
        "question": "Preferred minimally invasive endoscopic approach?",
        "options": [
          "Total esophagectomy",
          "PEG only",
          "Sternotomy",
          "Endoscopic stapled diverticulotomy dividing the common septum"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on endoscopic stapled diverticulotomy dividing the common septum to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Benign Esophageal Stricture / Zenker Diverticulum Repair."
      }
    ]
  },
  {
    "id": "sim-v2-058",
    "title": "Open Tibial Shaft Fracture (Gustilo-Anderson IIIB)",
    "category": "Orthopedic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "29M motorcycle crash, 12 cm contaminated open tibia wound with periosteal stripping.",
    "skillsTested": [
      "Antibiotic Timing",
      "Urgent Debridement",
      "External Fixation",
      "Flap Coverage"
    ],
    "questions": [
      {
        "id": "sim-v2-058-q1",
        "question": "Single most important factor lowering infection in open fractures?",
        "options": [
          "Immediate cast over dirt",
          "Early IV antibiotics (<1-3 hours) + thorough surgical irrigation & debridement",
          "Delayed antibiotics Day 3",
          "Routine amputation"
        ],
        "correctIndex": 1,
        "explanation": "Early IV antibiotics (<1-3 hours) + thorough surgical irrigation & debridement represents the evidence-based surgical priority in Open Tibial Shaft Fracture (Gustilo-Anderson IIIB).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Orthopedic Surgery."
      },
      {
        "id": "sim-v2-058-q2",
        "question": "Antibiotic coverage for Gustilo Grade III open fracture?",
        "options": [
          "Vancomycin oral",
          "Azithromycin only",
          "Cefazolin + aminoglycoside (e.g., gentamicin) +/- penicillin if soil",
          "Fluconazole"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, cefazolin + aminoglycoside (e.g., gentamicin) +/- penicillin if soil ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Orthopedic Surgery."
      },
      {
        "id": "sim-v2-058-q3",
        "question": "Fixation choice when soft tissue severely compromised initially?",
        "options": [
          "Tight primary skin suture over exposed bone",
          "No immobilization",
          "Immediate arthrodesis",
          "Spanning external fixation then definitive IM nail + free muscle flap <7 days"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on spanning external fixation then definitive im nail + free muscle flap <7 days to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Open Tibial Shaft Fracture (Gustilo-Anderson IIIB)."
      }
    ]
  },
  {
    "id": "sim-v2-059",
    "title": "Elderly Displaced Femoral Neck Fracture (Hemiarthroplasty)",
    "category": "Orthopedic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "81F mechanical fall, shortened externally rotated left leg, Garden IV femoral neck fracture.",
    "skillsTested": [
      "Garden Classification",
      "Timing <48h",
      "Cemented Stem",
      "VTE Prophylaxis"
    ],
    "questions": [
      {
        "id": "sim-v2-059-q1",
        "question": "Optimal surgical timing for medically stabilized hip fracture?",
        "options": [
          "Within 24-48 hours of admission",
          "Wait 3 weeks in traction",
          "Bedrest for 3 months",
          "Outpatient splint"
        ],
        "correctIndex": 0,
        "explanation": "Within 24-48 hours of admission represents the evidence-based surgical priority in Elderly Displaced Femoral Neck Fracture (Hemiarthroplasty).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Orthopedic Surgery."
      },
      {
        "id": "sim-v2-059-q2",
        "question": "Preferred treatment for Garden IV displaced fracture in low-demand 81yo?",
        "options": [
          "Conservative non-weightbearing",
          "External fixator",
          "Cemented bipolar/unipolar hip hemiarthroplasty",
          "Three cannulated screws (high AVN/nonunion)"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, cemented bipolar/unipolar hip hemiarthroplasty ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Orthopedic Surgery."
      },
      {
        "id": "sim-v2-059-q3",
        "question": "High-risk lethal intraoperative event during femoral cementing?",
        "options": [
          "Carotid dissection",
          "Appendicitis",
          "Hypercalcemia",
          "Bone cement implantation syndrome (hypoxia/hypotension \u2014 press & vent canal)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on bone cement implantation syndrome (hypoxia/hypotension \u2014 press & vent canal) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Elderly Displaced Femoral Neck Fracture (Hemiarthroplasty)."
      }
    ]
  },
  {
    "id": "sim-v2-060",
    "title": "Acute Septic Arthritis of the Knee Joint",
    "category": "Orthopedic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "54M swollen hot painful knee x24h, unable to flex, synovial WBC 85,000, 94% PMNs.",
    "skillsTested": [
      "Arthrocentesis",
      "Urgent Washout",
      "Cartilage Protection",
      "Targeted Abx"
    ],
    "questions": [
      {
        "id": "sim-v2-060-q1",
        "question": "Synovial fluid WBC count threshold strongly favoring septic arthritis?",
        "options": [
          "< 500 cells/uL",
          "> 50,000 cells/uL (>75-90% neutrophils)",
          "1,500 monocytes",
          "Normal viscosity"
        ],
        "correctIndex": 1,
        "explanation": "> 50,000 cells/uL (>75-90% neutrophils) represents the evidence-based surgical priority in Acute Septic Arthritis of the Knee Joint.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Orthopedic Surgery."
      },
      {
        "id": "sim-v2-060-q2",
        "question": "Gold-standard urgent surgical intervention?",
        "options": [
          "Intra-articular steroid injection",
          "Oral NSAIDs for 2 weeks",
          "Arthroscopic or open arthrotomy irrigation & synovectomy + IV antibiotics",
          "Splint alone"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, arthroscopic or open arthrotomy irrigation & synovectomy + iv antibiotics ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Orthopedic Surgery."
      },
      {
        "id": "sim-v2-060-q3",
        "question": "Why is delay catastrophic?",
        "options": [
          "Meniscus regrows fast",
          "No systemic risk",
          "Turns into gout",
          "Proteolytic enzymes destroy articular cartilage within 24-48 hours"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on proteolytic enzymes destroy articular cartilage within 24-48 hours to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Septic Arthritis of the Knee Joint."
      }
    ]
  },
  {
    "id": "sim-v2-061",
    "title": "Developmental Hip / Pediatric Supracondylar Humerus Fracture (Gartland III)",
    "category": "Orthopedic Surgery",
    "difficulty": "beginner",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "6M fell on outstretched hand, displaced extension supracondylar fracture, cool pulseless pink hand.",
    "skillsTested": [
      "Neurovascular Check",
      "AIN Exam",
      "CRPP Pinning",
      "Pulse Re-eval"
    ],
    "questions": [
      {
        "id": "sim-v2-061-q1",
        "question": "Nerve most commonly injured in extension-type supracondylar humerus fracture?",
        "options": [
          "Anterior interosseous nerve (median branch \u2014 'OK sign' flexion FPL/FDP)",
          "Femoral nerve",
          "Sciatic nerve",
          "Accessory nerve"
        ],
        "correctIndex": 0,
        "explanation": "Anterior interosseous nerve (median branch \u2014 'OK sign' flexion FPL/FDP) represents the evidence-based surgical priority in Developmental Hip / Pediatric Supracondylar Humerus Fracture (Gartland III).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Orthopedic Surgery."
      },
      {
        "id": "sim-v2-061-q2",
        "question": "Definitive stabilization for displaced Gartland Type III fracture?",
        "options": [
          "Cast at 120\u00b0 elbow flexion unreduced",
          "Total elbow arthroplasty",
          "Closed reduction and percutaneous K-wire pinning (lateral +/- medial)",
          "External shoulder brace"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, closed reduction and percutaneous k-wire pinning (lateral +/- medial) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Orthopedic Surgery."
      },
      {
        "id": "sim-v2-061-q3",
        "question": "If hand remains PINK and well-perfused after closed reduction despite weak radial pulse?",
        "options": [
          "Immediate amputation",
          "Open chest",
          "Immediate cast tight",
          "Monitor closely with neurovascular checks (vascular explore only if cold/white)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on monitor closely with neurovascular checks (vascular explore only if cold/white) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Developmental Hip / Pediatric Supracondylar Humerus Fracture (Gartland III)."
      }
    ]
  },
  {
    "id": "sim-v2-062",
    "title": "Anterior Cruciate Ligament (ACL) Rupture & Meniscal Tear",
    "category": "Orthopedic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "23F pivoting soccer injury with audible pop, acute hemarthrosis, positive Lachman.",
    "skillsTested": [
      "Lachman Test",
      "Tunnel Placement",
      "Graft Choices",
      "Rehab Protocol"
    ],
    "questions": [
      {
        "id": "sim-v2-062-q1",
        "question": "Most sensitive physical exam maneuver for acute ACL tear?",
        "options": [
          "McMurray alone",
          "Lachman test (20-30\u00b0 knee flexion)",
          "Tinel sign",
          "Trendelenburg"
        ],
        "correctIndex": 1,
        "explanation": "Lachman test (20-30\u00b0 knee flexion) represents the evidence-based surgical priority in Anterior Cruciate Ligament (ACL) Rupture & Meniscal Tear.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Orthopedic Surgery."
      },
      {
        "id": "sim-v2-062-q2",
        "question": "Concomitant tear requiring repair if peripheral red-red zone?",
        "options": [
          "Patellar alta",
          "Talar dome cyst",
          "Bucket-handle / longitudinal meniscal tear",
          "Iliotibial band strain"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, bucket-handle / longitudinal meniscal tear ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Orthopedic Surgery."
      },
      {
        "id": "sim-v2-062-q3",
        "question": "Anatomic ACL femoral tunnel placement aims for?",
        "options": [
          "Anterior roof impingement",
          "Patellar tendon",
          "Tibial tubercle",
          "Posterolateral aspect of intercondylar notch (native footprint)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on posterolateral aspect of intercondylar notch (native footprint) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Anterior Cruciate Ligament (ACL) Rupture & Meniscal Tear."
      }
    ]
  },
  {
    "id": "sim-v2-063",
    "title": "Cauda Equina Syndrome from Massive L4-L5 Disc Herniation",
    "category": "Orthopedic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "46M acute severe back pain, bilateral sciatica, saddle anesthesia, urinary retention (PVR 650mL).",
    "skillsTested": [
      "Red Flags",
      "Emergent MRI",
      "Laminectomy <48h",
      "Bladder Outcome"
    ],
    "questions": [
      {
        "id": "sim-v2-063-q1",
        "question": "Pathognomonic clinical triad / red flags of cauda equina syndrome?",
        "options": [
          "Saddle anesthesia, bladder/bowel dysfunction, bilateral lower extremity deficit",
          "Isolated knee click",
          "Chronic mild stiffness",
          "Shoulder impingement"
        ],
        "correctIndex": 0,
        "explanation": "Saddle anesthesia, bladder/bowel dysfunction, bilateral lower extremity deficit represents the evidence-based surgical priority in Cauda Equina Syndrome from Massive L4-L5 Disc Herniation.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Orthopedic Surgery."
      },
      {
        "id": "sim-v2-063-q2",
        "question": "Surgical urgency once MRI confirms massive central disc compression?",
        "options": [
          "Physical therapy x 6 weeks",
          "Epidural steroid wait 3 weeks",
          "Emergent lumbar laminectomy & discectomy (ideally <24-48 hours)",
          "Cervical collar"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, emergent lumbar laminectomy & discectomy (ideally <24-48 hours) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Orthopedic Surgery."
      },
      {
        "id": "sim-v2-063-q3",
        "question": "Post-op prognosis predictor for bladder recovery?",
        "options": [
          "Smoking pack-years",
          "Serum cholesterol",
          "Knee reflex",
          "Speed of decompression before complete sphincter paralysis"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on speed of decompression before complete sphincter paralysis to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Cauda Equina Syndrome from Massive L4-L5 Disc Herniation."
      }
    ]
  },
  {
    "id": "sim-v2-064",
    "title": "Unstable Intertrochanteric Hip Fracture \u2014 Cephalomedullary Nail",
    "category": "Orthopedic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "79M fall onto hip, reverse obliquity intertrochanteric fracture with subtrochanteric extension.",
    "skillsTested": [
      "Tip-Apex Distance",
      "Varus Avoidance",
      "IM Nail Advantage",
      "Early Mobilize"
    ],
    "questions": [
      {
        "id": "sim-v2-064-q1",
        "question": "Target Tip-Apex Distance (TAD) to prevent lag-screw cutout?",
        "options": [
          "> 45 mm",
          "< 25 mm combined AP + lateral views",
          "0 mm protruding into pelvis",
          "80 mm"
        ],
        "correctIndex": 1,
        "explanation": "< 25 mm combined AP + lateral views represents the evidence-based surgical priority in Unstable Intertrochanteric Hip Fracture \u2014 Cephalomedullary Nail.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Orthopedic Surgery."
      },
      {
        "id": "sim-v2-064-q2",
        "question": "Why cephalomedullary nail preferred over sliding hip screw in reverse obliquity?",
        "options": [
          "Cheaper plastic material",
          "Requires zero anesthesia",
          "Acts as intramedullary buttress resisting medial shaft displacement",
          "Avoids pelvic X-ray"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, acts as intramedullary buttress resisting medial shaft displacement ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Orthopedic Surgery."
      },
      {
        "id": "sim-v2-064-q3",
        "question": "Key intra-op reduction error leading to varus collapse?",
        "options": [
          "Full weightbearing Day 1",
          "Using stainless steel",
          "Antibiotic prophylaxis",
          "Failure to reduce posteromedial calcar / valgus alignment prior to reaming"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on failure to reduce posteromedial calcar / valgus alignment prior to reaming to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Unstable Intertrochanteric Hip Fracture \u2014 Cephalomedullary Nail."
      }
    ]
  },
  {
    "id": "sim-v2-065",
    "title": "Rotator Cuff Massive Tear vs Acute Dislocated Shoulder Reduction",
    "category": "Orthopedic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "62M anterior shoulder dislocation on fall, unable to abduct arm after reduction, intact deltoid sensation.",
    "skillsTested": [
      "Axillary Check",
      "Rotator Cuff",
      "Ultrasound/MRI",
      "Arthroscopic Repair"
    ],
    "questions": [
      {
        "id": "sim-v2-065-q1",
        "question": "In patients >40-50 years with first-time anterior shoulder dislocation, suspect?",
        "options": [
          "Concomitant acute full-thickness rotator cuff tear",
          "Clavicle agenesis",
          "Biceps tenodesis spontaneous",
          "Scapular fracture always"
        ],
        "correctIndex": 0,
        "explanation": "Concomitant acute full-thickness rotator cuff tear represents the evidence-based surgical priority in Rotator Cuff Massive Tear vs Acute Dislocated Shoulder Reduction.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Orthopedic Surgery."
      },
      {
        "id": "sim-v2-065-q2",
        "question": "Nerve most commonly stretched in anterior shoulder dislocation?",
        "options": [
          "Ulnar nerve",
          "Radial at wrist",
          "Axillary nerve (deltoid + regimental badge sensation)",
          "Obturator"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, axillary nerve (deltoid + regimental badge sensation) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Orthopedic Surgery."
      },
      {
        "id": "sim-v2-065-q3",
        "question": "Diagnostic test confirming rotator cuff tear post-reduction?",
        "options": [
          "Plain wrist X-ray",
          "EMG at hour 1",
          "Bone density",
          "Shoulder MRI (or ultrasound)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on shoulder mri (or ultrasound) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Rotator Cuff Massive Tear vs Acute Dislocated Shoulder Reduction."
      }
    ]
  },
  {
    "id": "sim-v2-066",
    "title": "Acute Epidural Hematoma (EDH) \u2014 Middle Meningeal Artery",
    "category": "Neurosurgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "25M struck in temple, brief LOC, lucid interval, now GCS 7 with fixed dilated right pupil.",
    "skillsTested": [
      "Lucid Interval",
      "CT Lens Shape",
      "Emergent Craniotomy",
      "MMA Control"
    ],
    "questions": [
      {
        "id": "sim-v2-066-q1",
        "question": "Classic CT brain appearance of epidural hematoma?",
        "options": [
          "Crescentic crossing sutures",
          "Biconvex (lentiform) hyperdensity limited by cranial sutures",
          "Diffuse sulcal subarachnoid blood",
          "Normal scan"
        ],
        "correctIndex": 1,
        "explanation": "Biconvex (lentiform) hyperdensity limited by cranial sutures represents the evidence-based surgical priority in Acute Epidural Hematoma (EDH) \u2014 Middle Meningeal Artery.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Neurosurgery."
      },
      {
        "id": "sim-v2-066-q2",
        "question": "Artery most commonly ruptured under pterion?",
        "options": [
          "Anterior cerebral artery",
          "Basilar artery",
          "Middle meningeal artery (MMA)",
          "Vertebral artery"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, middle meningeal artery (mma) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Neurosurgery."
      },
      {
        "id": "sim-v2-066-q3",
        "question": "Definitive surgical procedure saving brainstem from uncal herniation?",
        "options": [
          "Lumbar puncture",
          "Wait 24h on mannitol alone",
          "VP shunt",
          "Emergent trauma craniotomy (or temporal craniectomy), clot evacuation, dural tack-up"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on emergent trauma craniotomy (or temporal craniectomy), clot evacuation, dural tack-up to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Epidural Hematoma (EDH) \u2014 Middle Meningeal Artery."
      }
    ]
  },
  {
    "id": "sim-v2-067",
    "title": "Subdural Hematoma Acute vs Chronic Burr-Hole Drainage",
    "category": "Neurosurgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "78M on aspirin, minor fall 3 weeks ago, progressive confusion & hemiparesis, CT crescent hypodensity.",
    "skillsTested": [
      "Crescent CT",
      "Bridging Veins",
      "Burr-Hole Wash",
      "Subdural Drain"
    ],
    "questions": [
      {
        "id": "sim-v2-067-q1",
        "question": "Venous source of subdural hematoma?",
        "options": [
          "Cortical bridging veins entering dural venous sinuses",
          "Middle meningeal artery",
          "Circle of Willis berry aneurysm",
          "Choroid plexus"
        ],
        "correctIndex": 0,
        "explanation": "Cortical bridging veins entering dural venous sinuses represents the evidence-based surgical priority in Subdural Hematoma Acute vs Chronic Burr-Hole Drainage.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Neurosurgery."
      },
      {
        "id": "sim-v2-067-q2",
        "question": "Standard treatment for symptomatic chronic subdural hematoma?",
        "options": [
          "Total hemispherectomy",
          "Mannitol alone x 6 weeks",
          "Burr-hole evacuation, warm saline irrigation, closed subdural drain (48h)",
          "Radiotherapy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, burr-hole evacuation, warm saline irrigation, closed subdural drain (48h) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Neurosurgery."
      },
      {
        "id": "sim-v2-067-q3",
        "question": "Why place closed subdural drain post-evacuation?",
        "options": [
          "Increases seizures intentionally",
          "Removes bone flap",
          "Prevents CSF production",
          "Significantly reduces recurrence rate"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on significantly reduces recurrence rate to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Subdural Hematoma Acute vs Chronic Burr-Hole Drainage."
      }
    ]
  },
  {
    "id": "sim-v2-068",
    "title": "Aneurysmal Subarachnoid Hemorrhage (AComA) \u2014 Clip vs Coil",
    "category": "Neurosurgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "49F sudden worst headache of life ('thunderclap'), Hunt-Hess II, Fisher 3 on CT.",
    "skillsTested": [
      "CT + LP Rule",
      "Nimodipine",
      "Clip vs Coil",
      "Vasospasm Days"
    ],
    "questions": [
      {
        "id": "sim-v2-068-q1",
        "question": "Essential oral neuroprotective medication started immediately to reduce delayed ischemia?",
        "options": [
          "Clopidogrel loading before securement",
          "Nimodipine 60 mg q4h x 21 days",
          "Oral prednisone",
          "Strict hypotension MAP 45"
        ],
        "correctIndex": 1,
        "explanation": "Nimodipine 60 mg q4h x 21 days represents the evidence-based surgical priority in Aneurysmal Subarachnoid Hemorrhage (AComA) \u2014 Clip vs Coil.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Neurosurgery."
      },
      {
        "id": "sim-v2-068-q2",
        "question": "Peak window for cerebral vasospasm monitoring (TCD/clinical)?",
        "options": [
          "First 2 hours only",
          "Day 90",
          "Days 4 to 14 post-bleed (peak days 7-10)",
          "Never occurs after coiling"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, days 4 to 14 post-bleed (peak days 7-10) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Neurosurgery."
      },
      {
        "id": "sim-v2-068-q3",
        "question": "Definitive treatment of secured ruptured aneurysm prevents?",
        "options": [
          "Hydrocephalus forever",
          "Migraine",
          "Pituitary tumor",
          "Early catastrophic re-bleeding"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on early catastrophic re-bleeding to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Aneurysmal Subarachnoid Hemorrhage (AComA) \u2014 Clip vs Coil."
      }
    ]
  },
  {
    "id": "sim-v2-069",
    "title": "Glioblastoma Multiforme (GBM) \u2014 Awake Craniotomy Mapping",
    "category": "Neurosurgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "53M new focal seizures, MRI left frontoparietal ring-enhancing tumor near Broca area.",
    "skillsTested": [
      "5-ALA Fluorescence",
      "Cortical Mapping",
      "Max Safe Resection",
      "Stupp Protocol"
    ],
    "questions": [
      {
        "id": "sim-v2-069-q1",
        "question": "Role of 5-aminolevulinic acid (5-ALA) during high-grade glioma surgery?",
        "options": [
          "Fluoresces tumor tissue pink under blue light to maximize extent of resection",
          "Replaces anesthesia",
          "Prevents all seizures permanently",
          "Treats brain abscess"
        ],
        "correctIndex": 0,
        "explanation": "Fluoresces tumor tissue pink under blue light to maximize extent of resection represents the evidence-based surgical priority in Glioblastoma Multiforme (GBM) \u2014 Awake Craniotomy Mapping.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Neurosurgery."
      },
      {
        "id": "sim-v2-069-q2",
        "question": "Why perform awake craniotomy with direct electrical stimulation?",
        "options": [
          "Reduces OR staffing",
          "Avoids scalp incision",
          "Maps eloquent language/motor cortex to achieve maximal safe resection",
          "Biopsies bone only"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, maps eloquent language/motor cortex to achieve maximal safe resection ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Neurosurgery."
      },
      {
        "id": "sim-v2-069-q3",
        "question": "Standard adjuvant regimen post-resection (Stupp protocol)?",
        "options": [
          "Observation alone",
          "Antibiotics x 6 weeks",
          "VP shunt",
          "Concurrent temozolomide + radiotherapy followed by maintenance temozolomide"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on concurrent temozolomide + radiotherapy followed by maintenance temozolomide to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Glioblastoma Multiforme (GBM) \u2014 Awake Craniotomy Mapping."
      }
    ]
  },
  {
    "id": "sim-v2-070",
    "title": "Acute Hydrocephalus / Elevated ICP \u2014 External Ventricular Drain",
    "category": "Neurosurgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "42M cerebellar hemorrhage compressing 4th ventricle, GCS dropping from 13 to 8.",
    "skillsTested": [
      "Kocher Point",
      "ICP Zeroing",
      "EVD Drainage",
      "Infection Watch"
    ],
    "questions": [
      {
        "id": "sim-v2-070-q1",
        "question": "Standard anatomical landmark for frontal EVD insertion (Kocher point)?",
        "options": [
          "Occipital midline",
          "10-11 cm posterior to nasion, 2.5-3 cm lateral to midline (mid-pupillary line)",
          "Subtemporal ear",
          "C1 lamina"
        ],
        "correctIndex": 1,
        "explanation": "10-11 cm posterior to nasion, 2.5-3 cm lateral to midline (mid-pupillary line) represents the evidence-based surgical priority in Acute Hydrocephalus / Elevated ICP \u2014 External Ventricular Drain.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Neurosurgery."
      },
      {
        "id": "sim-v2-070-q2",
        "question": "Reference zero-level for EVD transducer?",
        "options": [
          "Umbilicus",
          "Knee joint",
          "External auditory meatus (Tragus / Foramen of Monro)",
          "Top of bed"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, external auditory meatus (tragus / foramen of monro) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Neurosurgery."
      },
      {
        "id": "sim-v2-070-q3",
        "question": "Catheter-tract ventriculitis risk rises sharply after?",
        "options": [
          "First 2 hours",
          "Using sterile gloves",
          "Low protein diet",
          "5-7 days of prolonged catheterization or frequent sampling"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on 5-7 days of prolonged catheterization or frequent sampling to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Hydrocephalus / Elevated ICP \u2014 External Ventricular Drain."
      }
    ]
  },
  {
    "id": "sim-v2-071",
    "title": "Spinal Cord Compression from Metastatic Epidural Disease",
    "category": "Neurosurgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "61M lung cancer with acute progressive leg weakness, T6 sensory level, MRI cord compression.",
    "skillsTested": [
      "Dexamethasone Bolus",
      "Separation Surgery",
      "Stabilization",
      "Radiosurgery"
    ],
    "questions": [
      {
        "id": "sim-v2-071-q1",
        "question": "Immediate medical step upon suspecting malignant spinal cord compression?",
        "options": [
          "High-dose IV dexamethasone + urgent whole-spine MRI",
          "Wait for bone scan next week",
          "Chiropractic manipulation",
          "Oral ibuprofen"
        ],
        "correctIndex": 0,
        "explanation": "High-dose IV dexamethasone + urgent whole-spine MRI represents the evidence-based surgical priority in Spinal Cord Compression from Metastatic Epidural Disease.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Neurosurgery."
      },
      {
        "id": "sim-v2-071-q2",
        "question": "Surgical goal in radiosensitive/radioresistant MESCC with instability?",
        "options": [
          "Lumbar puncture alone",
          "Biopsy without decompression",
          "Circumferential decompression + instrumented spinal stabilization + adjuvant RT/SRS",
          "Cast vest"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, circumferential decompression + instrumented spinal stabilization + adjuvant rt/srs ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Neurosurgery."
      },
      {
        "id": "sim-v2-071-q3",
        "question": "Most important predictor of post-op ambulatory outcome?",
        "options": [
          "Hair color",
          "BMI",
          "Sodium level",
          "Pre-operative ambulatory/motor function status"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on pre-operative ambulatory/motor function status to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Spinal Cord Compression from Metastatic Epidural Disease."
      }
    ]
  },
  {
    "id": "sim-v2-072",
    "title": "Pituitary Macroadenoma with Apoplexy & Chiasmal Compression",
    "category": "Neurosurgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "46M sudden severe headache, ophthalmoplegia, bitemporal hemianopsia, low cortisol.",
    "skillsTested": [
      "Hydrocortisone",
      "Endoscopic Endonasal",
      "Optic Decompression",
      "DI Monitoring"
    ],
    "questions": [
      {
        "id": "sim-v2-072-q1",
        "question": "Life-saving immediate hormone replacement before MRI/OR in pituitary apoplexy?",
        "options": [
          "Levothyroxine monotherapy first",
          "Stress-dose IV hydrocortisone (covers acute adrenal crisis)",
          "Insulin drip only",
          "Testosterone gel"
        ],
        "correctIndex": 1,
        "explanation": "Stress-dose IV hydrocortisone (covers acute adrenal crisis) represents the evidence-based surgical priority in Pituitary Macroadenoma with Apoplexy & Chiasmal Compression.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Neurosurgery."
      },
      {
        "id": "sim-v2-072-q2",
        "question": "Preferred surgical corridor for pituitary macroadenoma?",
        "options": [
          "Suboccipital craniotomy",
          "Cervical laminectomy",
          "Endoscopic endonasal transsphenoidal approach",
          "Ventriculoperitoneal shunt"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, endoscopic endonasal transsphenoidal approach ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Neurosurgery."
      },
      {
        "id": "sim-v2-072-q3",
        "question": "Post-op urine output >250 mL/h with low specific gravity (<1.005) indicates?",
        "options": [
          "SIADH",
          "Urinary tract infection",
          "Renal stone",
          "Central diabetes insipidus (AVP deficiency)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on central diabetes insipidus (avp deficiency) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Pituitary Macroadenoma with Apoplexy & Chiasmal Compression."
      }
    ]
  },
  {
    "id": "sim-v2-073",
    "title": "Trigeminal Neuralgia Refractory to Carbamazepine \u2014 MVD",
    "category": "Neurosurgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "59F lancinating V2/V3 facial pain triggered by breeze, MRI shows SCA loop touching trigeminal root.",
    "skillsTested": [
      "Root Entry Zone",
      "Retrosigmoid MVD",
      "Teflon Pledget",
      "Brainstem Hearing"
    ],
    "questions": [
      {
        "id": "sim-v2-073-q1",
        "question": "Pathophysiology targeted by microvascular decompression (Jannetta procedure)?",
        "options": [
          "Vascular compression (usually superior cerebellar artery) at trigeminal root entry zone",
          "Cavernous sinus thrombosis",
          "Dental caries only",
          "Parotid tumor"
        ],
        "correctIndex": 0,
        "explanation": "Vascular compression (usually superior cerebellar artery) at trigeminal root entry zone represents the evidence-based surgical priority in Trigeminal Neuralgia Refractory to Carbamazepine \u2014 MVD.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Neurosurgery."
      },
      {
        "id": "sim-v2-073-q2",
        "question": "Key cranial nerves protected during retrosigmoid CPA approach?",
        "options": [
          "Optic chiasm",
          "Olfactory bulb",
          "CN VII and CN VIII complex (auditory/facial monitoring)",
          "Hypoglossal"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, cn vii and cn viii complex (auditory/facial monitoring) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Neurosurgery."
      },
      {
        "id": "sim-v2-073-q3",
        "question": "Material interposed between offending vessel and trigeminal nerve?",
        "options": [
          "Silk mesh",
          "Bone wax mass",
          "Titanium plate",
          "Teflon (PTFE) felt pledgets"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on teflon (ptfe) felt pledgets to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Trigeminal Neuralgia Refractory to Carbamazepine \u2014 MVD."
      }
    ]
  },
  {
    "id": "sim-v2-074",
    "title": "Infantile Hypertrophic Pyloric Stenosis (IHPS)",
    "category": "Pediatric Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "5-week-old male projectile non-bilious emesis, olive mass, K 2.8, Cl 84, HCO3 34.",
    "skillsTested": [
      "Electrolyte Fix",
      "Ramstedt Incision",
      "Mucosa Check",
      "Feed Timing"
    ],
    "questions": [
      {
        "id": "sim-v2-074-q1",
        "question": "Critical pre-operative rule for IHPS?",
        "options": [
          "Rush to OR within 15 minutes acidotic",
          "IHPS is a MEDICAL emergency \u2014 correct hypochloremic hypokalemic alkalosis BEFORE OR",
          "Give oral barium enema",
          "Antibiotics x 14 days"
        ],
        "correctIndex": 1,
        "explanation": "IHPS is a MEDICAL emergency \u2014 correct hypochloremic hypokalemic alkalosis BEFORE OR represents the evidence-based surgical priority in Infantile Hypertrophic Pyloric Stenosis (IHPS).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Pediatric Surgery."
      },
      {
        "id": "sim-v2-074-q2",
        "question": "Key intraoperative complication to test immediately after pyloromyotomy?",
        "options": [
          "Splenic capsule tear",
          "Portal vein thrombosis",
          "Mucosal perforation (air/bile leak test via NG tube)",
          "Ureteral injury"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, mucosal perforation (air/bile leak test via ng tube) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Pediatric Surgery."
      },
      {
        "id": "sim-v2-074-q3",
        "question": "Post-op oral feeding initiation?",
        "options": [
          "NPO for 10 days",
          "TPN for 3 months",
          "Gastrostomy",
          "Early ad libitum feeds within 4-6 hours if stable"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on early ad libitum feeds within 4-6 hours if stable to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Infantile Hypertrophic Pyloric Stenosis (IHPS)."
      }
    ]
  },
  {
    "id": "sim-v2-075",
    "title": "Intussusception \u2014 Pneumatic Enema vs Operative Reduction",
    "category": "Pediatric Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "9-month infant episodic inconsolable crying, currant-jelly stools, US target sign.",
    "skillsTested": [
      "Air Enema",
      "Contraindications",
      "Manual Milking",
      "Lead Point"
    ],
    "questions": [
      {
        "id": "sim-v2-075-q1",
        "question": "Contraindications to pneumatic/hydrostatic enema reduction?",
        "options": [
          "Peritonitis, free intraperitoneal air, or hemodynamic instability",
          "Age 9 months",
          "Target sign on US",
          "Blood-streaked stool alone"
        ],
        "correctIndex": 0,
        "explanation": "Peritonitis, free intraperitoneal air, or hemodynamic instability represents the evidence-based surgical priority in Intussusception \u2014 Pneumatic Enema vs Operative Reduction.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Pediatric Surgery."
      },
      {
        "id": "sim-v2-075-q2",
        "question": "Correct manual operative reduction technique if enema fails?",
        "options": [
          "Forceful pulling on intussusceptum",
          "Routine colectomy in all cases",
          "Gentle distal-to-proximal retrograde squeezing (NEVER pull proximal ileum)",
          "Leave reduced uninspected"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, gentle distal-to-proximal retrograde squeezing (never pull proximal ileum) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Pediatric Surgery."
      },
      {
        "id": "sim-v2-075-q3",
        "question": "In older children (>3-5 years), suspect?",
        "options": [
          "Pyloric stenosis",
          "Hirschsprung always",
          "Biliary atresia",
          "Pathologic lead point (e.g., Meckel diverticulum, lymphoma, polyp)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on pathologic lead point (e.g., meckel diverticulum, lymphoma, polyp) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Intussusception \u2014 Pneumatic Enema vs Operative Reduction."
      }
    ]
  },
  {
    "id": "sim-v2-076",
    "title": "Malrotation with Midgut Volvulus \u2014 Ladd Procedure",
    "category": "Pediatric Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "4-day neonate sudden bilious emesis, abdominal tenderness, upper GI corkscrew duodenum.",
    "skillsTested": [
      "Surgical Emergency",
      "CCW Detorsion",
      "Ladd Bands",
      "Widening Base"
    ],
    "questions": [
      {
        "id": "sim-v2-076-q1",
        "question": "Why is bilious vomiting in a neonate malrotation until proven otherwise?",
        "options": [
          "Normal reflux",
          "Midgut volvulus causes catastrophic total small bowel necrosis within hours",
          "Pyloric stenosis",
          "Constipation"
        ],
        "correctIndex": 1,
        "explanation": "Midgut volvulus causes catastrophic total small bowel necrosis within hours represents the evidence-based surgical priority in Malrotation with Midgut Volvulus \u2014 Ladd Procedure.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Pediatric Surgery."
      },
      {
        "id": "sim-v2-076-q2",
        "question": "Direction of surgical detorsion of midgut volvulus?",
        "options": [
          "Clockwise",
          "Only distal sigmoid",
          "Counter-clockwise ('turn back the clock')",
          "No detorsion needed"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, counter-clockwise ('turn back the clock') ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Pediatric Surgery."
      },
      {
        "id": "sim-v2-076-q3",
        "question": "Four components of classic Ladd procedure?",
        "options": [
          "Gastrojejunostomy + fundoplication",
          "Pyloromyotomy",
          "Ileostomy + suture cecum",
          "Detorsion CCW, divide Ladd bands, widen mesenteric base, appendectomy (+ place SB right/colon left)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on detorsion ccw, divide ladd bands, widen mesenteric base, appendectomy (+ place sb right/colon left) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Malrotation with Midgut Volvulus \u2014 Ladd Procedure."
      }
    ]
  },
  {
    "id": "sim-v2-077",
    "title": "Esophageal Atresia with Distal Tracheoesophageal Fistula",
    "category": "Pediatric Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "Newborn excessive drooling, choking on 1st feed, coiled NG tube in upper pouch, gas in stomach.",
    "skillsTested": [
      "VACTERL Screen",
      "Echo Arch Side",
      "Fistula Ligation",
      "Anastomosis Tension"
    ],
    "questions": [
      {
        "id": "sim-v2-077-q1",
        "question": "Presence of gastric air on X-ray proves?",
        "options": [
          "Presence of a distal tracheoesophageal fistula (Gross Type C)",
          "Pure isolated EA (Type A)",
          "Diaphragmatic hernia",
          "Meconium ileus"
        ],
        "correctIndex": 0,
        "explanation": "Presence of a distal tracheoesophageal fistula (Gross Type C) represents the evidence-based surgical priority in Esophageal Atresia with Distal Tracheoesophageal Fistula.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Pediatric Surgery."
      },
      {
        "id": "sim-v2-077-q2",
        "question": "Mandatory pre-op study guiding thoracotomy side (left vs right)?",
        "options": [
          "Brain MRI",
          "Bone scan",
          "Echocardiogram (identify side of aortic arch & cardiac VACTERL anomalies)",
          "Renal biopsy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, echocardiogram (identify side of aortic arch & cardiac vacterl anomalies) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Pediatric Surgery."
      },
      {
        "id": "sim-v2-077-q3",
        "question": "Urgent priority at index thoracotomy?",
        "options": [
          "Gastrostomy only without fistula control",
          "Resect lower lobe",
          "Delay 6 months",
          "Divide and suture-ligate TEF fistula first to stop ventilatory gastric distension"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on divide and suture-ligate tef fistula first to stop ventilatory gastric distension to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Esophageal Atresia with Distal Tracheoesophageal Fistula."
      }
    ]
  },
  {
    "id": "sim-v2-078",
    "title": "Congenital Diaphragmatic Hernia (Bochdalek) Timing",
    "category": "Pediatric Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "Term newborn respiratory distress, scaphoid abdomen, bowel sounds in left hemithorax.",
    "skillsTested": [
      "Avoid Bag-Mask",
      "Stabilize First",
      "Pulmonary HTN",
      "Defect Repair"
    ],
    "questions": [
      {
        "id": "sim-v2-078-q1",
        "question": "Immediate airway rule in delivery room for CDH?",
        "options": [
          "Forceful bag-mask ventilation",
          "Prompt endotracheal intubation + NG decompression (AVOID bag-mask inflation)",
          "Immediate chest tube into stomach",
          "Rush to OR at minute 10"
        ],
        "correctIndex": 1,
        "explanation": "Prompt endotracheal intubation + NG decompression (AVOID bag-mask inflation) represents the evidence-based surgical priority in Congenital Diaphragmatic Hernia (Bochdalek) Timing.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Pediatric Surgery."
      },
      {
        "id": "sim-v2-078-q2",
        "question": "Optimal timing of surgical hernia repair?",
        "options": [
          "Immediately before resuscitation",
          "Wait 6 months",
          "AFTER physiologic stabilization of pulmonary hypertension & oxygenation",
          "Never repair"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, after physiologic stabilization of pulmonary hypertension & oxygenation ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Pediatric Surgery."
      },
      {
        "id": "sim-v2-078-q3",
        "question": "Most common anatomical side and defect location?",
        "options": [
          "Right anterior Morgagni",
          "Central tendon",
          "Esophageal hiatus",
          "Left posterolateral (Bochdalek) hernia"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on left posterolateral (bochdalek) hernia to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Congenital Diaphragmatic Hernia (Bochdalek) Timing."
      }
    ]
  },
  {
    "id": "sim-v2-079",
    "title": "Hand Flexor Tendon Laceration (Zone II No Man's Land)",
    "category": "Plastic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "28M knife cut across volar proximal phalanx of index finger, absent FDP & FDS flexion.",
    "skillsTested": [
      "Pulley Preservation",
      "Core Sutures",
      "Epitendinous Stitch",
      "Dorsal Splint"
    ],
    "questions": [
      {
        "id": "sim-v2-079-q1",
        "question": "Critical annular pulleys preserved to prevent tendon bowstringing?",
        "options": [
          "A2 and A4 pulleys",
          "A1 only",
          "Guyon canal roof",
          "Dorsal retinaculum"
        ],
        "correctIndex": 0,
        "explanation": "A2 and A4 pulleys represents the evidence-based surgical priority in Hand Flexor Tendon Laceration (Zone II No Man's Land).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Plastic Surgery."
      },
      {
        "id": "sim-v2-079-q2",
        "question": "Modern core repair strength requirement permitting early active motion?",
        "options": [
          "Single 6-0 nylon stitch",
          "Skin glue alone",
          "4- to 6-strand core suture + running epitendinous suture",
          "Excise both tendons"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, 4- to 6-strand core suture + running epitendinous suture ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Plastic Surgery."
      },
      {
        "id": "sim-v2-079-q3",
        "question": "Classic post-op protective orthosis position?",
        "options": [
          "Full hyperextension cast",
          "No splint",
          "Immediate heavy weightlifting Day 2",
          "Dorsal blocking splint (wrist slight flexion/neutral, MCP flexed, IP extended)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on dorsal blocking splint (wrist slight flexion/neutral, mcp flexed, ip extended) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Hand Flexor Tendon Laceration (Zone II No Man's Land)."
      }
    ]
  },
  {
    "id": "sim-v2-080",
    "title": "Split-Thickness vs Full-Thickness Skin Graft Take Physiology",
    "category": "Plastic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "45M clean granulating anterior tibia defect requiring meshed split-thickness skin graft.",
    "skillsTested": [
      "Imbibition",
      "Inosculation",
      "Neovascularization",
      "Bolster/NPWT"
    ],
    "questions": [
      {
        "id": "sim-v2-080-q1",
        "question": "Three sequential phases of skin graft survival?",
        "options": [
          "Necrosis, fibrosis, rejection",
          "Plasmatic imbibition (0-48h), inosculation (48-72h), neovascularization",
          "Bleeding, clotting, scarring only",
          "Osmosis only"
        ],
        "correctIndex": 1,
        "explanation": "Plasmatic imbibition (0-48h), inosculation (48-72h), neovascularization represents the evidence-based surgical priority in Split-Thickness vs Full-Thickness Skin Graft Take Physiology.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Plastic Surgery."
      },
      {
        "id": "sim-v2-080-q2",
        "question": "Most common cause of skin graft failure?",
        "options": [
          "Using 1:1.5 meshing",
          "Recipient muscle bed",
          "Subgraft hematoma or seroma separating graft from vascular bed",
          "Mild anemia"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, subgraft hematoma or seroma separating graft from vascular bed ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Plastic Surgery."
      },
      {
        "id": "sim-v2-080-q3",
        "question": "Recipient beds that CANNOT support a skin graft?",
        "options": [
          "Healthy granulation tissue",
          "Muscle",
          "Fascia",
          "Bare cortical bone without periosteum, bare tendon without paratenon, cartilage without perichondrium"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on bare cortical bone without periosteum, bare tendon without paratenon, cartilage without perichondrium to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Split-Thickness vs Full-Thickness Skin Graft Take Physiology."
      }
    ]
  },
  {
    "id": "sim-v2-081",
    "title": "Replantation of Amputated Thumb \u2014 Ischemia & Sequence",
    "category": "Plastic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "31M clean guillotine saw amputation of right thumb at MCP level, brought on ice.",
    "skillsTested": [
      "Preservation Bag",
      "Bony Shortening",
      "Structure Sequence",
      "Vein Ratio"
    ],
    "questions": [
      {
        "id": "sim-v2-081-q1",
        "question": "Correct pre-hospital preservation of amputated digit?",
        "options": [
          "Wrap in saline-moistened gauze inside sealed bag placed ON ice-water slurry (NO direct ice freeze)",
          "Submerge bare digit in tap water",
          "Place directly on dry ice",
          "Soak in alcohol"
        ],
        "correctIndex": 0,
        "explanation": "Wrap in saline-moistened gauze inside sealed bag placed ON ice-water slurry (NO direct ice freeze) represents the evidence-based surgical priority in Replantation of Amputated Thumb \u2014 Ischemia & Sequence.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Plastic Surgery."
      },
      {
        "id": "sim-v2-081-q2",
        "question": "Standard operative sequence in digital replantation?",
        "options": [
          "Skin first then bone",
          "Vein before bone",
          "Debridement -> Bone fixation -> Extensor -> Flexor -> Artery -> Nerve -> Vein(s)",
          "Nerve only"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, debridement -> bone fixation -> extensor -> flexor -> artery -> nerve -> vein(s) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Plastic Surgery."
      },
      {
        "id": "sim-v2-081-q3",
        "question": "Why is thumb amputation an absolute indication for attempted replantation?",
        "options": [
          "Easiest vein size",
          "Zero bone healing needed",
          "Cosmetic only",
          "Represents ~40-50% of overall hand function"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on represents ~40-50% of overall hand function to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Replantation of Amputated Thumb \u2014 Ischemia & Sequence."
      }
    ]
  },
  {
    "id": "sim-v2-082",
    "title": "Cleft Palate Repair (Furlow / Two-Flap) \u2014 VPI & Speech",
    "category": "Plastic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "11-month infant with complete soft & hard cleft palate, planned single-stage palatoplasty.",
    "skillsTested": [
      "Levator Sling",
      "Two-Flap / Furlow",
      "Timing ~10-12mo",
      "Airway Watch"
    ],
    "questions": [
      {
        "id": "sim-v2-082-q1",
        "question": "Primary functional objective of cleft palate repair?",
        "options": [
          "Permanent open fistula",
          "Intact velopharyngeal competence (normal speech) via levator veli palatini sling reconstruction",
          "Early dental extraction",
          "Facial nerve transection"
        ],
        "correctIndex": 1,
        "explanation": "Intact velopharyngeal competence (normal speech) via levator veli palatini sling reconstruction represents the evidence-based surgical priority in Cleft Palate Repair (Furlow / Two-Flap) \u2014 VPI & Speech.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Plastic Surgery."
      },
      {
        "id": "sim-v2-082-q2",
        "question": "Optimal age window for primary palatoplasty?",
        "options": [
          "1 day old",
          "10 years old",
          "9 to 12 months (before speech phoneme acquisition)",
          "Adulthood"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, 9 to 12 months (before speech phoneme acquisition) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Plastic Surgery."
      },
      {
        "id": "sim-v2-082-q3",
        "question": "Muscle abnormally inserted onto posterior hard palate edge requiring retropositioning?",
        "options": [
          "Masseter",
          "Platysma",
          "Buccinator",
          "Levator veli palatini muscle"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on levator veli palatini muscle to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Cleft Palate Repair (Furlow / Two-Flap) \u2014 VPI & Speech."
      }
    ]
  },
  {
    "id": "sim-v2-083",
    "title": "Pressure Injury (Sacral Stage IV) \u2014 Flap Reconstruction",
    "category": "Plastic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "52M paraplegic with chronic non-healing 8x8 cm sacral Stage IV ulcer with osteomyelitis.",
    "skillsTested": [
      "Osteomyelitis Biopsy",
      "Fecal/Nutrition Prep",
      "Gluteal V-Y Flap",
      "Pressure Offload"
    ],
    "questions": [
      {
        "id": "sim-v2-083-q1",
        "question": "Mandatory prerequisite before definitive myocutaneous flap closure?",
        "options": [
          "Debride infected bone, treat osteomyelitis, optimize nutrition/spasticity/offloading",
          "Flap directly over pus & exposed bone",
          "Zero nutritional check",
          "Immediate sitting post-op Day 1"
        ],
        "correctIndex": 0,
        "explanation": "Debride infected bone, treat osteomyelitis, optimize nutrition/spasticity/offloading represents the evidence-based surgical priority in Pressure Injury (Sacral Stage IV) \u2014 Flap Reconstruction.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Plastic Surgery."
      },
      {
        "id": "sim-v2-083-q2",
        "question": "Workhorse flap for sacral pressure injury coverage?",
        "options": [
          "Rectus femoris only",
          "Pectoralis flap",
          "Gluteus maximus V-Y advancement or rotation myocutaneous flap",
          "Radial forearm"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, gluteus maximus v-y advancement or rotation myocutaneous flap ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Plastic Surgery."
      },
      {
        "id": "sim-v2-083-q3",
        "question": "Post-op offloading protocol duration?",
        "options": [
          "Sit upright immediately Day 1",
          "Remove drains in 1 hour",
          "No positioning protocol",
          "Strict air-fluidized bed / zero direct pressure x 3-4 weeks"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on strict air-fluidized bed / zero direct pressure x 3-4 weeks to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Pressure Injury (Sacral Stage IV) \u2014 Flap Reconstruction."
      }
    ]
  },
  {
    "id": "sim-v2-084",
    "title": "Acute Testicular Torsion \u2014 Urgent Scrotal Exploration",
    "category": "Urology",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "15M sudden severe left scrotal pain x3h, high-riding transverse testis, absent cremasteric reflex.",
    "skillsTested": [
      "6-Hour Window",
      "Manual Detorsion",
      "Bilateral Fixation",
      "Viability Check"
    ],
    "questions": [
      {
        "id": "sim-v2-084-q1",
        "question": "Diagnostic priority when clinical presentation is classic within 3 hours?",
        "options": [
          "Wait 24h for MRI",
          "Immediate scrotal exploration (do NOT delay >6h for ultrasound)",
          "Antibiotics for 10 days",
          "Discharge with NSAIDs"
        ],
        "correctIndex": 1,
        "explanation": "Immediate scrotal exploration (do NOT delay >6h for ultrasound) represents the evidence-based surgical priority in Acute Testicular Torsion \u2014 Urgent Scrotal Exploration.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Urology."
      },
      {
        "id": "sim-v2-084-q2",
        "question": "Mandatory step after detorsing viable testis?",
        "options": [
          "Unilateral fixation only",
          "Routine orchidectomy of viable testis",
          "Bilateral orchiopexy (bell-clapper deformity is bilateral)",
          "Vasectomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, bilateral orchiopexy (bell-clapper deformity is bilateral) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Urology."
      },
      {
        "id": "sim-v2-084-q3",
        "question": "Expected salvage rate if detorsed within <6 hours?",
        "options": [
          "< 5%",
          "0%",
          "Unaffected by time",
          "> 85-90% salvage"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on > 85-90% salvage to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Testicular Torsion \u2014 Urgent Scrotal Exploration."
      }
    ]
  },
  {
    "id": "sim-v2-085",
    "title": "Obstructive Pyelonephritis (Infected Stone) \u2014 Emergent Decompression",
    "category": "Urology",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "48F febrile 39.2\u00b0C, BP 88/54, left flank pain, CT shows 8mm proximal ureteral stone + hydronephrosis.",
    "skillsTested": [
      "Drain Pus First",
      "JJ Stent / PCN",
      "Never Definitive URS",
      "Sepsis Fluids"
    ],
    "questions": [
      {
        "id": "sim-v2-085-q1",
        "question": "Definitive emergency urologic management of obstructing infected stone?",
        "options": [
          "Urgent decompression via ureteral JJ stent OR percutaneous nephrostomy + IV antibiotics",
          "Immediate ureteroscopic laser lithotripsy",
          "ESWL shockwave lithotripsy tonight",
          "Oral tamsulosin outpatient"
        ],
        "correctIndex": 0,
        "explanation": "Urgent decompression via ureteral JJ stent OR percutaneous nephrostomy + IV antibiotics represents the evidence-based surgical priority in Obstructive Pyelonephritis (Infected Stone) \u2014 Emergent Decompression.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Urology."
      },
      {
        "id": "sim-v2-085-q2",
        "question": "Why is immediate laser lithotripsy contraindicated in urosepsis?",
        "options": [
          "Laser doesn't work in urine",
          "Stents cause cancer",
          "High intrarenal pressure drives fatal Gram-negative bacteremia/sepsis",
          "Pain control only"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, high intrarenal pressure drives fatal gram-negative bacteremia/sepsis ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Urology."
      },
      {
        "id": "sim-v2-085-q3",
        "question": "Timing for definitive stone treatment?",
        "options": [
          "Same hour",
          "Never treat",
          "Open nephrectomy",
          "Electively after complete resolution of sepsis & negative urine culture"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on electively after complete resolution of sepsis & negative urine culture to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Obstructive Pyelonephritis (Infected Stone) \u2014 Emergent Decompression."
      }
    ]
  },
  {
    "id": "sim-v2-086",
    "title": "High-Grade Muscle-Invasive Bladder Cancer \u2014 Radical Cystectomy",
    "category": "Urology",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "66M smoker hematuria, TURBT T2 high-grade urothelial carcinoma, Cr 1.1, eligible for cisplatin.",
    "skillsTested": [
      "Neoadjuvant Cisplatin",
      "Lymphadenectomy",
      "Ileal Conduit / Neobladder",
      "B12 / Acidosis"
    ],
    "questions": [
      {
        "id": "sim-v2-086-q1",
        "question": "Standard neoadjuvant systemic recommendation before radical cystectomy in fit T2-T4a?",
        "options": [
          "No systemic therapy",
          "Cisplatin-based neoadjuvant chemotherapy (e.g., ddMVAC or Gem/Cis)",
          "Hormonal ablation",
          "Immediate radiation instead"
        ],
        "correctIndex": 1,
        "explanation": "Cisplatin-based neoadjuvant chemotherapy (e.g., ddMVAC or Gem/Cis) represents the evidence-based surgical priority in High-Grade Muscle-Invasive Bladder Cancer \u2014 Radical Cystectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Urology."
      },
      {
        "id": "sim-v2-086-q2",
        "question": "Metabolic derangement associated with ileal conduit / orthotopic neobladder?",
        "options": [
          "Metabolic alkalosis",
          "Hyperkalemic coma always",
          "Hyperchloremic metabolic acidosis (+ long-term B12 deficiency)",
          "Hypocalcemic tetany immediately"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, hyperchloremic metabolic acidosis (+ long-term b12 deficiency) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Urology."
      },
      {
        "id": "sim-v2-086-q3",
        "question": "Contraindication to orthotopic ileal neobladder?",
        "options": [
          "Male sex",
          "Age 60",
          "Right kidney intact",
          "Positive urethral margin, severe renal insufficiency (Cr>2), inability to self-cath"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on positive urethral margin, severe renal insufficiency (cr>2), inability to self-cath to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for High-Grade Muscle-Invasive Bladder Cancer \u2014 Radical Cystectomy."
      }
    ]
  },
  {
    "id": "sim-v2-087",
    "title": "Posterior Urethral Injury with Pelvic Fracture",
    "category": "Urology",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "29M pelvic fracture, blood at urethral meatus, high-riding prostate, unable to void.",
    "skillsTested": [
      "RUG First",
      "Suprapubic Tube",
      "Avoid Blind Foley",
      "Delayed Urethroplasty"
    ],
    "questions": [
      {
        "id": "sim-v2-087-q1",
        "question": "First step before any urethral catheterization attempt with blood at meatus?",
        "options": [
          "Retrograde urethrogram (RUG)",
          "Forceful 22Fr Foley insertion",
          "Cystoscopy in ED blindly",
          "Immediate prostatectomy"
        ],
        "correctIndex": 0,
        "explanation": "Retrograde urethrogram (RUG) represents the evidence-based surgical priority in Posterior Urethral Injury with Pelvic Fracture.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Urology."
      },
      {
        "id": "sim-v2-087-q2",
        "question": "Acute urinary drainage if complete posterior urethral disruption confirmed?",
        "options": [
          "Blind guidewire jam",
          "Nephrectomy",
          "Suprapubic cystostomy tube placement",
          "Observation without drainage"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, suprapubic cystostomy tube placement ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Urology."
      },
      {
        "id": "sim-v2-087-q3",
        "question": "Timing of formal posterior anastomotic urethroplasty?",
        "options": [
          "Day 1 in trauma bay",
          "Wait 10 years",
          "Antibiotics only",
          "Delayed 3-6 months after hematoma/inflammation resolves"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on delayed 3-6 months after hematoma/inflammation resolves to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Posterior Urethral Injury with Pelvic Fracture."
      }
    ]
  },
  {
    "id": "sim-v2-088",
    "title": "Renal Cell Carcinoma with IVC Tumor Thrombus (Level II)",
    "category": "Urology",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "63M right 9 cm renal mass extending into infrahepatic IVC, no distant metastases on staging.",
    "skillsTested": [
      "MRI IVC Level",
      "Cardiopulmonary Team",
      "Cavotomy",
      "Early Artery Ligate"
    ],
    "questions": [
      {
        "id": "sim-v2-088-q1",
        "question": "Optimal imaging to delineate cranial extent of IVC tumor thrombus?",
        "options": [
          "KUB X-ray",
          "Contrast MRI abdomen/venocavogram",
          "Bone scan",
          "Retrograde pyelogram"
        ],
        "correctIndex": 1,
        "explanation": "Contrast MRI abdomen/venocavogram represents the evidence-based surgical priority in Renal Cell Carcinoma with IVC Tumor Thrombus (Level II).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Urology."
      },
      {
        "id": "sim-v2-088-q2",
        "question": "Key sequence in open radical nephrectomy + IVC thrombectomy?",
        "options": [
          "Ligate renal vein before artery first",
          "Biopsy thrombus openly",
          "Early ligation of right renal artery to decompress collaterals before IVC control",
          "Avoid vascular clamps"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, early ligation of right renal artery to decompress collaterals before ivc control ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Urology."
      },
      {
        "id": "sim-v2-088-q3",
        "question": "Level III-IV supradiaphragmatic thrombus requires collaboration with?",
        "options": [
          "Dermatology",
          "Ophthalmology",
          "Plastic hand team",
          "Hepatobiliary +/- cardiothoracic surgery (liver mobilization / CPB)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on hepatobiliary +/- cardiothoracic surgery (liver mobilization / cpb) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Renal Cell Carcinoma with IVC Tumor Thrombus (Level II)."
      }
    ]
  },
  {
    "id": "sim-v2-089",
    "title": "Ruptured Ectopic Pregnancy with Hemoperitoneum",
    "category": "Obstetrics & Gynecology",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "27F 7 weeks LMP, severe RLQ pain, syncope, BP 82/48, hCG+, FAST free pelvic fluid.",
    "skillsTested": [
      "FAST Trauma",
      "Laparoscopic Salpingectomy",
      "Contralateral Check",
      "Rhogam Status"
    ],
    "questions": [
      {
        "id": "sim-v2-089-q1",
        "question": "Immediate management in hemodynamically unstable ruptured ectopic?",
        "options": [
          "Type & cross, 2 large-bore IVs, emergent laparoscopy/laparotomy",
          "Single-dose methotrexate outpatient",
          "Repeat beta-hCG in 48h",
          "Hysteroscopy"
        ],
        "correctIndex": 0,
        "explanation": "Type & cross, 2 large-bore IVs, emergent laparoscopy/laparotomy represents the evidence-based surgical priority in Ruptured Ectopic Pregnancy with Hemoperitoneum.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-089-q2",
        "question": "Salpingectomy vs salpingostomy when tube is severely ruptured?",
        "options": [
          "Oophorectomy routinely",
          "Hysterectomy",
          "Salpingectomy (if contralateral tube looks healthy)",
          "Wait for clot resolution"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, salpingectomy (if contralateral tube looks healthy) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-089-q3",
        "question": "Post-op requirement if patient is Rh-negative?",
        "options": [
          "Methotrexate mandatory",
          "Oral iron only",
          "Lifelong heparin",
          "Administer anti-D immune globulin (RhoGAM)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on administer anti-d immune globulin (rhogam) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Ruptured Ectopic Pregnancy with Hemoperitoneum."
      }
    ]
  },
  {
    "id": "sim-v2-090",
    "title": "Adnexal / Ovarian Torsion \u2014 Laparoscopic Detorsion",
    "category": "Obstetrics & Gynecology",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "22F sudden severe nausea/vomiting + RLQ pain, US enlarged 7 cm ovary with absent Doppler flow.",
    "skillsTested": [
      "Doppler Pitfall",
      "Detorse Preserve",
      "Cystectomy Timing",
      "Oophoropexy"
    ],
    "questions": [
      {
        "id": "sim-v2-090-q1",
        "question": "Crucial diagnostic pitfall with pelvic ultrasound Doppler in torsion?",
        "options": [
          "Doppler is 100% sensitive",
          "Presence of arterial Doppler flow does NOT rule out ovarian torsion (venous fails first)",
          "Requires CT first",
          "Elevated PSA confirms"
        ],
        "correctIndex": 1,
        "explanation": "Presence of arterial Doppler flow does NOT rule out ovarian torsion (venous fails first) represents the evidence-based surgical priority in Adnexal / Ovarian Torsion \u2014 Laparoscopic Detorsion.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-090-q2",
        "question": "Modern surgical management even of dark/bluish-black edematous ovary?",
        "options": [
          "Automatic oophorectomy always",
          "Observation x 72h",
          "Laparoscopic detorsion and ovarian preservation (most recover viability)",
          "Oral antibiotics"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, laparoscopic detorsion and ovarian preservation (most recover viability) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-090-q3",
        "question": "Optional cystectomy if persistent benign dermoid cyst found?",
        "options": [
          "Total abdominal hysterectomy",
          "Appendectomy mandatory",
          "Chemotherapy",
          "Aspirate/cystectomy carefully once detorsed or interval"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on aspirate/cystectomy carefully once detorsed or interval to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Adnexal / Ovarian Torsion \u2014 Laparoscopic Detorsion."
      }
    ]
  },
  {
    "id": "sim-v2-091",
    "title": "Postpartum Hemorrhage Refractory to Uterotonics (B-Lynch)",
    "category": "Obstetrics & Gynecology",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "31F post-cesarean uterine atony despite oxytocin, carboprost, misoprostol, tranexamic acid, EBL 1900mL.",
    "skillsTested": [
      "Bakri Balloon",
      "B-Lynch Suture",
      "O'Leary Ligation",
      "Hysterectomy"
    ],
    "questions": [
      {
        "id": "sim-v2-091-q1",
        "question": "First uterine-sparing surgical compression technique during laparotomy?",
        "options": [
          "B-Lynch uterine compression suture (using absorbable monofilament/Vicryl)",
          "Bilateral oophorectomy",
          "Immediate nephrectomy",
          "Pelvic exenteration"
        ],
        "correctIndex": 0,
        "explanation": "B-Lynch uterine compression suture (using absorbable monofilament/Vicryl) represents the evidence-based surgical priority in Postpartum Hemorrhage Refractory to Uterotonics (B-Lynch).",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-091-q2",
        "question": "Uterine devascularization step (O'Leary stitch) targets?",
        "options": [
          "Common iliac vein",
          "Inferior vena cava",
          "Ascending branch of bilateral uterine arteries",
          "Femoral artery"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, ascending branch of bilateral uterine arteries ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-091-q3",
        "question": "If persistent life-threatening hemorrhage despite compression & embolization?",
        "options": [
          "Wait 12 hours",
          "Stop blood products",
          "Close skin over active bleeding",
          "Prompt peripartum hysterectomy before consumptive coagulopathy spirals"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on prompt peripartum hysterectomy before consumptive coagulopathy spirals to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Postpartum Hemorrhage Refractory to Uterotonics (B-Lynch)."
      }
    ]
  },
  {
    "id": "sim-v2-092",
    "title": "Placenta Accreta Spectrum \u2014 Planned Cesarean Hysterectomy",
    "category": "Obstetrics & Gynecology",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "34F G4P3 prior 3 cesareans, placenta previa with MRI signs of placenta increta.",
    "skillsTested": [
      "34-35wk Delivery",
      "No Placental Removal",
      "Ureter Stents",
      "Blood Bank"
    ],
    "questions": [
      {
        "id": "sim-v2-092-q1",
        "question": "Single deadliest error during cesarean delivery for placenta percreta/increta?",
        "options": [
          "Leaving placenta undisturbed in situ for hysterectomy",
          "Attempting manual removal/avulsion of adherent placenta",
          "Pre-op blood readiness",
          "Multidisciplinary team"
        ],
        "correctIndex": 1,
        "explanation": "Attempting manual removal/avulsion of adherent placenta represents the evidence-based surgical priority in Placenta Accreta Spectrum \u2014 Planned Cesarean Hysterectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-092-q2",
        "question": "Recommended gestational age window for scheduled delivery?",
        "options": [
          "42 weeks",
          "24 weeks",
          "34 0/7 to 35 6/7 weeks",
          "Only after spontaneous labor at home"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, 34 0/7 to 35 6/7 weeks ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-092-q3",
        "question": "Major adjacent organ risk during difficult bladder flap dissection?",
        "options": [
          "Spleen",
          "Thyroid",
          "Gallbladder",
          "Bladder & distal ureteral injury"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on bladder & distal ureteral injury to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Placenta Accreta Spectrum \u2014 Planned Cesarean Hysterectomy."
      }
    ]
  },
  {
    "id": "sim-v2-093",
    "title": "Early Cervical Cancer (Stage IB1) \u2014 Radical Hysterectomy",
    "category": "Obstetrics & Gynecology",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "39F Stage IB1 1.8 cm cervical squamous carcinoma, negative pelvic nodes on MRI.",
    "skillsTested": [
      "Uterine Artery",
      "Ureter Unroofing",
      "Open vs MIS Trial",
      "Lymphadenectomy"
    ],
    "questions": [
      {
        "id": "sim-v2-093-q1",
        "question": "Why open radical hysterectomy preferred over minimally invasive per LACC trial?",
        "options": [
          "Significantly superior disease-free and overall survival in open approach",
          "MIS is faster always",
          "Open causes less scar",
          "No survival difference"
        ],
        "correctIndex": 0,
        "explanation": "Significantly superior disease-free and overall survival in open approach represents the evidence-based surgical priority in Early Cervical Cancer (Stage IB1) \u2014 Radical Hysterectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-093-q2",
        "question": "Critical anatomical step dissecting cardinal/uterosacral ligaments?",
        "options": [
          "Ligate both ureters",
          "Resect bladder dome routinely",
          "Ureteral tunnel unroofing to preserve ureteral blood supply & integrity",
          "Avoid uterine artery ligation"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, ureteral tunnel unroofing to preserve ureteral blood supply & integrity ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Obstetrics & Gynecology."
      },
      {
        "id": "sim-v2-093-q3",
        "question": "Structures resected in Type III (Piver) radical hysterectomy?",
        "options": [
          "Simple supracervical uterus only",
          "Cervical cone only",
          "Ovary alone",
          "Uterus, cervix, upper vaginal cuff, parametria, uterosacral ligaments + pelvic LND"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on uterus, cervix, upper vaginal cuff, parametria, uterosacral ligaments + pelvic lnd to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Early Cervical Cancer (Stage IB1) \u2014 Radical Hysterectomy."
      }
    ]
  },
  {
    "id": "sim-v2-094",
    "title": "Urgent ERCP for Severe Acute Gallstone Pancreatitis + Cholangitis",
    "category": "Endoscopic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "58M gallstone pancreatitis with bilirubin 6.8 mg/dL, fever 39.1\u00b0C, dilated CBD 12mm.",
    "skillsTested": [
      "24h ERCP",
      "Wire Cannulation",
      "Sphincterotomy",
      "Avoid Contrast Overfill"
    ],
    "questions": [
      {
        "id": "sim-v2-094-q1",
        "question": "Indication for URGENT (<24h) ERCP in acute gallstone pancreatitis?",
        "options": [
          "Uncomplicated mild pancreatitis with normal LFTs",
          "Concomitant acute cholangitis or persistent biliary obstruction",
          "Alcoholic pancreatitis",
          "Asymptomatic cholelithiasis"
        ],
        "correctIndex": 1,
        "explanation": "Concomitant acute cholangitis or persistent biliary obstruction represents the evidence-based surgical priority in Urgent ERCP for Severe Acute Gallstone Pancreatitis + Cholangitis.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Endoscopic Surgery."
      },
      {
        "id": "sim-v2-094-q2",
        "question": "Technique reducing post-ERCP pancreatitis (PEP) risk?",
        "options": [
          "Forceful high-pressure contrast injection into pancreatic duct",
          "No hydration",
          "Wire-guided cannulation, rectal indomethacin 100mg, prophylactic PD stent if inadvertent PD access",
          "Routine open laparotomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, wire-guided cannulation, rectal indomethacin 100mg, prophylactic pd stent if inadvertent pd access ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Endoscopic Surgery."
      },
      {
        "id": "sim-v2-094-q3",
        "question": "Ideal sphincterotomy cutting orientation?",
        "options": [
          "6 o'clock posteriorly",
          "9 o'clock blindly",
          "Circumferential cut",
          "11 to 1 o'clock axis toward intramural CBD"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on 11 to 1 o'clock axis toward intramural cbd to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Urgent ERCP for Severe Acute Gallstone Pancreatitis + Cholangitis."
      }
    ]
  },
  {
    "id": "sim-v2-095",
    "title": "Upper GI Bleed (Forrest Ia Spurting Duodenal Ulcer) \u2014 Dual Therapy",
    "category": "Endoscopic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "67M hematemesis, BP 90/56, EGD reveals spurting arterial vessel on posterior duodenal bulb.",
    "skillsTested": [
      "Dual Hemostasis",
      "H. pylori / IV PPI",
      "Angioembolization Backup",
      "GDA Artery"
    ],
    "questions": [
      {
        "id": "sim-v2-095-q1",
        "question": "Why epinephrine injection ALONE is inadequate for Forrest Ia/Ib ulcer?",
        "options": [
          "High rebleeding rate (~30%); MUST combine with thermal coagulation or hemoclip",
          "Too cheap",
          "Epinephrine heals mucosa instantly",
          "Causes duodenal stricture"
        ],
        "correctIndex": 0,
        "explanation": "High rebleeding rate (~30%); MUST combine with thermal coagulation or hemoclip represents the evidence-based surgical priority in Upper GI Bleed (Forrest Ia Spurting Duodenal Ulcer) \u2014 Dual Therapy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Endoscopic Surgery."
      },
      {
        "id": "sim-v2-095-q2",
        "question": "Artery bleeding from posterior duodenal bulb ulcers?",
        "options": [
          "Splenic vein",
          "Superior mesenteric vein",
          "Gastroduodenal artery (GDA)",
          "Inferior epigastric artery"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, gastroduodenal artery (gda) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Endoscopic Surgery."
      },
      {
        "id": "sim-v2-095-q3",
        "question": "Next step if repeat endoscopic therapy fails after rebleed?",
        "options": [
          "Wait 7 days",
          "Oral sucralfate alone",
          "Colonoscopy",
          "IR transcatheter arterial embolization (TAE) of GDA (or surgery)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on ir transcatheter arterial embolization (tae) of gda (or surgery) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Upper GI Bleed (Forrest Ia Spurting Duodenal Ulcer) \u2014 Dual Therapy."
      }
    ]
  },
  {
    "id": "sim-v2-096",
    "title": "Colonic Perforation During Therapeutic Polypectomy \u2014 Clip Rescue",
    "category": "Endoscopic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "61M 2.5 cm ascending colon EMR complicated by 8 mm target sign muscle injury & perforation.",
    "skillsTested": [
      "CO2 Insufflation",
      "Over-The-Scope Clip",
      "Surgical Backup",
      "IV Antibiotics"
    ],
    "questions": [
      {
        "id": "sim-v2-096-q1",
        "question": "Advantage of CO2 over room air during complex EMR/ESD?",
        "options": [
          "Creates flammable gas",
          "Rapid peritoneal absorption reduces tension pneumoperitoneum & pain if perforation occurs",
          "Costs less than water",
          "Prevents all bleeding"
        ],
        "correctIndex": 1,
        "explanation": "Rapid peritoneal absorption reduces tension pneumoperitoneum & pain if perforation occurs represents the evidence-based surgical priority in Colonic Perforation During Therapeutic Polypectomy \u2014 Clip Rescue.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Endoscopic Surgery."
      },
      {
        "id": "sim-v2-096-q2",
        "question": "Endoscopic rescue for clean <1-2 cm immediate recognition perforation?",
        "options": [
          "Ignore and feed patient",
          "Continue high-pressure air insufflation",
          "Through-the-scope or Over-The-Scope Clip (OTSC) closure + NPO + IV antibiotics",
          "Discharge without follow-up"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, through-the-scope or over-the-scope clip (otsc) closure + npo + iv antibiotics ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Endoscopic Surgery."
      },
      {
        "id": "sim-v2-096-q3",
        "question": "Urgent OR indication despite endoscopic clipping?",
        "options": [
          "Mild transient bloating",
          "Normal WBC Day 2",
          "Clean polypectomy",
          "Peritonitis, hemodynamic instability, or failed closure"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on peritonitis, hemodynamic instability, or failed closure to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Colonic Perforation During Therapeutic Polypectomy \u2014 Clip Rescue."
      }
    ]
  },
  {
    "id": "sim-v2-097",
    "title": "POEM (Peroral Endoscopic Myotomy) for Type II Achalasia",
    "category": "Endoscopic Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "36F progressive dysphagia, manometry Type II achalasia, barium bird-beak esophagus.",
    "skillsTested": [
      "Submucosal Tunnel",
      "Circular Myotomy",
      "Mucosal Clipping",
      "Acid Reflux Watch"
    ],
    "questions": [
      {
        "id": "sim-v2-097-q1",
        "question": "Layer divided during POEM myotomy?",
        "options": [
          "Inner circular muscle layer across LES into proximal 2-3 cm of cardia",
          "Full-thickness mucosal excision",
          "Outer longitudinal muscle only leaving LES intact",
          "Pyloric sphincter"
        ],
        "correctIndex": 0,
        "explanation": "Inner circular muscle layer across LES into proximal 2-3 cm of cardia represents the evidence-based surgical priority in POEM (Peroral Endoscopic Myotomy) for Type II Achalasia.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Endoscopic Surgery."
      },
      {
        "id": "sim-v2-097-q2",
        "question": "Most critical integrity step at end of POEM?",
        "options": [
          "Leave mucosotomy open",
          "Place esophageal stent in every case",
          "Secure watertight closure of mucosal entry incision with clips",
          "Skip closure"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, secure watertight closure of mucosal entry incision with clips ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Endoscopic Surgery."
      },
      {
        "id": "sim-v2-097-q3",
        "question": "Long-term post-POEM follow-up focus?",
        "options": [
          "Aortic aneurysm",
          "Gallstones",
          "Appendicitis",
          "Surveillance & PPI therapy for post-POEM GERD"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on surveillance & ppi therapy for post-poem gerd to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for POEM (Peroral Endoscopic Myotomy) for Type II Achalasia."
      }
    ]
  },
  {
    "id": "sim-v2-098",
    "title": "Endoscopic Ultrasound-Guided Fine Needle Biopsy of Pancreatic Head Mass",
    "category": "Endoscopic Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "65M painless jaundice, CT shows 2.6 cm borderline resectable pancreatic head mass.",
    "skillsTested": [
      "EUS-FNB",
      "Doppler Vascular Check",
      "Metal vs Plastic Stent",
      "Staging Accuracy"
    ],
    "questions": [
      {
        "id": "sim-v2-098-q1",
        "question": "Why check color Doppler before passing FNB needle into pancreatic mass?",
        "options": [
          "Measures tumor grade",
          "Avoid puncturing intervening portal/SMV/GDA vessels",
          "Replaces CT",
          "Shrinks cyst"
        ],
        "correctIndex": 1,
        "explanation": "Avoid puncturing intervening portal/SMV/GDA vessels represents the evidence-based surgical priority in Endoscopic Ultrasound-Guided Fine Needle Biopsy of Pancreatic Head Mass.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Endoscopic Surgery."
      },
      {
        "id": "sim-v2-098-q2",
        "question": "Pre-op biliary stenting preference when neoadjuvant chemo is planned?",
        "options": [
          "Skip biopsy before stenting always",
          "Permanent percutaneous drain if avoidable",
          "Short covered/uncovered self-expandable metal stent (SEMS) after tissue diagnosis",
          "Immediate hepatic resection"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, short covered/uncovered self-expandable metal stent (sems) after tissue diagnosis ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Endoscopic Surgery."
      },
      {
        "id": "sim-v2-098-q3",
        "question": "If jaundiced patient is going STRAIGHT to upfront Whipple within 1 week?",
        "options": [
          "Mandatory stent for bilirubin 2.5",
          "Wait 6 months",
          "Give warfarin",
          "Avoid routine pre-op stenting unless cholangitis, severe pruritus, or delay"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on avoid routine pre-op stenting unless cholangitis, severe pruritus, or delay to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Endoscopic Ultrasound-Guided Fine Needle Biopsy of Pancreatic Head Mass."
      }
    ]
  },
  {
    "id": "sim-v2-099",
    "title": "Open Globe Injury Repair \u2014 Pre-Op & Surgical Priority",
    "category": "Ophthalmology",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "28M metallic hammering without eye protection, peaked pupil, 3mm corneoscleral laceration.",
    "skillsTested": [
      "Shield No Pressure",
      "Avoid Sux",
      "10-0 Nylon Cornea",
      "Endophthalmitis Abx"
    ],
    "questions": [
      {
        "id": "sim-v2-099-q1",
        "question": "Immediate ED protection maneuver for suspected open globe?",
        "options": [
          "Place rigid eye shield (Fox shield) WITHOUT any pressure/manipulation + NPO + antiemetic",
          "Measure intraocular pressure with Goldmann applanation",
          "Press patch tightly on lid",
          "Irrigate forcibly"
        ],
        "correctIndex": 0,
        "explanation": "Place rigid eye shield (Fox shield) WITHOUT any pressure/manipulation + NPO + antiemetic represents the evidence-based surgical priority in Open Globe Injury Repair \u2014 Pre-Op & Surgical Priority.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Ophthalmology."
      },
      {
        "id": "sim-v2-099-q2",
        "question": "Anesthetic induction drug avoided due to transient IOP elevation?",
        "options": [
          "Propofol",
          "Fentanyl",
          "Succinylcholine (use non-depolarizing NMB like rocuronium cleanly)",
          "Sevoflurane"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, succinylcholine (use non-depolarizing nmb like rocuronium cleanly) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Ophthalmology."
      },
      {
        "id": "sim-v2-099-q3",
        "question": "Microsurgical suture typically used to close watertight corneal laceration?",
        "options": [
          "2-0 silk",
          "3-0 Vicryl",
          "Staples",
          "10-0 monofilament nylon"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on 10-0 monofilament nylon to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Open Globe Injury Repair \u2014 Pre-Op & Surgical Priority."
      }
    ]
  },
  {
    "id": "sim-v2-100",
    "title": "Acute Angle-Closure Glaucoma Crisis vs Laser Iridotomy",
    "category": "Ophthalmology",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "64F hyperope in dim theater, severe eye pain, halos, mid-dilated fixed pupil, IOP 58 mmHg.",
    "skillsTested": [
      "Medical Drop First",
      "Pilocarpine Timing",
      "Laser LPI",
      "Contralateral Prophylaxis"
    ],
    "questions": [
      {
        "id": "sim-v2-100-q1",
        "question": "Initial emergency medical drop/systemic regimen?",
        "options": [
          "Atropine cycloplegic drops",
          "IV acetazolamide, topical beta-blocker, alpha-agonist, pilocarpine (once IOP <40), hyperosmotics",
          "Watchful waiting",
          "Immediate cataract phaco tonight blindly"
        ],
        "correctIndex": 1,
        "explanation": "IV acetazolamide, topical beta-blocker, alpha-agonist, pilocarpine (once IOP <40), hyperosmotics represents the evidence-based surgical priority in Acute Angle-Closure Glaucoma Crisis vs Laser Iridotomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Ophthalmology."
      },
      {
        "id": "sim-v2-100-q2",
        "question": "Definitive procedure relieving pupillary block?",
        "options": [
          "Enucleation",
          "Strabismus surgery",
          "Nd:YAG Laser Peripheral Iridotomy (LPI) + prophylactic LPI on fellow eye",
          "Blepharoplasty"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, nd:yag laser peripheral iridotomy (lpi) + prophylactic lpi on fellow eye ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Ophthalmology."
      },
      {
        "id": "sim-v2-100-q3",
        "question": "Drugs strictly contraindicated in acute angle closure?",
        "options": [
          "Timolol",
          "Acetazolamide",
          "Mannitol",
          "Topical mydriatics / anticholinergics (e.g. tropicamide/atropine)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on topical mydriatics / anticholinergics (e.g. tropicamide/atropine) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Angle-Closure Glaucoma Crisis vs Laser Iridotomy."
      }
    ]
  },
  {
    "id": "sim-v2-101",
    "title": "Rhegmatogenous Retinal Detachment (Macula-On) Urgency",
    "category": "Ophthalmology",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "55M recent flashes/floaters, acute superior nasal visual field curtain, fovea still attached.",
    "skillsTested": [
      "Macula-On Urgency",
      "PPV / Scleral Buckle",
      "Laser/Cryo",
      "Gas Tamponade"
    ],
    "questions": [
      {
        "id": "sim-v2-101-q1",
        "question": "Timing difference between macula-on vs macula-off retinal detachment?",
        "options": [
          "Macula-on is urgent (<24h surgery) to preserve central 20/20 visual acuity",
          "Macula-on can wait 2 months",
          "Never operate macula-on",
          "Both managed with eye drops"
        ],
        "correctIndex": 0,
        "explanation": "Macula-on is urgent (<24h surgery) to preserve central 20/20 visual acuity represents the evidence-based surgical priority in Rhegmatogenous Retinal Detachment (Macula-On) Urgency.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Ophthalmology."
      },
      {
        "id": "sim-v2-101-q2",
        "question": "Surgical options for rhegmatogenous RD repair?",
        "options": [
          "Corneal transplant",
          "Trabeculectomy",
          "Pars plana vitrectomy (PPV) with gas/oil tamponade, scleral buckle, or pneumatic retinopexy",
          "Orbitotomy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, pars plana vitrectomy (ppv) with gas/oil tamponade, scleral buckle, or pneumatic retinopexy ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Ophthalmology."
      },
      {
        "id": "sim-v2-101-q3",
        "question": "Post-op restriction with intraocular SF6/C3F8 gas bubble?",
        "options": [
          "Avoid walking",
          "Wear contact lenses immediately",
          "Sleep face-up always",
          "NO air travel or high-altitude ascent until gas resolves (expansion -> CRAO)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on no air travel or high-altitude ascent until gas resolves (expansion -> crao) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Rhegmatogenous Retinal Detachment (Macula-On) Urgency."
      }
    ]
  },
  {
    "id": "sim-v2-102",
    "title": "Awake Emergency Tracheostomy vs Cricothyroidotomy",
    "category": "ENT Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "52M obstructing supraglottic tumor with severe biphasic stridor, unable to intubate or ventilate.",
    "skillsTested": [
      "Airway Plan",
      "2nd-3rd Rings",
      "Innominate Risk",
      "Cuff Check"
    ],
    "questions": [
      {
        "id": "sim-v2-102-q1",
        "question": "Fastest emergency surgical airway in CICO ('cannot intubate, cannot oxygenate') adult?",
        "options": [
          "Elective low mediastinoscopy",
          "Surgical cricothyroidotomy (vertical skin, horizontal cricothyroid membrane)",
          "Bronchial blocker",
          "Wait for MRI neck"
        ],
        "correctIndex": 1,
        "explanation": "Surgical cricothyroidotomy (vertical skin, horizontal cricothyroid membrane) represents the evidence-based surgical priority in Awake Emergency Tracheostomy vs Cricothyroidotomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for ENT Surgery."
      },
      {
        "id": "sim-v2-102-q2",
        "question": "Ideal tracheal rings for formal surgical tracheostomy?",
        "options": [
          "Cricoid cartilage resection",
          "6th ring near innominate",
          "2nd and 3rd tracheal rings (below isthmus/1st ring to avoid subglottic stenosis)",
          "Thyroid cartilage"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, 2nd and 3rd tracheal rings (below isthmus/1st ring to avoid subglottic stenosis) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in ENT Surgery."
      },
      {
        "id": "sim-v2-102-q3",
        "question": "Life-threatening delayed massive hemorrhage >48h post-trach signals?",
        "options": [
          "Normal granulation",
          "Minor stitch abscess",
          "Vocal cord granuloma",
          "Tracheoinnominate artery fistula (hyperinflate cuff + Utley finger compression)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on tracheoinnominate artery fistula (hyperinflate cuff + utley finger compression) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Awake Emergency Tracheostomy vs Cricothyroidotomy."
      }
    ]
  },
  {
    "id": "sim-v2-103",
    "title": "Superficial Parotidectomy \u2014 Facial Nerve Identification",
    "category": "ENT Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "47F painless slow-growing 2.5 cm pleomorphic adenoma of superficial right parotid lobe.",
    "skillsTested": [
      "Preserve Capsule",
      "Tragal Pointer",
      "Facial Branches",
      "Frey Syndrome"
    ],
    "questions": [
      {
        "id": "sim-v2-103-q1",
        "question": "Key anatomical landmark locating main facial nerve (CN VII) trunk?",
        "options": [
          "Tragal pointer (1 cm deep/inferior) & tympanomastoid suture + posterior digastric",
          "Mandibular condyle tip",
          "Carotid bifurcation",
          "Thyroid isthmus"
        ],
        "correctIndex": 0,
        "explanation": "Tragal pointer (1 cm deep/inferior) & tympanomastoid suture + posterior digastric represents the evidence-based surgical priority in Superficial Parotidectomy \u2014 Facial Nerve Identification.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for ENT Surgery."
      },
      {
        "id": "sim-v2-103-q2",
        "question": "Why avoid simple enucleation of pleomorphic adenoma?",
        "options": [
          "Too expensive",
          "Causes hypercalcemia",
          "High recurrence rate from microscopic pseudopods and capsule rupture",
          "Injures optic nerve"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, high recurrence rate from microscopic pseudopods and capsule rupture ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in ENT Surgery."
      },
      {
        "id": "sim-v2-103-q3",
        "question": "Post-op gustatory sweating over cheek ('Frey syndrome') reflects?",
        "options": [
          "Carotid blowout",
          "Thyroid storm",
          "Hypoglossal palsy",
          "Aberrant parasympathetic auriculotemporal nerve regeneration to sweat glands"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on aberrant parasympathetic auriculotemporal nerve regeneration to sweat glands to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Superficial Parotidectomy \u2014 Facial Nerve Identification."
      }
    ]
  },
  {
    "id": "sim-v2-104",
    "title": "Post-Tonsillectomy Secondary Hemorrhage Emergency",
    "category": "ENT Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "14M Day 7 post-tonsillectomy with brisk bright red oral bleeding (300 mL clots).",
    "skillsTested": [
      "NPO Airway",
      "Suction & Control",
      "Bipolar / Suture",
      "Clotting Workup"
    ],
    "questions": [
      {
        "id": "sim-v2-104-q1",
        "question": "Immediate ED preparation for significant secondary post-tonsillectomy bleed?",
        "options": [
          "Send home with ice chips",
          "IV access, CBC/coags/crossmatch, keep upright/suction, urgent ENT OR return",
          "Pack mouth with dry gauze blindly and discharge",
          "Give aspirin"
        ],
        "correctIndex": 1,
        "explanation": "IV access, CBC/coags/crossmatch, keep upright/suction, urgent ENT OR return represents the evidence-based surgical priority in Post-Tonsillectomy Secondary Hemorrhage Emergency.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for ENT Surgery."
      },
      {
        "id": "sim-v2-104-q2",
        "question": "Timing peak for secondary post-tonsillectomy hemorrhage?",
        "options": [
          "Minute 5 only",
          "Month 6",
          "Days 5 to 10 (eschar sloughing)",
          "Year 2"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, days 5 to 10 (eschar sloughing) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in ENT Surgery."
      },
      {
        "id": "sim-v2-104-q3",
        "question": "Primary pitfall during endotracheal induction in active tonsil bleed?",
        "options": [
          "Deep blind sedation without airway",
          "Oral feeds before OR",
          "Muscle relaxant omission",
          "Full stomach of swallowed blood -> rapid sequence induction with double suction"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on full stomach of swallowed blood -> rapid sequence induction with double suction to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Post-Tonsillectomy Secondary Hemorrhage Emergency."
      }
    ]
  },
  {
    "id": "sim-v2-105",
    "title": "Deceased-Donor Kidney Transplant \u2014 Acute Vascular Thrombosis",
    "category": "Transplant Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "49M 6h post-right iliac fossa renal transplant: urine drops abruptly to 0 mL/h, tenderness, Doppler absent.",
    "skillsTested": [
      "Immediate US/OR",
      "External Iliac",
      "Cold Ischemia",
      "Lich-Gregoir"
    ],
    "questions": [
      {
        "id": "sim-v2-105-q1",
        "question": "Suspected catastrophe when urine ceases abruptly hours after transplant?",
        "options": [
          "Renal vein or renal artery thrombosis (surgical emergency!)",
          "Chronic rejection at hour 6",
          "UTI",
          "Diabetes insipidus"
        ],
        "correctIndex": 0,
        "explanation": "Renal vein or renal artery thrombosis (surgical emergency!) represents the evidence-based surgical priority in Deceased-Donor Kidney Transplant \u2014 Acute Vascular Thrombosis.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Transplant Surgery."
      },
      {
        "id": "sim-v2-105-q2",
        "question": "Standard venous and arterial anastomotic target in adult first renal transplant?",
        "options": [
          "Inferior mesenteric vessels",
          "Portal vein",
          "External iliac vein and external iliac artery (end-to-side)",
          "Splenic artery"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, external iliac vein and external iliac artery (end-to-side) ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Transplant Surgery."
      },
      {
        "id": "sim-v2-105-q3",
        "question": "Why ureteroneocystostomy (Lich-Gregoir) utilizes a muscular tunnel?",
        "options": [
          "Increases stones",
          "Eliminates bladder",
          "Prevents creatinine clearance",
          "Creates antireflux mechanism protecting transplant kidney from high bladder pressure"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on creates antireflux mechanism protecting transplant kidney from high bladder pressure to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Deceased-Donor Kidney Transplant \u2014 Acute Vascular Thrombosis."
      }
    ]
  },
  {
    "id": "sim-v2-106",
    "title": "Orthotopic Liver Transplant \u2014 Piggyback vs Caval Anastomosis",
    "category": "Transplant Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "54M MELD 29 cirrhosis undergoing deceased-donor OLT, anhepatic phase hemodynamics.",
    "skillsTested": [
      "Portal Flush",
      "Hepatic Artery Check",
      "Biliary Reconstruction",
      "HAT Crisis"
    ],
    "questions": [
      {
        "id": "sim-v2-106-q1",
        "question": "First vessel reperfused during classic OLT after cava to restore portal/splanchnic flow?",
        "options": [
          "Cystic artery",
          "Portal vein (following hepatic venous outflow)",
          "Inferior mesenteric artery",
          "Renal vein"
        ],
        "correctIndex": 1,
        "explanation": "Portal vein (following hepatic venous outflow) represents the evidence-based surgical priority in Orthotopic Liver Transplant \u2014 Piggyback vs Caval Anastomosis.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Transplant Surgery."
      },
      {
        "id": "sim-v2-106-q2",
        "question": "Early post-op transaminase spike >3000 + absent hepatic artery Doppler flow indicates?",
        "options": [
          "Normal recovery",
          "Mild viral cold",
          "Hepatic artery thrombosis (HAT) -> emergent thrombectomy or urgent retransplant listing",
          "Tacrolimus allergy"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, hepatic artery thrombosis (hat) -> emergent thrombectomy or urgent retransplant listing ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Transplant Surgery."
      },
      {
        "id": "sim-v2-106-q3",
        "question": "Standard biliary anastomosis in OLT without PSC?",
        "options": [
          "Cholecystogastrostomy",
          "Whipple",
          "Colonic interposition",
          "Duct-to-duct choledochocholedochostomy"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on duct-to-duct choledochocholedochostomy to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Orthotopic Liver Transplant \u2014 Piggyback vs Caval Anastomosis."
      }
    ]
  },
  {
    "id": "sim-v2-107",
    "title": "Heart Transplant \u2014 Bicaval Technique & Primary Graft Dysfunction",
    "category": "Transplant Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "51M dilated cardiomyopathy receiving ABO-compatible donor heart, ischemic time 3.5h.",
    "skillsTested": [
      "Cold Ischemia <4h",
      "Bicaval Sinus Node",
      "NO / Inotropes",
      "Biopsy Surveillance"
    ],
    "questions": [
      {
        "id": "sim-v2-107-q1",
        "question": "Advantage of bicaval over biatrial anastomosis in heart transplantation?",
        "options": [
          "Lower incidence of tricuspid regurgitation & sinus node dysfunction",
          "Double cold time",
          "No pacing ever",
          "Avoids immunosuppression"
        ],
        "correctIndex": 0,
        "explanation": "Lower incidence of tricuspid regurgitation & sinus node dysfunction represents the evidence-based surgical priority in Heart Transplant \u2014 Bicaval Technique & Primary Graft Dysfunction.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Transplant Surgery."
      },
      {
        "id": "sim-v2-107-q2",
        "question": "Critical early hemodynamic risk of donor heart exposed to high recipient PVR?",
        "options": [
          "Immediate LV hypertrophy",
          "Hyperthyroidism",
          "Acute right ventricular failure / primary graft dysfunction",
          "Renal calculi"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, acute right ventricular failure / primary graft dysfunction ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Transplant Surgery."
      },
      {
        "id": "sim-v2-107-q3",
        "question": "Gold-standard surveillance tool for acute cellular rejection in Year 1?",
        "options": [
          "Chest X-ray alone",
          "Troponin only",
          "Skin prick test",
          "Endomyocardial biopsy (RV septum)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on endomyocardial biopsy (rv septum) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Heart Transplant \u2014 Bicaval Technique & Primary Graft Dysfunction."
      }
    ]
  },
  {
    "id": "sim-v2-108",
    "title": "Total Thyroidectomy \u2014 Bilateral RLN & Post-Op Hematoma",
    "category": "Endocrine Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "44F 3 hours post-total thyroidectomy for papillary carcinoma develops neck tightness, stridor.",
    "skillsTested": [
      "Open Wound Immediately",
      "RLN Landmarks",
      "Parathyroid Autotransplant",
      "Hypocalcemia Check"
    ],
    "questions": [
      {
        "id": "sim-v2-108-q1",
        "question": "Immediate life-saving bedside maneuver for compressive neck hematoma?",
        "options": [
          "Wait 45 min for CT neck",
          "Open skin & strap muscle sutures immediately at bedside to decompress trachea BEFORE intubation",
          "Give oral antihistamines",
          "Await elective ENT consult tomorrow"
        ],
        "correctIndex": 1,
        "explanation": "Open skin & strap muscle sutures immediately at bedside to decompress trachea BEFORE intubation represents the evidence-based surgical priority in Total Thyroidectomy \u2014 Bilateral RLN & Post-Op Hematoma.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Endocrine Surgery."
      },
      {
        "id": "sim-v2-108-q2",
        "question": "Anatomical landmark where Recurrent Laryngeal Nerve is most vulnerable?",
        "options": [
          "Strap muscle skin edge",
          "Platysma",
          "Ligament of Berry (posterior suspensory ligament) / Zuckerkandl tubercle",
          "Submental triangle"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, ligament of berry (posterior suspensory ligament) / zuckerkandl tubercle ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Endocrine Surgery."
      },
      {
        "id": "sim-v2-108-q3",
        "question": "Management of an inadvertently devascularized parathyroid gland intra-op?",
        "options": [
          "Discard into waste",
          "Replant into thyroid lobe",
          "Leave ischemic in neck",
          "Dice into 1mm fragments and autotransplant into sternocleidomastoid muscle pocket"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on dice into 1mm fragments and autotransplant into sternocleidomastoid muscle pocket to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Total Thyroidectomy \u2014 Bilateral RLN & Post-Op Hematoma."
      }
    ]
  },
  {
    "id": "sim-v2-109",
    "title": "Primary Hyperparathyroidism \u2014 Minimally Invasive Focused Parathyroidectomy",
    "category": "Endocrine Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "57F Ca 11.8, PTH 165, Sestamibi/4D-CT concordant right inferior parathyroid adenoma.",
    "skillsTested": [
      "Miami Criterion",
      "Four-Gland Knowledge",
      "Supernumerary Thymus",
      "Hungry Bone"
    ],
    "questions": [
      {
        "id": "sim-v2-109-q1",
        "question": "Miami criterion confirming cure via intraoperative PTH assay (ioPTH)?",
        "options": [
          ">= 50% drop from highest pre-incision/pre-excision baseline at 10 minutes",
          "10% drop at 2 hours",
          "PTH doubles",
          "Calcium rises immediately"
        ],
        "correctIndex": 0,
        "explanation": ">= 50% drop from highest pre-incision/pre-excision baseline at 10 minutes represents the evidence-based surgical priority in Primary Hyperparathyroidism \u2014 Minimally Invasive Focused Parathyroidectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Endocrine Surgery."
      },
      {
        "id": "sim-v2-109-q2",
        "question": "Common ectopic site for missed inferior parathyroid gland?",
        "options": [
          "Carotid bulb skin",
          "Parotid gland",
          "Thymic tongue / anterior superior mediastinum",
          "Posterior skull"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, thymic tongue / anterior superior mediastinum ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Endocrine Surgery."
      },
      {
        "id": "sim-v2-109-q3",
        "question": "Severe prolonged post-op hypocalcemia with normal/low phosphate/Mg after severe bone disease?",
        "options": [
          "Primary hyperaldosteronism",
          "Pheochromocytoma",
          "Diabetes",
          "Hungry bone syndrome"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on hungry bone syndrome to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Primary Hyperparathyroidism \u2014 Minimally Invasive Focused Parathyroidectomy."
      }
    ]
  },
  {
    "id": "sim-v2-110",
    "title": "Laparoscopic Adrenalectomy for Pheochromocytoma",
    "category": "Endocrine Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 18,
    "scenario": "39M episodic palpitations, diaphoresis, elevated plasma metanephrines, 4.5 cm right adrenal mass.",
    "skillsTested": [
      "Alpha Before Beta",
      "Early Adrenal Vein",
      "Minimal Touch",
      "Post-Op Hypotension"
    ],
    "questions": [
      {
        "id": "sim-v2-110-q1",
        "question": "Mandatory 10-14 day pre-op pharmacologic blockade sequence?",
        "options": [
          "Beta-blocker FIRST alone (precipitates hypertensive crisis)",
          "Alpha-blockade FIRST (phenoxybenzamine/doxazosin), THEN beta-blocker + volume load",
          "Calcium blocker only",
          "High-dose steroids"
        ],
        "correctIndex": 1,
        "explanation": "Alpha-blockade FIRST (phenoxybenzamine/doxazosin), THEN beta-blocker + volume load represents the evidence-based surgical priority in Laparoscopic Adrenalectomy for Pheochromocytoma.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Endocrine Surgery."
      },
      {
        "id": "sim-v2-110-q2",
        "question": "Critical surgical priority during pheochromocytoma dissection?",
        "options": [
          "Squeeze tumor to check BP",
          "Divide renal artery first",
          "Minimal tumor manipulation + early clipping/division of main adrenal vein",
          "Open biopsy prior to excision"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, minimal tumor manipulation + early clipping/division of main adrenal vein ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Endocrine Surgery."
      },
      {
        "id": "sim-v2-110-q3",
        "question": "Expected immediate post-op hemodynamic shift after adrenal vein ligation?",
        "options": [
          "Malignant hyperthermia",
          "Bradycardia permanent",
          "Hypertensive emergency forever",
          "Abrupt hypotension requiring volume & temporary vasopressors (loss of catecholamine surge)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on abrupt hypotension requiring volume & temporary vasopressors (loss of catecholamine surge) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Laparoscopic Adrenalectomy for Pheochromocytoma."
      }
    ]
  },
  {
    "id": "sim-v2-111",
    "title": "Acute Diverticulitis (Hinchey III Purulent Peritonitis) \u2014 Resection vs Hartmann",
    "category": "Colorectal Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 21,
    "scenario": "67M diffuse peritonitis, CT perforated sigmoid diverticulitis with purulent free fluid.",
    "skillsTested": [
      "Hinchey Stages",
      "Hartmann vs Primary+Divert",
      "Ureter Check",
      "Splenic Flexure"
    ],
    "questions": [
      {
        "id": "sim-v2-111-q1",
        "question": "Gold-standard procedure in unstable/frail Hinchey III-IV perforated diverticulitis?",
        "options": [
          "Sigmoid resection with end colostomy (Hartmann procedure) or primary anastomosis+ileostomy if stable",
          "Colonoscopy tonight",
          "Oral ciprofloxacin home",
          "Appendectomy alone"
        ],
        "correctIndex": 0,
        "explanation": "Sigmoid resection with end colostomy (Hartmann procedure) or primary anastomosis+ileostomy if stable represents the evidence-based surgical priority in Acute Diverticulitis (Hinchey III Purulent Peritonitis) \u2014 Resection vs Hartmann.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Colorectal Surgery."
      },
      {
        "id": "sim-v2-111-q2",
        "question": "Key retroperitoneal structure identified before dividing IMA/sigmoid vessels?",
        "options": [
          "Right phrenic nerve",
          "Splenic artery",
          "Left ureter crossing common iliac bifurcation",
          "Duodenum D1"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, left ureter crossing common iliac bifurcation ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Colorectal Surgery."
      },
      {
        "id": "sim-v2-111-q3",
        "question": "Hinchey II (>4 cm pelvic abscess, stable, no diffuse peritonitis) initial treatment?",
        "options": [
          "Immediate Hartmann tonight",
          "Discharge without drain",
          "Sigmoid biopsy",
          "CT-guided percutaneous drainage + IV antibiotics"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on ct-guided percutaneous drainage + iv antibiotics to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Acute Diverticulitis (Hinchey III Purulent Peritonitis) \u2014 Resection vs Hartmann."
      }
    ]
  },
  {
    "id": "sim-v2-112",
    "title": "Low Rectal Cancer \u2014 TME & Anastomotic Leak Prevention",
    "category": "Colorectal Surgery",
    "difficulty": "advanced",
    "urgency": "elective",
    "estimatedMinutes": 12,
    "scenario": "59M T3N1 adenocarcinoma 5 cm from anal verge post-neoadjuvant CRT undergoing LAR.",
    "skillsTested": [
      "Heald Holy Plane",
      "Pelvic Nerves",
      "Diverting Loop",
      "Leak Triage"
    ],
    "questions": [
      {
        "id": "sim-v2-112-q1",
        "question": "Anatomical plane of Total Mesorectal Excision (TME)?",
        "options": [
          "Through mesorectal fat",
          "Avascular areolar plane between mesorectal fascia propria and presacral parietal fascia",
          "Deep to presacral veins",
          "Submucosa only"
        ],
        "correctIndex": 1,
        "explanation": "Avascular areolar plane between mesorectal fascia propria and presacral parietal fascia represents the evidence-based surgical priority in Low Rectal Cancer \u2014 TME & Anastomotic Leak Prevention.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Colorectal Surgery."
      },
      {
        "id": "sim-v2-112-q2",
        "question": "Why create a temporary diverting loop ileostomy after low pelvic anastomosis post-CRT?",
        "options": [
          "Prevents anal cancer",
          "Eliminates need for vessels",
          "Does not prevent leak entirely but dramatically mitigates septic morbidity/mortality",
          "Treats constipation"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, does not prevent leak entirely but dramatically mitigates septic morbidity/mortality ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Colorectal Surgery."
      },
      {
        "id": "sim-v2-112-q3",
        "question": "Leak management in stable patient with contained pelvic presacral abscess?",
        "options": [
          "Take down loop ileostomy early",
          "Give oral laxatives",
          "Do nothing",
          "Broad antibiotics, NPO/TPN + percutaneous/transanal drainage (maintain diversion)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on broad antibiotics, npo/tpn + percutaneous/transanal drainage (maintain diversion) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Low Rectal Cancer \u2014 TME & Anastomotic Leak Prevention."
      }
    ]
  },
  {
    "id": "sim-v2-113",
    "title": "Fulminant Clostridioides difficile Colitis \u2014 Subtotal Colectomy",
    "category": "Colorectal Surgery",
    "difficulty": "intermediate",
    "urgency": "elective",
    "estimatedMinutes": 15,
    "scenario": "72F WBC 42,000, lactate 5.4, pressor-dependent, CT pancolitis megacolon 11 cm.",
    "skillsTested": [
      "Early Surgery",
      "Subtotal Colectomy",
      "Ileostomy",
      "Loop Ileostomy Alt"
    ],
    "questions": [
      {
        "id": "sim-v2-113-q1",
        "question": "Surgical procedure of choice for fulminant toxic C. diff colitis?",
        "options": [
          "Total abdominal / subtotal colectomy with end ileostomy (sparing rectum)",
          "Right hemicolectomy with primary anastomosis",
          "Colonoscopy decompression only",
          "Proctectomy first"
        ],
        "correctIndex": 0,
        "explanation": "Total abdominal / subtotal colectomy with end ileostomy (sparing rectum) represents the evidence-based surgical priority in Fulminant Clostridioides difficile Colitis \u2014 Subtotal Colectomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Colorectal Surgery."
      },
      {
        "id": "sim-v2-113-q2",
        "question": "Why NOT perform primary ileorectal anastomosis in toxic megacolon?",
        "options": [
          "Takes too little time",
          "Rectum never heals",
          "High anastomotic failure rate in shocked malnourished septic bowel",
          "Causes gallstones"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, high anastomotic failure rate in shocked malnourished septic bowel ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Colorectal Surgery."
      },
      {
        "id": "sim-v2-113-q3",
        "question": "Optimal timing of surgery in fulminant C. diff?",
        "options": [
          "After 3 weeks of probiotics",
          "Only after bowel perforation",
          "Day 30",
          "Before serum lactate >5 or irreversible multi-organ shock occurs"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on before serum lactate >5 or irreversible multi-organ shock occurs to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Fulminant Clostridioides difficile Colitis \u2014 Subtotal Colectomy."
      }
    ]
  },
  {
    "id": "sim-v2-114",
    "title": "Abdominal Compartment Syndrome Post-Resuscitation",
    "category": "Critical Care",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 18,
    "scenario": "50M severe pancreatitis given 14L crystalloids, oliguric, peak airway pressure 44, bladder pressure 28.",
    "skillsTested": [
      "IAP Threshold",
      "APP Formula",
      "Non-Op Decompression",
      "Open Abdomen"
    ],
    "questions": [
      {
        "id": "sim-v2-114-q1",
        "question": "Diagnostic intra-abdominal pressure cutoff for Abdominal Compartment Syndrome (ACS)?",
        "options": [
          "IAP > 5 mmHg",
          "Sustained IAP > 20 mmHg WITH new organ dysfunction/failure",
          "CVP > 10",
          "Lactate < 1.0"
        ],
        "correctIndex": 1,
        "explanation": "Sustained IAP > 20 mmHg WITH new organ dysfunction/failure represents the evidence-based surgical priority in Abdominal Compartment Syndrome Post-Resuscitation.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Critical Care."
      },
      {
        "id": "sim-v2-114-q2",
        "question": "Target Abdominal Perfusion Pressure (APP = MAP - IAP)?",
        "options": [
          "< 20 mmHg",
          "10 mmHg",
          ">= 60 mmHg",
          "150 mmHg"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, >= 60 mmhg ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Critical Care."
      },
      {
        "id": "sim-v2-114-q3",
        "question": "Definitive surgical rescue for refractory Grade IV ACS?",
        "options": [
          "Aggressive additional 8L fluid bolus",
          "Deep chest compressions",
          "Furosemide push alone",
          "Decompressive laparotomy with temporary abdominal closure (negative-pressure Bogota/ABThera)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on decompressive laparotomy with temporary abdominal closure (negative-pressure bogota/abthera) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Abdominal Compartment Syndrome Post-Resuscitation."
      }
    ]
  },
  {
    "id": "sim-v2-115",
    "title": "Refractory Septic Shock & Necrotizing Pneumonia \u2014 Source Control",
    "category": "Critical Care",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 21,
    "scenario": "61M ICU septic shock on norepinephrine + vasopressin, rising lactate, unresolved pleural abscess.",
    "skillsTested": [
      "Vasopressor Targets",
      "Dynamic Fluid Check",
      "Source Control <6-12h",
      "Steroids Refractory"
    ],
    "questions": [
      {
        "id": "sim-v2-115-q1",
        "question": "Mean Arterial Pressure (MAP) resuscitation target in initial septic shock?",
        "options": [
          ">= 65 mmHg",
          ">= 110 mmHg",
          ">= 40 mmHg",
          "Zero target"
        ],
        "correctIndex": 0,
        "explanation": ">= 65 mmHg represents the evidence-based surgical priority in Refractory Septic Shock & Necrotizing Pneumonia \u2014 Source Control.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Critical Care."
      },
      {
        "id": "sim-v2-115-q2",
        "question": "Most decisive intervention when antimicrobials alone fail due to undrained pus?",
        "options": [
          "Switch 6 antibiotics without drainage",
          "Double sedation",
          "Prompt source control (drainage/debridement) as soon as medically/logistically feasible",
          "Wait 7 days"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, prompt source control (drainage/debridement) as soon as medically/logistically feasible ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Critical Care."
      },
      {
        "id": "sim-v2-115-q3",
        "question": "Adjunct considered in refractory shock escalating vasopressors?",
        "options": [
          "Oral NSAIDs",
          "Aggressive diuresis",
          "Hypertonic potassium",
          "IV hydrocortisone 200 mg/day"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on iv hydrocortisone 200 mg/day to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Refractory Septic Shock & Necrotizing Pneumonia \u2014 Source Control."
      }
    ]
  },
  {
    "id": "sim-v2-116",
    "title": "Post-Op Pulmonary Embolism with Submassive RV Strain",
    "category": "Critical Care",
    "difficulty": "advanced",
    "urgency": "emergency",
    "estimatedMinutes": 12,
    "scenario": "63F Day 6 post-colectomy, sudden dyspnea, HR 122, SpO2 88%, troponin+, CTPA saddle PE + RV/LV >1.1.",
    "skillsTested": [
      "Anticoagulation First",
      "PESI / RV Strain",
      "PERT / Catheter Rx",
      "IVC Filter Role"
    ],
    "questions": [
      {
        "id": "sim-v2-116-q1",
        "question": "Immediate primary therapeutic step once PE confirmed without active GI bleed?",
        "options": [
          "Wait 48h before heparin",
          "Therapeutic anticoagulation (IV UFH or LMWH) + oxygen + PERT evaluation",
          "IVC filter alone without heparin",
          "Oral aspirin 81 mg"
        ],
        "correctIndex": 1,
        "explanation": "Therapeutic anticoagulation (IV UFH or LMWH) + oxygen + PERT evaluation represents the evidence-based surgical priority in Post-Op Pulmonary Embolism with Submassive RV Strain.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Critical Care."
      },
      {
        "id": "sim-v2-116-q2",
        "question": "Indication for systemic thrombolysis or catheter-directed thrombectomy/EMBO?",
        "options": [
          "Tiny asymptomatic subsegmental PE",
          "Normal HR 70 & normal RV",
          "Massive PE (hypotension/shock) or deteriorating submassive RV failure",
          "All DVT patients"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, massive pe (hypotension/shock) or deteriorating submassive rv failure ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Critical Care."
      },
      {
        "id": "sim-v2-116-q3",
        "question": "Role of retrievable IVC filter?",
        "options": [
          "Routine primary prophylaxis in every post-op",
          "Replaces all anticoagulation permanently",
          "Used for arterial emboli",
          "Acute VTE with ABSOLUTE contraindication to anticoagulation (retrieve once safe)"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on acute vte with absolute contraindication to anticoagulation (retrieve once safe) to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Post-Op Pulmonary Embolism with Submassive RV Strain."
      }
    ]
  },
  {
    "id": "sim-v2-117",
    "title": "Major Thermal Burn (45% TBSA) \u2014 Parkland Resuscitation & Escharotomy",
    "category": "Burns Surgery",
    "difficulty": "intermediate",
    "urgency": "emergency",
    "estimatedMinutes": 15,
    "scenario": "33M 70kg house fire: 45% TBSA deep partial/full-thickness burns, circumferential chest & arm.",
    "skillsTested": [
      "Parkland Formula",
      "Urine Output Goal",
      "Inhalation Airway",
      "Escharotomy"
    ],
    "questions": [
      {
        "id": "sim-v2-117-q1",
        "question": "Total first 24h Lactated Ringer volume by Parkland formula (4 mL x kg x %TBSA)?",
        "options": [
          "12,600 mL total (half = 6,300 mL in first 8h from time of burn, rest over 16h)",
          "2,000 mL total",
          "25,000 mL in hour 1",
          "Zero crystalloids"
        ],
        "correctIndex": 0,
        "explanation": "12,600 mL total (half = 6,300 mL in first 8h from time of burn, rest over 16h) represents the evidence-based surgical priority in Major Thermal Burn (45% TBSA) \u2014 Parkland Resuscitation & Escharotomy.",
        "rationale": "Guided by ATLS / WSES / Society surgical guidelines for Burns Surgery."
      },
      {
        "id": "sim-v2-117-q2",
        "question": "Best bedside physiologic endpoint guiding hourly fluid titration?",
        "options": [
          "Fixed formula ignoring urine",
          "CVP 25 mmHg",
          "Urine output 0.5 mL/kg/h (35 mL/h) in adults \u2014 titrate to avoid fluid creep",
          "Daily weight only"
        ],
        "correctIndex": 2,
        "explanation": "Intraoperatively, urine output 0.5 ml/kg/h (35 ml/h) in adults \u2014 titrate to avoid fluid creep ensures anatomical safety and definitive control.",
        "rationale": "Prevents iatrogenic morbidity and optimizes outcome in Burns Surgery."
      },
      {
        "id": "sim-v2-117-q3",
        "question": "Indication for urgent bedside escharotomy of chest and arm?",
        "options": [
          "Superficial erythema sunburn",
          "10% palm scald",
          "Wait 7 days",
          "Circumferential full-thickness eschar causing high peak airway pressures or absent distal Doppler flow"
        ],
        "correctIndex": 3,
        "explanation": "Postoperative management centers on circumferential full-thickness eschar causing high peak airway pressures or absent distal doppler flow to catch and treat complications early.",
        "rationale": "Standard postoperative surveillance and recovery protocol for Major Thermal Burn (45% TBSA) \u2014 Parkland Resuscitation & Escharotomy."
      }
    ]
  }
];
