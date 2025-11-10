import { Photo } from '../types';
import * as api from '../api';

export const uploadPhotos = async (files: File[], captions: string[], day: number) => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append('photos', file);
    formData.append('captions', captions[index] || '');
  });
  formData.append('day', day.toString());

  return api.uploadPhotos(formData);
};

export const likePhoto = async (photoId: number) => {
  return api.likePhoto(photoId);
};

export const deletePhoto = async (photoId: number) => {
  return api.deletePhoto(photoId);
};

export const getPhotos = async () => {
  return api.getPhotos();
};