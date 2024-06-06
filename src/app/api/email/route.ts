import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Email from "../../../../emails/index";
import MyEmail from "../../../../emails/myEmail";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const resend = new Resend(process.env.RESEND_KEY as string);

  const userEmail = await resend.emails.send({
    from: "jack@jackmechem.dev",
    to: data.email,
    subject: "Email Sent!",
    react: Email({ name: data.name, email: data.email }),
  });

  const myEmail = await resend.emails.send({
    from: "websiteuser@jackmechem.dev",
    to: "jack@jackmechem.dev",
    subject: "Email Sent From Website",
    react: MyEmail({
      name: data.name,
      email: data.email,
      message: data.message,
    }),
  });

  console.log(userEmail);
  console.log(myEmail);

  return NextResponse.json({ myEmail }, { status: 200 });
}
