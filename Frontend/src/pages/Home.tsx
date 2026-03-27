import { useState } from "react";
import { 
  AlertCircle, 
  Code2, 
  CheckCircle2, 
  Lightbulb, 
  Search, 
  Loader2, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";

type Result = {
  explanation: string;
  rootCause: string;
  fixes: string[];
  confidence: number;
};

export default function Home() {
  const [errorMsg, setErrorMsg] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleAnalyze = async () => {
    if (!errorMsg || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: errorMsg,
          code,
        }),
      });

      if (!res.ok) throw new Error("API request failed");
      
      const data = await res.json();
      // Added a slight delay for better UX transition
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 500);
    } catch {
      alert("Something went wrong. Please check if the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI-Powered Debugging
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-4 tracking-tight">
            ErrorLens
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Paste your error message and code snippet to get instant explanations and fixes.
          </p>
        </header>

        {/* Interaction Bench */}
        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Error Input */}
            <div className="space-y-3 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2 group-focus-within:text-blue-400 transition-colors">
                  <AlertCircle className="w-4 h-4" />
                  Error Message
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {errorMsg.length} chars
                </span>
              </div>
              <div className="relative">
                <textarea
                  placeholder="e.g. TypeError: Cannot read property 'map' of undefined"
                  className="w-full h-48 bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none placeholder:text-slate-600"
                  value={errorMsg}
                  onChange={(e) => setErrorMsg(e.target.value)}
                />
              </div>
            </div>

            {/* Code Input */}
            <div className="space-y-3 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2 group-focus-within:text-blue-400 transition-colors">
                  <Code2 className="w-4 h-4" />
                  Code Snippet (Optional)
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {code.length} chars
                </span>
              </div>
              <div className="relative">
                <textarea
                  placeholder="Paste the relevant code here..."
                  className="w-full h-48 bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none placeholder:text-slate-600"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={!errorMsg || loading}
              className={`
                group relative flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-300
                ${!errorMsg || loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Analyze Error</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-16 space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-slate-800"></div>
              <h2 className="text-slate-400 text-sm font-medium uppercase tracking-widest">Analysis Result</h2>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            <div className="grid gap-6">
              {/* Explanation */}
              <div className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-1">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                      Explanation
                    </h3>
                    <p className="text-slate-300 leading-relaxed italic">
                      {result.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Root Cause */}
              <div className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400 mt-1">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                      Root Cause
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {result.rootCause}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fixes */}
              <div className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-400 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                      Recommended Fixes
                    </h3>
                    <ul className="space-y-3 mt-4">
                      {result.fixes.map((fix, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-300 group/item">
                          <ChevronRight className="w-4 h-4 mt-1 text-green-500/50 group-hover/item:text-green-400 transition-colors" />
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Confidence */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-slate-300 font-semibold flex items-center gap-2">
                    AI Confidence Score
                  </h3>
                  <span className={`text-lg font-bold ${result.confidence > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {result.confidence}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${result.confidence > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
                <p className="text-slate-500 text-xs mt-3 text-center italic">
                  Analysis based on common error patterns and the provided code context.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-24 text-center border-t border-slate-900 pt-8 pb-4 opacity-50">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ErrorLens. Built for developers.
          </p>
        </footer>
      </div>
    </div>
  );
}