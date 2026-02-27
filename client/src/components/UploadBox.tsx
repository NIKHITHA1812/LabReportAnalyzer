import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useUploadReport } from "@/hooks/use-reports";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export function UploadBox() {
  const [, setLocation] = useLocation();
  const uploadMutation = useUploadReport();
  const [uploadProgress, setUploadProgress] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploadProgress(true);
      const formData = new FormData();
      formData.append("report", file);

      uploadMutation.mutate(formData, {
        onSuccess: (data) => {
          // Small artificial delay to show success state before redirecting
          setTimeout(() => {
            setLocation(`/report/${data.id}`);
          }, 800);
        },
        onError: () => {
          setUploadProgress(false);
        }
      });
    },
    [uploadMutation, setLocation]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    disabled: uploadMutation.isPending || uploadProgress,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden group cursor-pointer
          border-3 border-dashed rounded-3xl p-12 transition-all duration-300 ease-out
          flex flex-col items-center justify-center text-center min-h-[320px]
          ${isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-white hover:border-primary/50 hover:bg-primary/5"}
          ${isDragReject ? "border-destructive bg-destructive/5" : ""}
          ${(uploadMutation.isPending || uploadProgress) ? "pointer-events-none opacity-90" : ""}
          shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/10
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {(uploadMutation.isPending || uploadProgress) ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6"
            >
              {uploadMutation.isSuccess ? (
                <div className="bg-secondary/10 p-6 rounded-full">
                  <CheckCircle2 className="w-12 h-12 text-secondary" />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="bg-primary/10 p-6 rounded-full relative z-10">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {uploadMutation.isSuccess ? "Analysis Complete!" : "Analyzing your report..."}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {uploadMutation.isSuccess 
                    ? "Redirecting to your dashboard..." 
                    : "Extracting biomarkers and generating insights using medical AI."}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6"
            >
              <div className={`p-6 rounded-full transition-colors duration-300 ${isDragActive ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary/20"}`}>
                <UploadCloud className="w-12 h-12" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {isDragActive ? "Drop your report here" : "Upload your lab report"}
                </h3>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                  Drag and drop your PDF or image here, or <span className="text-primary font-semibold underline underline-offset-4 cursor-pointer">browse files</span>
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-6 border-t border-border w-full justify-center text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> PDF</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">JPG / PNG</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {uploadMutation.isError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            {uploadMutation.error.message}
          </motion.div>
        )}
      </div>
    </div>
  );
}
