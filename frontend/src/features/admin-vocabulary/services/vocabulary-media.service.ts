export interface MediaUploadResult {
  url: string;
  fileName: string;
}

export const vocabularyMediaService = {
  uploadImage: async (file: File): Promise<MediaUploadResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: "https://images.unsplash.com/photo-example-uploaded?w=400",
          fileName: file.name,
        });
      }, 500);
    });
  },

  uploadAudio: async (file: File): Promise<MediaUploadResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: "/audio/mock-uploaded-audio.mp3",
          fileName: file.name,
        });
      }, 500);
    });
  },
};
