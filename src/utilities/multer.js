import multer, { diskStorage } from "multer";

import { nanoid } from "nanoid";

export const fileValidations = {
  images: ["image/png", "imagejpeg"],
  files: ["application/pdf"],
};
//diskstorage//
//function>>>>> const x = diskStorage({destination: , filename: })
//{destination: string | function , filename: function}
export function uploadFile({ folder, filter }) {
  const storage = diskStorage({
    destination: `uploads/${folder}`,
    filename: (req, file, cb) => {
      cb(null, nanoid() + "__" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!filter.includes(file.mimetype)) {
      return cb(new Error("invalid file it must be png"), false);
    }
    return cb(null, true);
  };

  const multerUpload = multer({ storage, fileFilter });

  return multerUpload;
}

//multer//
//function >>>>multer({storage: return of disktorage})
