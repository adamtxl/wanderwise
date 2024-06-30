import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';


function AboutPage() {
  return (
    <Container className='border-container margin-top op'>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body className='about'>
              <Card.Title>About the App</Card.Title>
              <Card.Text>
                This app helps users manage their trips efficiently by providing a comprehensive packing list feature. You can easily add, update, and manage your items to ensure you never forget anything important.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body className='about'>
              <Card.Title>About the Creator</Card.Title>
              <Card.Text>
                Hi, I'm Adam Troxell, a passionate junior developer with experience in React, Redux, Node, HTML, CSS and SQL. I created this app to solve the common problem of forgetting essential items when packing for trips. Feel free to reach out to me at <span className='no-shadow'> <a href="mailto:adamtxl@hotmail.com">adamtxl@hotmail.com</a> </span>or follow me on <span className='no-shadow'><a href="https://www.linkedin.com/in/adam-troxell1/">https://www.linkedin.com/in/adam-troxell1/</a></span>.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col>
          <Card>
            <Card.Body className='about'>
              <Card.Title>Getting Started</Card.Title>
              <Card.Text>
                To get started with our app, simply create an account, and start adding your trips and packing items. You can create a new trip, add items to your packing list, and update your items as needed. Enjoy your trip!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}export default AboutPage;
