export interface InteractResidue {
  name: string;
  xyz: string; // e.g., "(12.5, 40.2, -5.1)"
  type: string; // e.g., "Hydrogen Bond", "Pi-Stacking"
}

export interface BindingMode {
  mode: number;
  affinity: number; // kcal/mol
  rmsdLowerBound: number;
  rmsdUpperBound: number;
}

export interface GridBox {
  center: { x: number; y: number; z: number };
  size: { x: number; y: number; z: number };
  spacing: number;
}

export interface AnalysisResult {
  bindingEnergy: number; // kcal/mol (Top mode)
  rmsd: number; // Angstroms
  ligandCentroid: string; // XYZ
  interactingResidues: InteractResidue[];
  
  // Docking Specifics
  dockingModes: BindingMode[];
  gridBox: GridBox;

  pathwayName: string;
  genesActivated: string[];
  enzymesInvolved: string[];
  cellResponse: string;
  receptor: string;
  cancerType: string;
  cancerClass: string;
  mutation: string;
  experimentalCorrelationScore?: number; // 0.0 to 1.0
  correlationSummary?: string;
  summary: string;
  detailedAnalysis: string; // New field for overall results and discussion
  imagePrompts: {
    molecularViz: string;
    pathwayMap: string;
    cellularResponse: string;
  };
}

export interface GeneratedImages {
  molecularViz?: string; // base64
  pathwayMap?: string; // base64
  cellularResponse?: string; // base64
}

export enum CancerType {
  Lung = 'Lung Cancer',
  Breast = 'Breast Cancer',
  Prostate = 'Prostate Cancer',
  Colorectal = 'Colorectal Cancer',
  Pancreatic = 'Pancreatic Cancer',
  Leukemia = 'Leukemia',
  Glioblastoma = 'Glioblastoma',
  Melanoma = 'Melanoma',
  Ovarian = 'Ovarian Cancer',
  Liver = 'Liver Cancer (HCC)',
  Lymphoma = 'Lymphoma',
  Kidney = 'Renal Cell Carcinoma'
}

export enum CancerClass {
  Adenocarcinoma = 'Adenocarcinoma',
  SquamousCell = 'Squamous Cell Carcinoma',
  SmallCell = 'Small Cell Carcinoma',
  LargeCell = 'Large Cell Carcinoma',
  TNBC = 'Triple-Negative Breast Cancer',
  Her2Positive = 'HER2-Positive',
  Luminal = 'Luminal A/B',
  GlioblastomaMultiforme = 'Glioblastoma Multiforme (GBM)',
  Astrocytoma = 'Astrocytoma',
  AML = 'Acute Myeloid Leukemia (AML)',
  CML = 'Chronic Myeloid Leukemia (CML)',
  ALL = 'Acute Lymphoblastic Leukemia (ALL)',
  CutaneousMelanoma = 'Cutaneous Melanoma',
  SerousCarcinoma = 'High-Grade Serous Carcinoma',
  Hepatocellular = 'Hepatocellular Carcinoma',
  ClearCell = 'Clear Cell Renal Cell Carcinoma'
}

export enum ReceptorOption {
  STAT3 = 'STAT3 (Signal Transducer and Activator of Transcription 3)',
  EGFR = 'EGFR (Epidermal Growth Factor Receptor)',
  VEGFR = 'VEGFR (Vascular Endothelial Growth Factor Receptor)',
  PDL1 = 'PD-L1',
  KRAS = 'KRAS (G12C mutant)',
  BRAF = 'BRAF (V600E)',
  ALK = 'ALK (Anaplastic Lymphoma Kinase)',
  Custom = 'Upload Custom PDB'
}