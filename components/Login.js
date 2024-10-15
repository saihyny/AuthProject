"use client";
import React, { useRef, useState, useEffect } from "react";

const LoginPage = (props) => {
  const [isnew, setUser] = useState(false);
  const [error, setError] = useState(null);
  const [forgetPass, setForgotpass] = useState(false);
  const email_log = useRef();
  const password_log = useRef();
  const [isValidEmail, setIsValidEmail] = useState(false); // State to track email validity
  const email_sig = useRef();
  const password_sig = useRef();
  const confirm_sig = useRef();
  const forgotEmail = useRef();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false);
      }, 10000);

      // Cleanup function to clear the timer when component unmounts or state changes
      return () => clearTimeout(timer);
    }
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!isnew) {
      if (password_sig.current.value !== confirm_sig.current.value) {
        setError("please enter same password in both fields");
        return null;
      }
    }
    const Email = isnew ? email_log.current.value : email_sig.current.value;
    const Password = isnew
      ? password_log.current.value
      : password_sig.current.value;
      
    console.log(Email, Password, isnew);
    let URL;
    if (isnew) {
      URL =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAN1w9QjbLVYdwm9PeodDq_kWATHQr6-0Y";
    } else {
      URL =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAN1w9QjbLVYdwm9PeodDq_kWATHQr6-0Y";
    }

    fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        email: Email,
        password: Password,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          console.log('new user')
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = data;
            setError(errorMessage.error.message);
            throw new Error(errorMessage.error.message);
          });
        }
      })
      .then((data) => {
        
        !isnew ? alert("successfully sigup ") : alert("successfully Login ")
        setUser(true);
        props.user()
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    if (emailValue.includes("@gmail.com")) {
      setIsValidEmail(true); // Set true if email contains "@gmail.com"
    } else {
      setIsValidEmail(false); // Set false otherwise
    }
  };
  const forPassFunction = () => {
    const Email = forgotEmail.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAN1w9QjbLVYdwm9PeodDq_kWATHQr6-0Y",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: Email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (!res.ok) {
        alert("please enter your Correct Email Id");
      } else {
        setError(
          "You would recieve a password reset link in your mail id which you entered above.Open the link and change the password Now try logging into your website via the new password and it should work"
        );
      }
    });
  };
  const login = (
    <>
      <h6>{error}</h6>
      <div class="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
        <div class="flex justify-between">
          <label class="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
            Username
          </label>
          {isValidEmail && (
            <div class="absolute right-3 translate-y-2 text-green-200">
              {/* Conditionally render SVG based on email validation */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <input
          onChange={handleEmailChange} // On change, check the email
          ref={email_log}
          required
          type="text"
          name="username"
          placeholder="Username"
          autocomplete="off"
          class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
        />
      </div>
      <div class="mt-4">
        <div>
          <div class="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
            <div class="flex justify-between">
              <label class="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                Password
              </label>
            </div>
            <div class="flex items-center">
              <input
                type="password"
                name="password"
                ref={password_log}
                required
                class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            name="remember"
            class="outline-none focus:outline focus:outline-sky-300"
          />
          <span class="text-xs">Remember me</span>
        </label>
        <a
          onClick={(e) => {
            e.preventDefault();
            setForgotpass(true);
          }}
          class="text-sm font-medium text-foreground underline cursor-pointer"
        >
          Forgot password?
        </a>
      </div>
      <div class="mt-4 flex items-center justify-end gap-x-2">
        <a
          onClick={() => {
            setUser(false);
          }}
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200 cursor-pointer "
        >
          Register
        </a>
        <button
          class="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
          type="submit"
        >
          Log in
        </button>
      </div>
    </>
  );
  const signUp = (
    <>
      <h6>{error}</h6>
      <div class="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
        <div class="flex justify-between">
          <label class="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
            Username
          </label>
          {isValidEmail && (
            <div class="absolute right-3 translate-y-2 text-green-200">
              {/* Conditionally render SVG based on email validation */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <input
          onChange={handleEmailChange} // On change, check the email
          ref={email_sig}
          required
          type="text"
          name="username"
          placeholder="Username"
          autocomplete="off"
          class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
        />
      </div>
      <div class="mt-4">
        <div>
          <div class="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
            <div class="flex justify-between">
              <label class="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                Password
              </label>
            </div>
            <div class="flex items-center">
              <input
                type="password"
                name="password"
                ref={password_sig}
                required
                class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <div>
          <div class="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
            <div class="flex justify-between">
              <label class="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
                confirm Password
              </label>
            </div>
            <div class="flex items-center">
              <input
                type="password"
                name="password"
                ref={confirm_sig}
                required
                class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <a
          onClick={() => {
            setUser(true);
          }}
          class="text-sm font-medium text-foreground underline cursor-pointer"
        >
          already have an account ?
        </a>
        <button
          class="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
          type="submit"
        >
          submit
        </button>
      </div>
    </>
  );
  const forgetPassword = (
    <>
      <h6>{error}</h6>
      <div class="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
        <div class="flex justify-between">
          <label class="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">
            Email
          </label>
          {isValidEmail && (
            <div class="absolute right-3 translate-y-2 text-green-200">
              {/* Conditionally render SVG based on email validation */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <input
          onChange={handleEmailChange} // On change, check the email
          ref={forgotEmail}
          required
          type="email"
          name="username"
          placeholder="Email"
          autocomplete="off"
          class="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground"
        />
      </div>
      <div class="mt-4 flex items-center justify-between">
        <a
          onClick={(e) => {
            setForgotpass(false);
            e.preventDefault();
          }}
          class="text-sm font-medium text-foreground underline cursor-pointer"
        >
          Did you get Password ?
        </a>
        <button
          class="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
          onClick={(e) => {
            e.preventDefault();
            forPassFunction();
          }}
        >
          Send Link
        </button>
      </div>
    </>
  );
  return (
    <div className="bg-black text-white flex min-h-screen flex-col justify-center items-center">
      <div className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none p-6 ">
        <div className="flex flex-col p-6">
          <h3 className="text-xl font-semibold leading-6 tracking-tighter">
            Login
          </h3>
          <p className="mt-1.5 text-sm font-medium text-white/50">
            Welcome back, enter your credentials to continue.
          </p>
        </div>
        <form onSubmit={submitHandler}>
          {forgetPass ? forgetPassword : isnew ? login : signUp}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
