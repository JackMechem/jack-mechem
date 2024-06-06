import * as React from "react";
import { Button, Html, Text, Img } from "@react-email/components";

export default function MyEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return (
    <Html
      style={{
        padding: "20px",
        background: "#F0F5FC",
      }}
    >
      <Text
        style={{
          color: "#364F6B",
          fontFamily: "monospace",
          fontWeight: 600,
        }}
      >
        Hi {name}, you got an email from this address: <br />
      </Text>
      <Text
        style={{
          color: "#364F6B",
          fontFamily: "monospace",
          fontWeight: 600,
        }}
      >
        {email}
      </Text>

      <Text
        style={{
          color: "#364F6B",
          fontFamily: "monospace",
          fontWeight: 600,
        }}
      >
        Message: <br />
        {message}
      </Text>
    </Html>
  );
}
