"use client"

import type React from "react"

import { useState } from "react"
import { Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { shortenUrl } from "@/lib/api"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ShortenUrlDialogProps {
  onSuccess?: (newUrl: any) => void
}

export function ShortenUrlDialog({ onSuccess }: ShortenUrlDialogProps) {
  const { toast } = useToast()
  const [longUrl, setLongUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!longUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    // Simple URL validation
    try {
      // Check if URL is valid by creating a URL object
      new URL(longUrl)
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await shortenUrl(longUrl)

      toast({
        title: "Success",
        description: "URL has been shortened successfully",
      })

      // Call the onSuccess callback with the new URL data
      if (onSuccess && response.data) {
        onSuccess(response.data)
      }

      // Close the dialog and reset the form
      setIsOpen(false)
      setLongUrl("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Link2 className="h-4 w-4" />
          Shorten URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shorten a URL</DialogTitle>
          <DialogDescription>Enter a long URL to create a shortened version.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/path"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Shortening..." : "Shorten URL"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
