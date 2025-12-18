export const compressImage = (
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize dengan mempertahankan aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw dengan smooth scaling untuk kualitas terbaik
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG dengan kompresi
        let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Jika masih terlalu besar (> 800KB), kompresi lebih agresif
        const sizeInKB = (compressedBase64.length * 3) / 4 / 1024;
        if (sizeInKB > 800 && quality > 0.5) {
          console.log('📉 File still large, recompressing with lower quality...');
          compressedBase64 = canvas.toDataURL('image/jpeg', quality - 0.2);
        }
        
        const finalSizeKB = (compressedBase64.length * 3) / 4 / 1024;
        const originalSizeKB = file.size / 1024;
        
        console.log('📊 Compression Summary:');
        console.log('  Original:', originalSizeKB.toFixed(2), 'KB');
        console.log('  Compressed:', finalSizeKB.toFixed(2), 'KB');
        console.log('  Saved:', ((originalSizeKB - finalSizeKB) / originalSizeKB * 100).toFixed(1), '%');
        console.log('  Dimensions:', width, 'x', height);
        
        resolve(compressedBase64);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};