/* eslint-disable react/prop-types */
import { Container } from "reactstrap";
import "../../../styles/common-section.css";

function CommonSection(props) {
  return (
    <section className="common-section">
      <Container>
        <h2>{props.title}</h2>
      </Container>
    </section>
  );
}

export default CommonSection;
