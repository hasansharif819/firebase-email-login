import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import app from './firebase.init';
import { useState } from 'react';

const auth = getAuth(app);


function App() {
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const varifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then( () => {
        console.log('Email varification send');
    });
  }

  const passwordReset = () => {
    sendPasswordResetEmail(auth, email)
    .then( () => {
      console.log('password reset email sent');
    })
    
    .catch(error => {
      const errorMessage = error.message;
      console.error(error, errorMessage);
    })
  }

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleRegistered = event => {
    setRegistered(event.target.checked);
  }

  const formSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    setValidated(true);

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user)
        })
        .catch(error => {
          console.error(error);
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('');
          varifyEmail();
        })
        .catch(error => {
          console.error(error);
        })
    }
  }
  return (
    <div>
      <h2 className='mx-auto w-50'>Welcome to my simple Website</h2>
      <h4 className='text-primary w-50 mx-auto'>Please {registered ? 'Login' : 'Register'}</h4>
      <div className="register w-50 mx-auto">
        <Form noValidate validated={validated} onSubmit={formSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegistered} type="checkbox" label="Already Registered" />
          </Form.Group>
          <Button onClick={passwordReset} variant="link">Forgeot password</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'Login' : 'Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
