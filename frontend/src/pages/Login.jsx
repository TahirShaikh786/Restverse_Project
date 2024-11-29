import React, { useState } from "react";
import "../assets/css/login.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { GoogleLogin } from "@react-oauth/google";
import { Col, Container, Row } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import Helmet from "react-helmet";

const Login = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/save_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const data = await response.json();

        if (data.message === "User already exists, no need to save.") {
          navigate("/logout");
        } else {
          navigate("/dashboard");
        }
      } else {
        const error = await response.json();
        console.error(error);
        alert("Failed to save user details.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving user details.");
    }
  };
  return (
    <>
    <Helmet>
      <title>Login</title>
      </Helmet>
      <section className="loginBG">
        <Container>
          <Row className="loginContainer m-0 p-0">
            <Col md={4}>
              <div className="logininnerContainer">
                <h1>Login To Continue</h1>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInput}
                      placeholder="Enter email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleInput}
                      placeholder="Password"
                    />
                  </Form.Group>

                  <Button type="submit">Submit</Button>
                </Form>
                <hr className="text-secondary" />
                OR
                <hr />
                <GoogleLogin  className="google-login-custom"
                  onSuccess={async (credentialResponse) => {
                    const decode = jwtDecode(credentialResponse?.credential);
                    setUser({ decode });

                    try {
                      const response = await fetch(
                        "http://127.0.0.1:5000/api/save_user",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(decode),
                        }
                      );

                      if (response.ok) {
                        const data = await response.json();
                        console.log(data.message);
                        navigate("/dashboard");
                      } else {
                        const error = await response.json();
                        console.error(error);
                        alert("Failed to save Google user details.");
                      }
                    } catch (error) {
                      console.error("Error:", error);
                      alert(
                        "An error occurred while saving Google user details."
                      );
                    }
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;
