'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

export function DeleteRecipeButton({
  recipeId,
  recipeName,
}: {
  recipeId: string
  recipeName: string
}) {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/recipes?id=${recipeId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Delete failed', description: data.error, variant: 'destructive' })
        return
      }
      toast({ title: 'Recipe deleted', description: `${recipeName} has been removed.` })
      router.refresh()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete recipe', variant: 'destructive' })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{recipeName}</strong> ({recipeId}) and its
            .tar.gz package from Supabase Storage. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
