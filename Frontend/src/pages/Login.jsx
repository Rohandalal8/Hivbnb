import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async (e) => {
        e.preventDefault();

        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            console.log(userCredential.user);

            alert("Account Created Successfully");

        } catch (error) {

            console.log(error);

            alert(error.message);
        }

        };

        const loginUser = async (e) => {
            e.preventDefault();

        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            console.log(userCredential.user);

            alert("Login Successful");

        } catch (error) {

            console.log(error);

            alert(error.message);
        }

        };

        const googleLogin = async () => {

        try {

            const provider =
                new GoogleAuthProvider();

            const result =
                await signInWithPopup(
                    auth,
                    provider
                );

            console.log(result.user);

            alert("Google Login Successful");

        } catch (error) {

            console.log(error);

            alert(error.message);
        }

        };

        return (<div>

            < h1 > Login</h1 >

            <form>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br />
                <br />

                <button onClick={registerUser}>
                    Sign Up
                </button>

                <button
                    type="button"
                    onClick={loginUser}
                >
                    Login
                </button>

            </form>

            <br />

            <button onClick={googleLogin}>
                Continue With Google
            </button>

        </div >

);
};
export default Login;