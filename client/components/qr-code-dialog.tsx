"use client"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface QrCodeDialogProps {
  url: string
  shortUrl: string
  isOpen: boolean
  onClose: () => void
}

export function QrCodeDialog({ url, shortUrl, isOpen, onClose }: QrCodeDialogProps) {
  const [size, setSize] = useState(200)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  const downloadQrCode = () => {
    if (!qrCodeRef.current) return

    // Get the SVG element
    const svgElement = qrCodeRef.current.querySelector("svg")
    if (!svgElement) return

    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = size
    canvas.height = size

    // Create an image from the SVG
    const img = new Image()
    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    img.onload = () => {
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0)

      // Convert canvas to data URL and trigger download
      const pngUrl = canvas.toDataURL("image/png")

      // Create download link
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `qrcode-${shortUrl.replace(/[^a-zA-Z0-9]/g, "-")}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      // Clean up
      URL.revokeObjectURL(svgUrl)
    }

    img.src = svgUrl
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code for Shortened URL</DialogTitle>
          <DialogDescription>Scan this QR code to access the shortened URL: {shortUrl}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div ref={qrCodeRef} className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              value={url}
              size={size}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="qr-size">QR Code Size</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="qr-size"
                type="range"
                min="100"
                max="400"
                step="10"
                value={size}
                onChange={(e) => setSize(Number.parseInt(e.target.value))}
              />
              <span className="w-12 text-center">{size}px</span>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto" onClick={downloadQrCode}>
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
