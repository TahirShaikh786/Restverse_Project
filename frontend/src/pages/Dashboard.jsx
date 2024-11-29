import React, { useState } from "react";
import "../assets/css/dashboard.css";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Form from 'react-bootstrap/Form';
import Logout from "./Logout";

const Dashboard = () => {
  const [bname, setName] = useState({
    businessName: "",
  });
  const [reviewsData, setReviewsData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setName({
      ...bname,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews?businessName=${bname.businessName}`,
        {
          method: "GET",
        }
      );
      let data = await response.json();
      if (response.ok) {
        if (!Array.isArray(data)) {
          data = [data];
        }
        setReviewsData(data);
      } else {
        console.log("No Data Found Related to the Query");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <section className="main_container">
        <Container>
          <Row>
            <Col className="main_heading d-flex justify-content-between align-items-center bg-black">
              <h1>Welcome to dashboard</h1>
              <Logout/>
            </Col>
          </Row>
          <Row>
            <Col className="search_area">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="businessName"
                  onChange={handleInput}
                  value={bname.businessName}
                  placeholder="Enter Your Business"
                />
                <button type="submit">Submit</button>
              </form>
            </Col>
          </Row>
          <Row className="d-flex justify-content-evenly flex-wrap mx-2">
            <Col md={4} className="search_data">
              {reviewsData.length > 0 ? (
                reviewsData.map((review) => (
                  <div key={review._id}>
                    <img src={review.img} alt={review.businessName} />
                    <h3>{review.businessName}</h3>
                    <p>
                      Address:-{" "}
                      <span>
                        {review.address
                          ? `${review.address.streetAddress}, ${review.address.city}, ${review.address.state} ${review.address.postalCode}`
                          : "No address available"}
                      </span>
                    </p>
                    <p>
                      Phone:- <span>{review.phoneNumber}</span>
                    </p>
                    <p>
                      Opening Hours:- <span>{review.openHours}</span>
                    </p>
                    <p>Rating:- {review.rating + "⭐"}</p>
                    <h6 className="d-flex">
                      Categories:- {"  "}
                      <div className="categories">
                        {review.categories.join(" , ")}
                      </div>
                    </h6>
                  </div>
                ))
              ) : (
                <p>No reviews found.</p>
              )}
            </Col>
            <Col md={5} className="reviews_area">
              {reviewsData.length > 0 ? (
                reviewsData.map((review) => {
                  return (
                    <div key={review._id}>
                      {review.reviews && Array.isArray(review.reviews) ? (
                        review.reviews.map((r, index) => (
                          <div key={index}>
                            <p>
                              Reviewer Name:{" "}
                              <span>{r.reviewerName || "Anonymous"}</span>
                            </p>
                            <p>
                              Rating:{" "}
                              <span>{r.rating + "⭐" || "No rating"}</span>
                            </p>
                            <p>
                              Comment: <span>{r.comment || "No comment"}</span>
                            </p>
                            <button onClick={handleShow}>Reply</button>
                            <hr />
                          </div>
                        ))
                      ) : (
                        <p>No reviews found.</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No reviews found.</p>
              )}
            </Col>
          </Row>

          <Modal show={show} onHide={handleClose}>
            <Modal.Body closeButton>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control type="text" placeholder="Enter Your Comment" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </section>
    </>
  );
};

export default Dashboard;
