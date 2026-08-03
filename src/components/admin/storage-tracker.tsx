'use client'

import { HardDrive, AlertTriangle, CheckCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

type StorageTrackerProps = {
  totalBytes: number
  limitBytes: number
  percentUsed: number
  fileCount: number
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function StorageTracker({ totalBytes, limitBytes, percentUsed, fileCount }: StorageTrackerProps) {
  const isWarning = percentUsed > 70
  const isCritical = percentUsed > 90
  const available = limitBytes - totalBytes

  return (
    <div className="space-y-4">
      {/* Main progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            {formatBytes(totalBytes)} of {formatBytes(limitBytes)} used
          </span>
          <span className={`font-mono ${isCritical ? 'text-destructive' : isWarning ? 'text-yellow-500' : 'text-muted-foreground'}`}>
            {percentUsed.toFixed(2)}%
          </span>
        </div>
        <Progress
          value={percentUsed}
          className={`h-3 ${isCritical ? '[&>div]:bg-destructive' : isWarning ? '[&>div]:bg-yellow-500' : '[&>div]:bg-indigo-gradient'}`}
        />
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 text-sm">
        {isCritical ? (
          <>
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-destructive font-medium">Critical: Storage almost full!</span>
            <span className="text-muted-foreground">Only {formatBytes(available)} remaining.</span>
          </>
        ) : isWarning ? (
          <>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-600 dark:text-yellow-500 font-medium">Warning: Storage filling up.</span>
            <span className="text-muted-foreground">{formatBytes(available)} remaining.</span>
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-600 dark:text-green-500 font-medium">Healthy.</span>
            <span className="text-muted-foreground">{formatBytes(available)} available for new recipes.</span>
          </>
        )}
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/40">
        <div>
          <div className="text-xs text-muted-foreground">Used</div>
          <div className="text-sm font-mono font-medium">{formatBytes(totalBytes)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Available</div>
          <div className="text-sm font-mono font-medium">{formatBytes(available)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Files</div>
          <div className="text-sm font-mono font-medium">{fileCount}</div>
        </div>
      </div>

      {/* Helpful note */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3">
        <strong>Note:</strong> The 5GB limit is Supabase's free tier storage quota.
        Recipe packages (.tar.gz) are typically 5-50 KB each, so 5GB can hold ~100,000+ recipes.
        If you exceed the limit, upgrade to Supabase Pro ($25/month for 100GB) or clean up unused recipes.
      </div>
    </div>
  )
}
