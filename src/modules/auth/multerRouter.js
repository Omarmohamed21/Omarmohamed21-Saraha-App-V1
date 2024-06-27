import { Router } from "express";
import { fileValidations, uploadFile } from "../../utilities/multer.js";
import * as multerController from "./multerController.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { uploadFilecloud } from "../../utilities/multercloud.js";

const router = Router();

/////////////file system///////////////////
/* router.post(
  "/profile_pic",
  isAuthenticated,
  uploadFile({
    folder: "users/profilepics",
    filter: fileValidations.images,
  }).single("pp"),
  multerController.profilePic
);

router.post(
  "/cover_pic",
  isAuthenticated,
  uploadFile({
    folder: "users/coverPics",
    filter: fileValidations.images,
  }).array("coverPics", 3),
  multerController.coverPics
); */

//////////////////////cloudinary////////////////////////
router.post(
  "/profile_pic",
  isAuthenticated,
  uploadFilecloud().single("pp"),
  multerController.profilePic
);

router.post(
  "/cover_pic",
  isAuthenticated,
  uploadFilecloud().array("coverPics", 3),
  multerController.coverPics
); 


router.patch(
  "/profile_pic",
  isAuthenticated,
  uploadFilecloud().single("pp"),
  multerController.updateProfilePic
);


export default router;
