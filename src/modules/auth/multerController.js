import { User } from "../../../DB/models/usermodel.js";
import { asyncHandler } from "../../utilities/asynchandler.js";
import cloudinary from "../../utilities/cloud.js";

/////////////file system///////////////////
/* export const profilePic = asyncHandler(async (req, res, next) => {
  const id = req.user._id;

  const user = await User.findByIdAndUpdate(id, { profilePic: req.file.path });

  return res.json({ success: true, message: "photo upladed successfully" });
});

export const coverPics = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findById(id);

  req.files.forEach((file) => {
    user.coverPic.push(file.path);
  });

  await user.save();

  return res.json({
    sucess: true,
    message: "coverpics uploaded successfully",
    file: req.files,
  });
}); */

/////////////cloudinary///////////////////

export const profilePic = asyncHandler(async (req, res, next) => {
  const id = req.user._id;

  // upload image on cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `users/$[id]/profile_pic` }
  );

  //save url in the database
  await User.findByIdAndUpdate(id, { profilePic: { secure_url, public_id } });

  return res.json({
    success: true,

    message: "photo upladed successfully",
  });
});

export const coverPics = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findById(id);

  for (let index = 0; index < req.files.length; index++) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files[index].path,
      { folder: `users/$[id]/profile_pic` }
    );

    user.coverPic.push({ secure_url, public_id });
  }
  await user.save();

  return res.json({
    sucess: true,
    message: "coverpics uploaded successfully",
    file: req.files,
  });
});

export const updateProfilePic = asyncHandler(async (req, res, next) => {
  const {id} = req.user._id;

  const user = await User.findById(id);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      public_id: user.profilePic.public_id,
    }
  );

  user.profilePic = { secure_url, public_id };
  await user.save();

  return res.json({
    success: true,
    message: "profile picture update successfully",
  });
});
