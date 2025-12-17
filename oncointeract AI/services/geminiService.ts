import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInteraction = async (
  ligandPdbContent: string,
  receptorName: string,
  customReceptorContent: string | null,
  cancerType: string,
  cancerClass: string,
  mutation: string,
  experimentalDataContent: string | null
): Promise<AnalysisResult> => {
  // Using Flash for speed/efficiency in structured data extraction
  const modelId = "gemini-2.5-flash";

  const prompt = `
    You are OncoInteract AI, an expert computational biology system specializing in Molecular Docking and Drug Discovery.
    
    **TASK:** Perform a full **AutoDock Vina** style virtual screening simulation and analysis.

    **Input Context:**
    - Cancer Type: ${cancerType}
    - Cancer Class: ${cancerClass}
    - Mutation: ${mutation || "None specified"}
    - Receptor Name: ${receptorName}
    
    **Structure Data:**
    - Ligand PDB (Snippet):
      \`\`\`
      ${ligandPdbContent.slice(0, 4000)}
      \`\`\`
    ${customReceptorContent ? `
    - Custom Receptor PDB (Snippet):
      \`\`\`
      ${customReceptorContent.slice(0, 4000)}
      \`\`\`
    ` : "- Standard Receptor Structure (Assume canonical structure for " + receptorName + ", focus on the primary active site)."}

    **Experimental Validation:**
    ${experimentalDataContent ? `Experimental Data Provided:\n${experimentalDataContent.slice(0, 1000)}` : "No experimental data provided."}

    **Analysis Requirements:**
    1. **Grid Box Estimation:** Calculate the center (X, Y, Z) and size (Angstroms) of the search space grid box covering the active site.
    2. **Docking Simulation:** Simulate the scoring of at least 5 binding modes. Report Affinity (kcal/mol) and RMSD (lb/ub).
    3. **Interaction Profiling:** Identify residues interacting via Hydrogen Bonds, Hydrophobic contacts, Pi-Stacking, etc.
    4. **Pathway Analysis:** Predict downstream effects (e.g., Inhibition of STAT3 phosphorylation -> Reduced Bcl-xl -> Apoptosis).
    5. **Scientific Report:** Summarize the binding mechanism and therapeutic potential in technical language suitable for a journal.

    **Image Prompts:** 
    - 'molecularViz': **High-Quality PyMOL 3D Render.** Render the Protein Receptor using **Thick Cartoon representation** (Helices as prominent coiled ribbons, Beta sheets as arrows). **Color the protein chains in shades of Teal and Deep Blue.** Render the Ligand in the binding pocket as a **Ball-and-Stick model** (Carbon=Dark Grey, Oxygen=Red, Nitrogen=Blue, Sulfur=Yellow). Add **light blue dashed lines** for hydrogen bonds. **CRITICAL:** Include text labels with leader lines pointing to key interacting residues (e.g., 'ARG 32', 'GLU 91'). Background should be a **solid neutral grey** (like #888888). Lighting should be soft studio lighting.
    - 'pathwayMap': Detailed biological signaling pathway. Box-and-arrow style. Professional scientific publication standard.
    - 'cellularResponse': 3D Biomedical illustration of the cellular phenotype change (e.g. Apoptosis, Cell Cycle Arrest).

    **Output JSON Schema:**
    Return ONLY JSON.
    {
      "bindingEnergy": number (Best mode affinity),
      "rmsd": number (RMSD of best mode vs reference),
      "ligandCentroid": "string",
      "dockingModes": [
         { "mode": 1, "affinity": -9.5, "rmsdLowerBound": 0.0, "rmsdUpperBound": 0.0 },
         { "mode": 2, "affinity": -9.2, "rmsdLowerBound": 1.2, "rmsdUpperBound": 1.8 }
         ... (5 modes)
      ],
      "gridBox": {
         "center": { "x": number, "y": number, "z": number },
         "size": { "x": number, "y": number, "z": number },
         "spacing": 0.375
      },
      "interactingResidues": [ 
        { "name": "string (e.g. ARG 32)", "xyz": "string", "type": "string" } 
      ],
      "pathwayName": "string",
      "genesActivated": ["string"],
      "enzymesInvolved": ["string"],
      "cellResponse": "string",
      "receptor": "string",
      "cancerType": "string",
      "cancerClass": "string",
      "mutation": "string",
      "experimentalCorrelationScore": number (0-1, optional),
      "correlationSummary": "string (optional)",
      "summary": "string",
      "detailedAnalysis": "string",
      "imagePrompts": {
        "molecularViz": "string",
        "pathwayMap": "string",
        "cellularResponse": "string"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                bindingEnergy: { type: Type.NUMBER },
                rmsd: { type: Type.NUMBER },
                ligandCentroid: { type: Type.STRING },
                dockingModes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            mode: { type: Type.NUMBER },
                            affinity: { type: Type.NUMBER },
                            rmsdLowerBound: { type: Type.NUMBER },
                            rmsdUpperBound: { type: Type.NUMBER }
                        }
                    }
                },
                gridBox: {
                    type: Type.OBJECT,
                    properties: {
                        center: { type: Type.OBJECT, properties: { x: {type: Type.NUMBER}, y: {type: Type.NUMBER}, z: {type: Type.NUMBER} } },
                        size: { type: Type.OBJECT, properties: { x: {type: Type.NUMBER}, y: {type: Type.NUMBER}, z: {type: Type.NUMBER} } },
                        spacing: { type: Type.NUMBER }
                    }
                },
                interactingResidues: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            xyz: { type: Type.STRING },
                            type: { type: Type.STRING }
                        }
                    }
                },
                pathwayName: { type: Type.STRING },
                genesActivated: { type: Type.ARRAY, items: { type: Type.STRING } },
                enzymesInvolved: { type: Type.ARRAY, items: { type: Type.STRING } },
                cellResponse: { type: Type.STRING },
                receptor: { type: Type.STRING },
                cancerType: { type: Type.STRING },
                cancerClass: { type: Type.STRING },
                mutation: { type: Type.STRING },
                experimentalCorrelationScore: { type: Type.NUMBER },
                correlationSummary: { type: Type.STRING },
                summary: { type: Type.STRING },
                detailedAnalysis: { type: Type.STRING },
                imagePrompts: {
                    type: Type.OBJECT,
                    properties: {
                        molecularViz: { type: Type.STRING },
                        pathwayMap: { type: Type.STRING },
                        cellularResponse: { type: Type.STRING }
                    }
                }
            }
        }
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean up potential Markdown formatting
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Analysis Failed:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const modelId = "gemini-2.5-flash-image";
  try {
    const response = await ai.models.generateContent({
        model: modelId,
        contents: { parts: [{ text: prompt }] },
        config: {
           systemInstruction: "You are a scientific illustrator using PyMOL visualization standards. Render protein structures using 'Thick Cartoon' representation (Helices as coiled ribbons, Beta sheets as arrows). Color Scheme: Teal and Blue. Ligand: Ball-and-Stick (Carbon=Grey, Oxygen=Red, Nitrogen=Blue). Background: Neutral Grey. Include text labels for key residues.",
        }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) return part.inlineData.data;
    }
    return ""; 
  } catch (error) {
    console.error("Image Generation Failed:", error);
    return ""; 
  }
};