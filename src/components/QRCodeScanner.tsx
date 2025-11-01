import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X, Camera } from "lucide-react";

interface QRCodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
  stageTitle?: string;
}

export const QRCodeScanner = ({ open, onClose, onScanSuccess, stageTitle }: QRCodeScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startScanning = async () => {
    const scannerId = "qr-scanner";
    
    try {
      setError(null);
      setIsScanning(true);

      const html5QrCode = new Html5Qrcode(scannerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Successfully scanned
          stopScanning();
          onScanSuccess(decodedText);
          onClose();
        },
        (errorMessage) => {
          // Scan error - ignore common errors while scanning
          // Only show error if it's something significant
          if (!errorMessage.includes("NotFoundException") && 
              !errorMessage.includes("No QR code found") &&
              !errorMessage.includes("QR code parse error")) {
            // Only set error for significant issues
            if (errorMessage.includes("Permission") || errorMessage.includes("camera")) {
              setError(errorMessage);
            }
          }
        }
      );
    } catch (err: unknown) {
      console.error("Error starting QR scanner:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to start camera. Please ensure camera permissions are granted.";
      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping QR scanner:", err);
      }
    }
    setIsScanning(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            {stageTitle ? `Scan the QR code for ${stageTitle}` : "Position the QR code within the frame"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <div
              id="qr-scanner"
              className="w-full rounded-lg overflow-hidden bg-black"
              style={{ minHeight: "300px" }}
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="text-center text-white">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera not active</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            {!isScanning && (
              <Button onClick={startScanning} className="flex-1">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Start Scanning
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Make sure to grant camera permissions if prompted
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

