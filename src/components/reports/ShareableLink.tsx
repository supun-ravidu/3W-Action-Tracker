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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ShareableReport } from '@/types';
import { Share2, Copy, Check, Calendar, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ShareableLinkProps {
  reportData: any;
  reportType: 'performance' | 'trends' | 'project-health' | 'bottlenecks';
  reportTitle: string;
  onShare?: (report: ShareableReport) => void;
}

export function ShareableLink({ reportData, reportType, reportTitle, onShare }: ShareableLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shareableLink, setShareableLink] = useState<string>('');
  const [permissions, setPermissions] = useState({
    canComment: false,
    canDownload: true,
  });
  const [expiresInDays, setExpiresInDays] = useState<number>(30);

  const generateLink = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to generate shareable link
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock shareable report
      const accessToken = generateRandomToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const shareableReport: ShareableReport = {
        id: `report_${Date.now()}`,
        reportType,
        title: reportTitle,
        createdBy: {
          id: 'current-user',
          name: 'Current User',
          email: 'user@example.com',
        },
        createdAt: new Date(),
        expiresAt,
        accessToken,
        permissions,
        data: reportData,
      };

      const link = `${window.location.origin}/shared/reports/${shareableReport.id}?token=${accessToken}`;
      setShareableLink(link);

      if (onShare) {
        onShare(shareableReport);
      }
    } catch (error) {
      console.error('Failed to generate link:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRandomToken = () => {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
          <DialogDescription>
            Generate a read-only link to share this report with stakeholders
          </DialogDescription>
        </DialogHeader>
        
        {!shareableLink ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expires">Link expires in (days)</Label>
              <Input
                id="expires"
                type="number"
                min="1"
                max="365"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 30)}
              />
              <p className="text-xs text-muted-foreground">
                Link will expire on {new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canDownload"
                  checked={permissions.canDownload}
                  onChange={(e) =>
                    setPermissions({ ...permissions, canDownload: e.target.checked })
                  }
                />
                <Label
                  htmlFor="canDownload"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Allow viewers to download report
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canComment"
                  checked={permissions.canComment}
                  onChange={(e) =>
                    setPermissions({ ...permissions, canComment: e.target.checked })
                  }
                />
                <Label
                  htmlFor="canComment"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Allow viewers to add comments
                </Label>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm">
              <p className="text-blue-900">
                <strong>Shareable link features:</strong>
              </p>
              <ul className="list-disc ml-5 mt-2 text-blue-800 space-y-1">
                <li>Read-only access to report data</li>
                <li>No login required for viewers</li>
                <li>Automatic expiration for security</li>
                <li>Track who accessed the report</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Shareable Link</Label>
              <div className="flex gap-2">
                <Input
                  value={shareableLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isCopied && (
                <p className="text-xs text-green-600">Link copied to clipboard!</p>
              )}
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Expires on</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Share2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Permissions</div>
                  <div className="text-sm text-muted-foreground">
                    {permissions.canDownload && 'Can download'}
                    {permissions.canDownload && permissions.canComment && ' • '}
                    {permissions.canComment && 'Can comment'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-900">
              <strong>Link generated successfully!</strong> Share this link with stakeholders who need
              access to this report.
            </div>
          </div>
        )}

        <DialogFooter>
          {!shareableLink ? (
            <>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isGenerating}>
                Cancel
              </Button>
              <Button onClick={generateLink} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Generate Link
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsOpen(false)}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
