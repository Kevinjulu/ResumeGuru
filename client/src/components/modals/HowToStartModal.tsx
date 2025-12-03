import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface HowToStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: string | null;
  selectedColorId: string | null;
  documentType: "resume" | "cv";
}

export function HowToStartModal({ isOpen, onClose, selectedTemplateId, selectedColorId, documentType }: HowToStartModalProps) {
  const [liveUsers, setLiveUsers] = useState(Math.floor(Math.random() * 200) + 800);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setLiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1); // Simulate fluctuating users
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const builderHref = `/builder?${documentType === "cv" ? "cvTemplate" : "template"}=${selectedTemplateId}&color=${selectedColorId}`;
  const uploadHref = `/builder?${documentType === "cv" ? "cvTemplate" : "template"}=${selectedTemplateId}&color=${selectedColorId}&upload=true`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-gray-900">How would you like to start?</DialogTitle>
          <DialogDescription className="text-md text-gray-600 mt-2">
            Choose an option to begin building your professional {documentType}.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6"
        >
          <motion.div variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}>
            <Link href={uploadHref} onClick={onClose}>
              <Card className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full">
                <Upload className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Existing</h3>
                <p className="text-sm text-gray-600">Import your current {documentType} and let our AI enhance it.</p>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}>
            <Link href={builderHref} onClick={onClose}>
              <Card className="flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full">
                <FileText className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Build New</h3>
                <p className="text-sm text-gray-600">Start from scratch with your chosen template.</p>
              </Card>
            </Link>
          </motion.div>
        </motion.div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Trustpilot</span>
            <span className="text-sm text-gray-500">4.5/5 rating</span>
          </div>
          <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>{liveUsers}+ people building {documentType}s right now!</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
