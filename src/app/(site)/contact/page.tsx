import Container from "../components/container";
import MediumBlock from "../components/mediumBlock";

const Contact = () => {
  return (
    <Container className="">
      <MediumBlock className="">
        <h1>Contact Me</h1>
        <h2 className="text-green">This page is under construction!</h2>
        <h3>
          In the mean time, please reach out through the email provided below:
        </h3>
        <a href="mailto:jack@jackmechem.dev">
          <h3>jack@jackmechem.dev</h3>
        </a>
      </MediumBlock>
    </Container>
  );
};

export default Contact;
