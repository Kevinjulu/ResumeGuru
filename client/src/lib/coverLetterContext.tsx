import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CoverLetterData } from '@shared/schema';

// Initial default Cover Letter data
const initialCoverLetterData: CoverLetterData = {
  senderInfo: {},
  recipientInfo: {},
  date: new Date().toISOString().split('T')[0], // Current date
  subject: '',
  body: '',
  templateId: 'basic-cl',
  colorId: 'orange',
};

interface CoverLetterContextType {
  coverLetterData: CoverLetterData;
  setCoverLetterData: (data: CoverLetterData) => void;
  updateSenderInfo: (info: CoverLetterData['senderInfo']) => void;
  updateRecipientInfo: (info: CoverLetterData['recipientInfo']) => void;
  updateBody: (body: string) => void;
  updateSubject: (subject: string) => void;
  updateDate: (date: string) => void;
  setTemplate: (templateId: string) => void;
  setColor: (colorId: string) => void;
  resetCoverLetter: () => void;
}

const CoverLetterContext = createContext<CoverLetterContextType | undefined>(undefined);

export function CoverLetterProvider({ children }: { children: ReactNode }) {
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(initialCoverLetterData);

  const updateSenderInfo = useCallback((info: CoverLetterData['senderInfo']) => {
    setCoverLetterData((prev) => ({
      ...prev,
      senderInfo: { ...prev.senderInfo, ...info },
    }));
  }, []);

  const updateRecipientInfo = useCallback((info: CoverLetterData['recipientInfo']) => {
    setCoverLetterData((prev) => ({
      ...prev,
      recipientInfo: { ...prev.recipientInfo, ...info },
    }));
  }, []);

  const updateBody = useCallback((body: string) => {
    setCoverLetterData((prev) => ({ ...prev, body }));
  }, []);

  const updateSubject = useCallback((subject: string) => {
    setCoverLetterData((prev) => ({ ...prev, subject }));
  }, []);

  const updateDate = useCallback((date: string) => {
    setCoverLetterData((prev) => ({ ...prev, date }));
  }, []);

  const setTemplate = useCallback((templateId: string) => {
    setCoverLetterData((prev) => ({ ...prev, templateId }));
  }, []);

  const setColor = useCallback((colorId: string) => {
    setCoverLetterData((prev) => ({ ...prev, colorId }));
  }, []);

  const resetCoverLetter = useCallback(() => {
    setCoverLetterData(initialCoverLetterData);
  }, []);

  const value = {
    coverLetterData,
    setCoverLetterData,
    updateSenderInfo,
    updateRecipientInfo,
    updateBody,
    updateSubject,
    updateDate,
    setTemplate,
    setColor,
    resetCoverLetter,
  };

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const context = useContext(CoverLetterContext);
  if (context === undefined) {
    throw new Error('useCoverLetter must be used within a CoverLetterProvider');
  }
  return context;
}
