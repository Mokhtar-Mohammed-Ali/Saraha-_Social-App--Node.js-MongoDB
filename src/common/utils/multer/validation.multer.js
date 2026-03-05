
export const fileFieldValidation={
    image:["image/jpeg","image/png","image/gif"],
    video:["video/mp4","video/mpeg","video/quicktime"],
    audio:["audio/mpeg","audio/wav","audio/ogg"],
}
export const FileValidation = (validation = []) => {
  return function (req, file, cb) {
    {
      if (!validation.includes(file.mimetype)) {
        return cb(
          new Error(
            `Invalid file type, only ${validation.join(", ")} are allowed`,
            { cause: { status: 404 } },
          ),
          false,
        );
      }
      cb(null, true);
    }
  };
};
