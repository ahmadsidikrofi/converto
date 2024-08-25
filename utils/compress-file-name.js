export default function CompressFileName(fileName) {
    const maxSubstrLength = 18;

    // Check if the fileName is longer than the maximum length
    if (fileName.length > maxSubstrLength) {
      const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
  
      // Extract the extension from the fileName
      const fileExtension = fileName.split('.').pop();
  
      // Calculate the length of characters to keep in the middle
      const charsToKeep =
        maxSubstrLength - (fileNameWithoutExtension.length + fileExtension.length + 3);
  
      const compressedFileName =
        fileNameWithoutExtension.substring(
          0,
          maxSubstrLength - fileExtension.length - 3,
        ) +
        '...' +
        fileNameWithoutExtension.slice(-charsToKeep) +
        '.' +
        fileExtension;
  
      return compressedFileName
    } else {
        return fileName.trim();
    }
}