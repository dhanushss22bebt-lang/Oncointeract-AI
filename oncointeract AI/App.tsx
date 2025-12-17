import React, { useState } from 'react';
import AnalysisForm from './components/AnalysisForm';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';
import { analyzeInteraction, generateImage } from './services/geminiService';
import { AnalysisResult, GeneratedImages } from './types';
import { Dna } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [images, setImages] = useState<GeneratedImages>({});
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (data: { 
    ligandPdb: string, 
    receptor: string, 
    customReceptorContent: string | null;
    cancerType: string, 
    cancerClass: string,
    mutation: string,
    experimentalData: string | null
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setImages({});

    try {
      // 1. Text Analysis
      setLoadingMessage("Analyzing Molecular Interactions & Correlating Data...");
      const analysisResult = await analyzeInteraction(
        data.ligandPdb, 
        data.receptor,
        data.customReceptorContent,
        data.cancerType, 
        data.cancerClass,
        data.mutation,
        data.experimentalData
      );
      setResult(analysisResult);

      // 2. Generate Images in Parallel
      setLoadingMessage("Generating Biomedical Visualizations...");
      
      const promptTasks = [
        generateImage(analysisResult.imagePrompts.molecularViz).then(img => ({ type: 'molecularViz', img })),
        generateImage(analysisResult.imagePrompts.pathwayMap).then(img => ({ type: 'pathwayMap', img })),
        generateImage(analysisResult.imagePrompts.cellularResponse).then(img => ({ type: 'cellularResponse', img }))
      ];

      // Update images as they arrive to keep UI responsive-ish
      for (const task of promptTasks) {
         task.then(({ type, img }) => {
             setImages(prev => ({ ...prev, [type]: img }));
         });
      }

      await Promise.all(promptTasks);

    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please check your inputs and try again. Ensure the API Key is valid.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleReset = () => {
    setResult(null);
    setImages({});
    setError(null);
    setLoadingMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
               <Dna className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              OncoInteract AI
            </h1>
          </div>
          <div className="text-sm text-slate-500 font-medium hidden sm:block">
            Oncology Ligand-Receptor Analysis System
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Introduction - Only shown when no result */}
        {!result && !loading && (
             <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Advanced Interaction Analysis</h2>
                <p className="text-slate-600">
                  Upload a ligand structure, specify clinical parameters, and validate with experimental data 
                  to predict binding affinity, molecular pathways, and cellular outcomes.
                </p>
             </div>
        )}

        {/* View Switcher: Form vs Results */}
        {!result ? (
           // Form View (Centered)
           <div className="max-w-3xl mx-auto animate-fade-in-up">
              <AnalysisForm onSubmit={handleAnalysis} isLoading={loading} />
              
              {loading && (
                 <div className="mt-8 bg-white rounded-xl shadow p-6 border border-slate-100">
                   <Spinner message={loadingMessage} />
                 </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <strong>Error:</strong> {error}
                </div>
              )}
           </div>
        ) : (
           // Results View (Full Width / Fresh Page)
           <div className="w-full animate-fade-in">
              <ResultsDisplay result={result} images={images} onReset={handleReset} />
           </div>
        )}

      </main>
    </div>
  );
};

export default App;