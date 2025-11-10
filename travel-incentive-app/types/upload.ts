import { Photo } from '../types';

export interface PhotoUpload {
  file: File;
  caption: string;
  day: number;
}

export type PhotoUploadData = Omit<Photo, 'id' | 'likes' | 'timestamp' | 'userId' | 'userName' | 'userImageUrl' | 'thumbnailUrl' | 'url'> & {
  file: File;
};