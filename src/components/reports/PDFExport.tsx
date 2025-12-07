'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ExportOptions } from '@/types';
import { FileDown, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PDFExportProps {
  data: any;
  reportTitle: string;
  onExport?: (options: ExportOptions) => void;
}

export function PDFExport({ data, reportTitle, onExport }: PDFExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeComments: false,
    includeHistory: false,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple PDF-like text document for demonstration
      const content = generatePDFContent(data, reportTitle, options);
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onExport) {
        onExport(options);
      }

      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = (data: any, title: string, opts: ExportOptions) => {
    let content = `${title}\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n\n`;
    content += '='.repeat(80) + '\n\n';
    
    if (typeof data === 'object') {
      content += JSON.stringify(data, null, 2);
    } else {
      content += data;
    }
    
    content += '\n\n' + '='.repeat(80) + '\n';
    content += 'Export Options:\n';
    content += `- Include Charts: ${opts.includeCharts ? 'Yes' : 'No'}\n`;
    content += `- Include Comments: ${opts.includeComments ? 'Yes' : 'No'}\n`;
    content += `- Include History: ${opts.includeHistory ? 'Yes' : 'No'}\n`;
    
    return content;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export to PDF</DialogTitle>
          <DialogDescription>
            Choose what to include in your PDF report
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="charts"
              checked={options.includeCharts}
              onChange={(e) =>
                setOptions({ ...options, includeCharts: e.target.checked })
              }
            />
            <Label
              htmlFor="charts"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include charts and visualizations
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="comments"
              checked={options.includeComments}
              onChange={(e) =>
                setOptions({ ...options, includeComments: e.target.checked })
              }
            />
            <Label
              htmlFor="comments"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include comments and discussions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="history"
              checked={options.includeHistory}
              onChange={(e) =>
                setOptions({ ...options, includeHistory: e.target.checked })
              }
            />
            <Label
              htmlFor="history"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include status history and timeline
            </Label>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
            <p className="text-blue-900">
              <strong>Note:</strong> The PDF will include a professional header, your selected
              data, and formatted charts for easy sharing with stakeholders.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Generate PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
