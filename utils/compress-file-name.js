export default function CompressFileName(file_name) {
    const maxSubstrLength = 18;

    // Check if the file_name is longer than the maximum length
    if (file_name.length > maxSubstrLength) {
      const fileNameWithoutExtension = file_name.split('.').slice(0, -1).join('.');
  
      // Extract the extension from the file_name
      const fileExtension = file_name.split('.').pop();
  
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
        return file_name.trim();
    }
}