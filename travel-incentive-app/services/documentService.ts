import { getLegalDocuments as fetchLegalDocs } from '../api';

interface Document {
  title: string;
  content: string;
}

export const getLegalDocuments = async (): Promise<{ privacyPolicy: Document, termsAndConditions: Document }> => {
  return fetchLegalDocs();
};