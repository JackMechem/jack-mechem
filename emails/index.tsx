import * as React from "react";
import { Button, Html, Text, Img } from "@react-email/components";

export default function Email({
  name,
  email,
}: {
  name: string;
  email: string;
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
        Hi {name}, Your email has been sent! <br />I should respond within 24 -
        48 hours to the address below:
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

      <Button
        href="https://jackmechem.dev/work"
        style={{
          background: "#F0F5FC",
          color: "#364F6B",
          padding: "12px 20px",
          fontFamily: "monospace",
          fontWeight: 600,
          fontSize: "16px",
          borderRadius: "15px",
          border: "solid 2px #5DD776",
          boxShadow: "-5px 5px 0 0 #428CE2",
        }}
      >
        ./see-some-of-my-work
      </Button>
    </Html>
  );
}
