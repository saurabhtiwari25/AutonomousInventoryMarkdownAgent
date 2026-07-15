import { useState } from 'react';
import { Upload, File, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadInventory } from '../api';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InventoryUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]); };
  const handleFileChange = (e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setSuccessMsg("");
    try {
      const res = await uploadInventory(file);
      setSuccessMsg(`Successfully uploaded ${res.saved_count} items!`);
      setTimeout(() => navigate('/inventory-list'), 1500);
    } catch (err) { console.error(err); alert('Upload failed.'); }
    finally { setUploading(false); }
  };

  return (
    <div className="flex flex-col gap-6 items-center flex-1">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Upload Inventory Data</h1>
        <p className="text-sm text-muted-foreground mt-1">Import your product catalog via CSV or JSON</p>
      </div>

      <Card className="w-full max-w-xl !p-6 shadow-sm">
        <div 
          className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all cursor-pointer group ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <div className="p-4 rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-base font-semibold">Drag & Drop File</h3>
          <p className="text-xs text-muted-foreground mt-1">CSV or JSON · Max 10MB</p>
          <input id="file-upload" type="file" accept=".csv,.json" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Format hint */}
        <div className="mt-5 p-4 bg-muted/30 rounded-lg border">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expected Format</h4>
          <pre className="text-[11px] text-muted-foreground font-mono leading-relaxed overflow-x-auto">
{`product_id,product_name,category,stock_quantity,unit_cost,current_price,monthly_sales
P001,Wireless Headphones,Electronics,150,45.50,129.99,35`}
          </pre>
        </div>

        {/* Selected file */}
        {file && (
          <div className="mt-4 p-3 bg-muted border rounded-lg flex items-center gap-3">
            <File className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{file.name}</div>
              <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
            </div>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-md !px-8 !py-3 !h-11 bg-[#eaeaea] dark:bg-[#333] text-[#111] dark:text-[#fafafa] border-[#ccc] dark:border-[#555] hover:bg-[#ddd] dark:hover:bg-[#444] text-sm font-medium"
            >
              {uploading ? 'Uploading...' : 'Process'}
            </Button>
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
          </div>
        )}
      </Card>
    </div>
  );
}
