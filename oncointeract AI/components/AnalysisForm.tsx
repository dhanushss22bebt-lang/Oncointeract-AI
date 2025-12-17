import React, { useState } from 'react';
import { CancerType, CancerClass, ReceptorOption } from '../types';
import { Upload, FileText, Activity, Dna, Database, Microscope } from 'lucide-react';

interface AnalysisFormProps {
  onSubmit: (data: {
    ligandPdb: string;
    receptor: string;
    customReceptorContent: string | null;
    cancerType: string;
    cancerClass: string;
    mutation: string;
    experimentalData: string | null;
  }) => void;
  isLoading: boolean;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [ligandFile, setLigandFile] = useState<File | null>(null);
  const [ligandContent, setLigandContent] = useState<string>("");
  
  const [cancerType, setCancerType] = useState<string>(CancerType.Lung);
  const [cancerClass, setCancerClass] = useState<string>(CancerClass.Adenocarcinoma);
  const [mutation, setMutation] = useState<string>("");
  
  const [receptorOption, setReceptorOption] = useState<string>(ReceptorOption.STAT3);
  const [customReceptorFile, setCustomReceptorFile] = useState<File | null>(null);
  const [customReceptorContent, setCustomReceptorContent] = useState<string | null>(null);

  const [experimentalFile, setExperimentalFile] = useState<File | null>(null);
  const [experimentalContent, setExperimentalContent] = useState<string | null>(null);

  const handleLigandUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLigandFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setLigandContent(event.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleReceptorUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setCustomReceptorFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) setCustomReceptorContent(event.target.result as string);
        };
        reader.readAsText(file);
    }
  };

  const handleExperimentalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExperimentalFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setExperimentalContent(event.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ligandContent) {
      alert("Please upload a Ligand PDB file.");
      return;
    }
    
    let finalReceptor = receptorOption;
    if (receptorOption === ReceptorOption.Custom) {
        if (!customReceptorFile || !customReceptorContent) {
             alert("Please upload a Custom Receptor PDB file.");
             return;
        }
        finalReceptor = `Custom Receptor: ${customReceptorFile.name}`;
    }

    onSubmit({
      ligandPdb: ligandContent,
      receptor: finalReceptor,
      customReceptorContent: receptorOption === ReceptorOption.Custom ? customReceptorContent : null,
      cancerType,
      cancerClass,
      mutation,
      experimentalData: experimentalContent
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-600" />
        Configuration
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Cancer Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cancer Type</label>
            <div className="relative">
              <select 
                value={cancerType}
                onChange={(e) => setCancerType(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-8"
              >
                {Object.values(CancerType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Cancer Class</label>
            <div className="relative">
              <select 
                value={cancerClass}
                onChange={(e) => setCancerClass(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-8"
              >
                {Object.values(CancerClass).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Mutation Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Dna className="w-4 h-4 text-purple-500" /> Oncogenic Mutation <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input 
            type="text"
            value={mutation}
            onChange={(e) => setMutation(e.target.value)}
            placeholder="e.g. KRAS G12C, BRAF V600E, TP53"
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
          />
        </div>

        {/* Receptor Selection */}
        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
             <Microscope className="w-4 h-4 text-blue-500" /> Target Receptor
           </label>
           <div className="relative">
              <select 
                value={receptorOption}
                onChange={(e) => setReceptorOption(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-8"
              >
                {Object.values(ReceptorOption).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
           </div>
           {receptorOption === ReceptorOption.Custom && (
               <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                 <label className="block text-xs font-semibold text-blue-800 mb-2">Upload Custom Receptor PDB</label>
                 <input 
                    type="file" 
                    accept=".pdb"
                    onChange={handleReceptorUpload}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 hover:file:bg-blue-50"
                 />
                 <p className="text-[10px] text-blue-600 mt-1">Upload protein structure for binding analysis.</p>
               </div>
           )}
        </div>

        {/* Experimental Data Upload */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
           <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
             <Database className="w-4 h-4 text-emerald-600" /> Experimental Data <span className="text-slate-400 font-normal">(Optional)</span>
           </label>
           <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept=".csv,.txt"
                onChange={handleExperimentalUpload}
                id="exp-upload"
                className="hidden"
              />
              <label 
                htmlFor="exp-upload" 
                className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Select File
              </label>
              <span className="text-xs text-slate-500 truncate max-w-[150px]">
                {experimentalFile ? experimentalFile.name : "CSV/TXT (IC50, Gene Exp)"}
              </span>
           </div>
           <p className="text-xs text-slate-500 mt-2">
             Upload experimental results to validate in-silico predictions.
           </p>
        </div>

        {/* Ligand Upload */}
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ligand Structure</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-white">
              <input 
                type="file" 
                id="ligand-upload" 
                accept=".pdb"
                onChange={handleLigandUpload} 
                className="hidden" 
              />
              <label htmlFor="ligand-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-700">
                  {ligandFile ? ligandFile.name : "Upload Ligand PDB"}
                </span>
                <span className="text-xs text-slate-400 mt-1">Click to select file</span>
              </label>
              {ligandFile && (
                <div className="mt-2 text-xs text-green-600 font-semibold flex items-center justify-center gap-1">
                  <FileText className="w-3 h-3" /> Ready
                </div>
              )}
            </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading || !ligandFile}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all 
            ${isLoading || !ligandFile 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
        >
          {isLoading ? "Running Simulation..." : "Run Interaction Analysis"}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;
