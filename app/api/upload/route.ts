import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOOUDINARY__KEY,
//   api_secret: process.env.CLOOUDINARY__SECRET,
// });
cloudinary.config({
  cloud_name: "dh7h1ioum",
  api_key: "552145984313541",
  api_secret: "mB50wXfeDJzZsxJwJiMn236zspk",
});

export async function POST(request: Request) {
  const { path } = await request.json();

  if (!path) {
    return NextResponse.json(
      { message: "Image path is required" },
      { status: 400 }
    );
  }

  try {
    const options = {
      use_filename: false,
      unique_filename: false,
      overwrite: true,
      transformation: [{ with: 1000, height: 752, crop: "scale" }],
    };

    const result = await cloudinary.uploader.upload(path, options);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Can't upload image" },
      { status: 500 }
    );
  }
}
