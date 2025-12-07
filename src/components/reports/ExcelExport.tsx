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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExportOptions, ActionPlan } from '@/types';
import { FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ExcelExportProps {
  actionPlans: ActionPlan[];
  additionalData?: any;
  onExport?: (options: ExportOptions) => void;
}

export function ExcelExport({ actionPlans, additionalData, onExport }: ExcelExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'excel',
    includeCharts: false,
    includeComments: true,
    includeHistory: true,
  });
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'csv'>('excel');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate CSV/Excel data
      const content = generateSpreadsheetContent(actionPlans, additionalData, options);
      const fileExtension = selectedFormat === 'excel' ? '.xlsx' : '.csv';
      const mimeType = selectedFormat === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv';
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `action_plans_export_${new Date().toISOString().split('T')[0]}${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onExport) {
        onExport({ ...options, format: selectedFormat });
      }

      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateSpreadsheetContent = (plans: ActionPlan[], additional: any, opts: ExportOptions) => {
    // CSV format for simplicity
    let csv = 'ID,Title,Status,Priority,Assignee,Due Date,Created Date,Completed Date,Time Estimate (hrs),Tags\n';
    
    plans.forEach(plan => {
      const row = [
        plan.id,
        `"${plan.title.replace(/"/g, '""')}"`,
        plan.status,
        plan.priority,
        plan.who.primaryAssignee.name,
        plan.when.dueDate.toISOString().split('T')[0],
        plan.createdAt.toISOString().split('T')[0],
        plan.completedAt ? plan.completedAt.toISOString().split('T')[0] : '',
        plan.when.timeEstimate,
        `"${plan.tags.join(', ')}"`,
      ];
      csv += row.join(',') + '\n';
    });

    if (opts.includeComments && plans.some(p => p.comments && p.comments.length > 0)) {
      csv += '\n\nComments\n';
      csv += 'Action Plan ID,Author,Content,Created Date\n';
      plans.forEach(plan => {
        if (plan.comments) {
          plan.comments.forEach(comment => {
            csv += `${plan.id},"${comment.author.name}","${comment.content.replace(/"/g, '""')}",${comment.createdAt.toISOString()}\n`;
          });
        }
      });
    }

    if (opts.includeHistory) {
      csv += '\n\nStatus History\n';
      csv += 'Action Plan ID,From Status,To Status,Changed Date,Changed By\n';
      plans.forEach(plan => {
        if (plan.statusHistory) {
          plan.statusHistory.forEach(change => {
            csv += `${plan.id},${change.from},${change.to},${change.changedAt.toISOString()},${change.changedBy}\n`;
          });
        }
      });
    }

    return csv;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export to Spreadsheet</DialogTitle>
          <DialogDescription>
            Export raw data for detailed analysis
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="format">File Format</Label>
            <Select
              value={selectedFormat}
              onValueChange={(value) => setSelectedFormat(value as 'excel' | 'csv')}
            >
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="excel-comments"
              checked={options.includeComments}
              onChange={(e) =>
                setOptions({ ...options, includeComments: e.target.checked })
              }
            />
            <Label
              htmlFor="excel-comments"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include comments in separate sheet
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="excel-history"
              checked={options.includeHistory}
              onChange={(e) =>
                setOptions({ ...options, includeHistory: e.target.checked })
              }
            />
            <Label
              htmlFor="excel-history"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include status history timeline
            </Label>
          </div>

          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm">
            <p className="text-green-900">
              <strong>Excel/CSV Export includes:</strong>
            </p>
            <ul className="list-disc ml-5 mt-2 text-green-800 space-y-1">
              <li>All action plan details</li>
              <li>Assignees and team members</li>
              <li>Dates, priorities, and tags</li>
              <li>Time estimates and actual times</li>
            </ul>
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
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export {selectedFormat === 'excel' ? 'Excel' : 'CSV'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
