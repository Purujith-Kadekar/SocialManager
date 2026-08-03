'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, File, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export function UploadForm() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (f: File | null) => {
    if (!f) return
    if (!f.name.endsWith('.tar.gz') && !f.name.endsWith('.tgz')) {
      toast({
        title: 'Invalid file',
        description: 'Recipe package must be a .tar.gz file',
        variant: 'destructive',
      })
      return
    }
    if (f.size > 50 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 50 MB',
        variant: 'destructive',
      })
      return
    }
    setFile(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    handleFileChange(f)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      toast({ title: 'No file', description: 'Please select a .tar.gz file', variant: 'destructive' })
      return
    }

    const formData = new FormData(e.currentTarget)
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const author = formData.get('author') as string
    const website = formData.get('website') as string
    const icon_url = formData.get('icon_url') as string
    const is_featured = formData.get('is_featured') === 'on'

    // Build metadata JSON
    const metadata = {
      id,
      name,
      description: description || undefined,
      category: category || 'other',
      author: author || undefined,
      website: website || undefined,
      icon_url: icon_url || undefined,
      is_featured,
      recipe_metadata: {
        hasDirectMessages: formData.get('hasDirectMessages') === 'on',
        hasIndirectMessages: formData.get('hasIndirectMessages') === 'on',
        hasNotificationSound: formData.get('hasNotificationSound') === 'on',
        hasCustomUrl: formData.get('hasCustomUrl') === 'on',
      },
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('file', file)
      submitData.append('metadata', JSON.stringify(metadata))

      const res = await fetch('/api/admin/recipes', {
        method: 'POST',
        body: submitData,
      })
      const data = await res.json()

      if (!res.ok) {
        toast({ title: 'Upload failed', description: data.error, variant: 'destructive' })
        return
      }

      toast({
        title: 'Recipe uploaded!',
        description: `${name} has been added to the catalog.`,
      })
      router.push('/admin/recipes')
      router.refresh()
    } catch {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File dropzone */}
      <div>
        <Label>Recipe package (.tar.gz)</Label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".tar.gz,.tgz"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">{file.name}</span>
              <span className="text-sm text-muted-foreground">
                ({(file.size / 1024).toFixed(0)} KB)
              </span>
            </div>
          ) : (
            <div>
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Drop your .tar.gz here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Max 50 MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Basic info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold">Basic information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Recipe ID *</Label>
              <Input id="id" name="id" required placeholder="whatsapp" pattern="[a-z0-9-]+" />
              <p className="text-xs text-muted-foreground">Lowercase, alphanumeric + dashes only</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display name *</Label>
              <Input id="name" name="name" required placeholder="WhatsApp" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={2} placeholder="WhatsApp messenger" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="messaging" defaultValue="other" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" placeholder="SocialManager" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" placeholder="https://whatsapp.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon_url">Icon URL</Label>
              <Input id="icon_url" name="icon_url" type="url" placeholder="https://example.com/icon.svg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe metadata */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold">Recipe features</h3>
          <p className="text-sm text-muted-foreground">
            These flags tell the SocialManager app what features this service supports.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="hasDirectMessages" name="hasDirectMessages" defaultChecked />
              <Label htmlFor="hasDirectMessages" className="font-normal cursor-pointer">
                Has direct messages (DMs)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="hasIndirectMessages" name="hasIndirectMessages" />
              <Label htmlFor="hasIndirectMessages" className="font-normal cursor-pointer">
                Has indirect messages (channels)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="hasNotificationSound" name="hasNotificationSound" />
              <Label htmlFor="hasNotificationSound" className="font-normal cursor-pointer">
                Has notification sound
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="hasCustomUrl" name="hasCustomUrl" />
              <Label htmlFor="hasCustomUrl" className="font-normal cursor-pointer">
                Supports custom URL
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="is_featured" name="is_featured" />
              <Label htmlFor="is_featured" className="font-normal cursor-pointer">
                Featured (show on /popular)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" asChild>
          <a href="/admin/recipes">Cancel</a>
        </Button>
        <Button type="submit" disabled={loading || !file} className="bg-indigo-gradient text-white border-0 hover:opacity-90">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload recipe
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
