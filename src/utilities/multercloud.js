import multer, { diskStorage } from "multer";

export function uploadFilecloud() {
  const storage = diskStorage({});

  const multerUpload = multer({ storage });

  return multerUpload;
}

//multer//
//function >>>>multer({storage: return of disktorage})
