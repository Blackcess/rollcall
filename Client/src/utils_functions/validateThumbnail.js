export const validateThumbnail = (value) => {
    if(!value || value===null || value===undefined) {
        return { valid: true, message:"good" };
    }
    if(value.trim() === "") {
    return { valid: true, message: "Empty Thumbnails are allowed." };
    }
  // Reject Base64 images
  const isBase64 = /^data:image\/[a-zA-Z]+;base64,/.test(value);
  if (isBase64) return { valid: false, message: "Base64 images are not allowed." };
  if(!isBase64) return {valid:true,message:"Good"}
  // Validate URL
  // try {
  //   const url = new URL(value);
  //   const isImage = /\.(png|jpg|jpeg|webp|gif)$/i.test(url.pathname);

  //   if (!isImage) {
  //     return { valid: false, message: "Thumbnail URL must point to a valid image (png, jpg, jpeg, webp, gif)." };
  //   }

  //   return { valid: true };
  // } catch {
  //   return { valid: false, message: "Please enter a valid URL." };
  // }
};
export default validateThumbnail;

