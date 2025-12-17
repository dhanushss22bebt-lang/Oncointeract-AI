import React from 'react';
import { AnalysisResult, GeneratedImages } from '../types';
import { Download, Microscope, Zap, Database, FileJson, CheckCircle, AlignLeft, RotateCcw, Box, Crosshair, Table } from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
  images: GeneratedImages;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, images, onReset }) => {
  
  const downloadImage = (base64Data: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadReport = () => {
    const reportData = JSON.stringify(result, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `oncointeract_docking_report.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const ImageCard = ({ title, data, filename }: { title: string, data?: string, filename: string }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
      <div className="h-48 bg-slate-100 flex items-center justify-center relative group">
        {data ? (
          <>
            <img src={`data:image/png;base64,${data}`} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => downloadImage(data, filename)}
                className="bg-white/20 backdrop-blur-sm border border-white/50 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/30 transition-colors"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </>
        ) : (
           <span className="text-slate-400 italic text-sm">Generating visualization...</span>
        )}
      </div>
      <div className="p-3 border-t border-slate-100">
        <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Summary & Actions */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-l-8 border-blue-600 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Microscope className="w-8 h-8 text-blue-600" />
                Docking Simulation Summary
            </h2>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button 
                    onClick={onReset}
                    className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-300 shadow-sm flex-1 sm:flex-none"
                >
                    <RotateCcw className="w-4 h-4" /> New Analysis
                </button>
                <button 
                    onClick={downloadReport}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-300 flex-1 sm:flex-none"
                >
                    <FileJson className="w-4 h-4" /> Export Data
                </button>
            </div>
        </div>
        <p className="text-slate-700 leading-relaxed text-lg mb-4">
          {result.summary}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
             <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-medium">
               Type: {result.cancerType}
             </span>
             <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 font-medium">
               Class: {result.cancerClass}
             </span>
             {result.mutation && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100 font-medium">
                  Mutation: {result.mutation}
                </span>
             )}
        </div>
      </div>

      {/* Docking Results Section (AutoDock Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Score Table */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Table className="w-5 h-5 text-blue-600" /> AutoDock Vina Results
               </h3>
               <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-1 rounded">
                 cpu_model: gemini-sim
               </span>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Mode</th>
                    <th className="px-6 py-3 text-right">Affinity (kcal/mol)</th>
                    <th className="px-6 py-3 text-right">RMSD l.b.</th>
                    <th className="px-6 py-3 text-right">RMSD u.b.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.dockingModes && result.dockingModes.map((mode) => (
                    <tr key={mode.mode} className={mode.mode === 1 ? "bg-blue-50/50 font-semibold" : "hover:bg-slate-50"}>
                      <td className="px-6 py-3">{mode.mode}</td>
                      <td className="px-6 py-3 text-right text-blue-700">{mode.affinity.toFixed(1)}</td>
                      <td className="px-6 py-3 text-right text-slate-600">{mode.rmsdLowerBound.toFixed(3)}</td>
                      <td className="px-6 py-3 text-right text-slate-600">{mode.rmsdUpperBound.toFixed(3)}</td>
                    </tr>
                  ))}
                  {!result.dockingModes && (
                    <tr><td colSpan={4} className="p-4 text-center text-slate-400">No docking modes generated.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>

        {/* Right: Grid Box Config */}
        <div className="lg:col-span-4 bg-slate-900 text-slate-300 rounded-xl shadow-lg border border-slate-800 p-6 font-mono text-xs">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
             <Box className="w-4 h-4 text-emerald-400" /> Grid Configuration
           </h3>
           
           <div className="space-y-4">
             <div>
               <div className="text-slate-500 mb-1">Grid Center (Angstroms)</div>
               <div className="flex justify-between border-b border-slate-700 pb-1">
                 <span>center_x</span> <span className="text-emerald-400">{result.gridBox?.center.x.toFixed(3)}</span>
               </div>
               <div className="flex justify-between border-b border-slate-700 pb-1 mt-1">
                 <span>center_y</span> <span className="text-emerald-400">{result.gridBox?.center.y.toFixed(3)}</span>
               </div>
               <div className="flex justify-between border-b border-slate-700 pb-1 mt-1">
                 <span>center_z</span> <span className="text-emerald-400">{result.gridBox?.center.z.toFixed(3)}</span>
               </div>
             </div>

             <div>
               <div className="text-slate-500 mb-1">Search Space Size</div>
               <div className="flex justify-between border-b border-slate-700 pb-1">
                 <span>size_x</span> <span className="text-amber-400">{result.gridBox?.size.x.toFixed(1)}</span>
               </div>
               <div className="flex justify-between border-b border-slate-700 pb-1 mt-1">
                 <span>size_y</span> <span className="text-amber-400">{result.gridBox?.size.y.toFixed(1)}</span>
               </div>
               <div className="flex justify-between border-b border-slate-700 pb-1 mt-1">
                 <span>size_z</span> <span className="text-amber-400">{result.gridBox?.size.z.toFixed(1)}</span>
               </div>
             </div>
             
             <div className="pt-2 text-slate-500">
               spacing = {result.gridBox?.spacing} Å
               <br/>
               exhaustiveness = 8
             </div>
           </div>
        </div>

      </div>

      {/* Experimental Validation Section (Conditional) */}
      {result.experimentalCorrelationScore !== undefined && (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
             <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Experimental Validation Analysis
             </h3>
             <div className="flex items-center gap-6 mb-3">
                 <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center min-w-[120px]">
                    <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Correlation</div>
                    <div className="text-3xl font-bold text-emerald-700">{(result.experimentalCorrelationScore * 100).toFixed(1)}%</div>
                 </div>
                 <p className="text-emerald-900 text-sm leading-relaxed flex-1">
                    {result.correlationSummary}
                 </p>
             </div>
          </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Molecular Details */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-500" /> Molecular Interactions
            </h3>
            
            <div className="space-y-4">
                <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3">Active Site Residues</h4>
                    <div className="flex flex-col gap-2">
                        {result.interactingResidues.map((res, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 text-sm">
                                <span className="font-bold text-indigo-700 font-mono">{res.name}</span>
                                <div className="h-px bg-slate-200 flex-1 mx-3"></div>
                                <span className="text-slate-600 font-medium text-xs bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                                    {res.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Biological Pathway */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Predicted Pathway Modulation
            </h3>
            
            <div className="space-y-4">
                 <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Signal Transduction</span>
                    <p className="text-slate-800 font-medium mt-1">{result.pathwayName}</p>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Targeted Genes</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.genesActivated.map((gene, i) => (
                            <span key={i} className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold border border-amber-100">
                                {gene}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Key Proteins/Enzymes</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.enzymesInvolved.map((enz, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">
                                {enz}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

       {/* Results and Discussion Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlignLeft className="w-6 h-6 text-slate-700" /> Discussion & Therapeutic Implications
        </h3>
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
            {result.detailedAnalysis}
        </div>
      </div>

      {/* Visualizations */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Structural & Biological Visualizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageCard title="Docked Complex (Surface/Sticks)" data={images.molecularViz} filename="docking_complex.png" />
            <ImageCard title="Pathway Diagram" data={images.pathwayMap} filename="pathway_map.png" />
            <ImageCard title="Cellular Phenotype" data={images.cellularResponse} filename="cellular_response.png" />
        </div>
      </div>

    </div>
  );
};

export default ResultsDisplay;