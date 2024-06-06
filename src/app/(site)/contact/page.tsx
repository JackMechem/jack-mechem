"use client";

import Container from "../components/container";
import MediumBlock from "../components/mediumBlock";
import { useState } from "react";
import { LandButton } from "../components/Buttons";

interface SendEmailProps {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  type FormData = {
    name: string | undefined;
    email: string | undefined;
    message: string | undefined;
    honeyPot: string | undefined;
  };
  const [formData, setFormData] = useState<FormData>({
    name: undefined,
    email: undefined,
    message: undefined,
    honeyPot: undefined,
  });
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const sendEmail = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    if (formData.honeyPot === undefined || formData.honeyPot === "") {
      const res = await fetch(`/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.myEmail.error === null) {
        setEmailSent(true);
        setLoading(false);
        console.log("Email Sent");
      } else {
        setEmailSent(false);
        setEmailError(data.myEmail.error);
      }
    }
  };
  return (
    <Container className="">
      <MediumBlock className="">
        <h1>Contact Me</h1>
        <h3 className="">
          Feel free to contact me through the email or form below!
        </h3>
        <a href="mailto:jack@jackmechem.dev">
          <h3>jack@jackmechem.dev</h3>
        </a>
        {emailSent ? (
          <h1>
            Your email has been sent! <br />
            Check your inbox for a confirmation email.
          </h1>
        ) : (
          <form
            className="flex flex-col gap-[20px] mt-[20px]"
            onSubmit={sendEmail}
          >
            <input
              className="p-[10px] rounded-[10px] bg-secondary transition-none focus:outline-none outline-none focus:border-[2px] focus:border-blue"
              type="text"
              placeholder="Name"
              onChange={(value) => {
                setFormData({
                  name: value.target.value,
                  email: formData.email,
                  message: formData.message,
                  honeyPot: formData.honeyPot,
                });
              }}
            />
            <input
              className="p-[10px] rounded-[10px] bg-secondary transition-none focus:outline-none outline-none focus:border-[2px] focus:border-blue"
              type="email"
              placeholder="Email"
              onChange={(value) => {
                setFormData({
                  name: formData.name,
                  email: value.target.value,
                  message: formData.message,
                  honeyPot: formData.honeyPot,
                });
              }}
            />
            <textarea
              className="p-[10px] rounded-[10px] bg-secondary transition-none focus:outline-none outline-none focus:border-[2px] focus:border-blue"
              placeholder="Message"
              onChange={(value) => {
                setFormData({
                  name: formData.name,
                  email: formData.email,
                  message: value.target.value,
                  honeyPot: formData.honeyPot,
                });
              }}
            />
            <input
              type="hidden"
              name="favorite_color"
              onChange={(value) => {
                setFormData({
                  name: formData.name,
                  email: formData.email,
                  message: formData.message,
                  honeyPot: value.target.value,
                });
              }}
            />
            {loading ? (
              <h2>Loading</h2>
            ) : (
              <button type="submit" className="all-unset">
                <LandButton>Submit</LandButton>
              </button>
            )}
          </form>
        )}
      </MediumBlock>
    </Container>
  );
};

export default Contact;
