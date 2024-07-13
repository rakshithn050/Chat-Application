import React, { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import { apiClient } from "/lib/api-client";
import { SIGNUP_ROUTE } from "/utils/constants";
import { toast } from "sonner";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const signUpRef = useRef(null);
  const loginRef = useRef(null);

  const handleValidation = () => {
    let hasError = false;

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (activeTab === "signup" && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    return hasError;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (handleValidation()) return;

    try {
      const response = await apiClient.post(SIGNUP_ROUTE, { email, password });
      if (response.status === 201) {
        toast.success("Registration Successful");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
      }
    } catch (error) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      console.log(error);
      toast.error(`Sign up failed. ${error.response.data.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (handleValidation()) return;

    try {
      // Your login logic here
      setEmailError("");
      setPasswordError("");
    } catch (error) {
      setEmailError(
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="container h-screen flex justify-center items-center px-4">
      <div className="flex flex-col items-center justify-center h-[80vh] w-full max-w-4xl shadow-xl rounded-3xl p-5">
        <div className="flex flex-col justify-center items-center gap-3 my-4">
          <h1 className="text-xl md:text-3xl font-bold">
            Welcome to the Chat Application
          </h1>
          <p>Fill up the details below to get started</p>
        </div>
        <div className="grid md:grid-cols-2 items-center gap-4 w-full">
          <div className="border border-gray-300 rounded-lg p-6 shadow-md w-full">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full flex bg-white">
                <TabsTrigger
                  value="signup"
                  className="w-1/2 bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                  ref={signUpRef}
                >
                  SignUp
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="w-1/2 bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                  ref={loginRef}
                >
                  Login
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signup">
                <form className="space-y-4" onSubmit={handleSignUp}>
                  <div>
                    <Label className="text-gray-800 text-sm mb-2 block">
                      Email ID
                    </Label>
                    <div className="relative flex items-center">
                      <Input
                        name="email"
                        type="email"
                        required
                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 focus:border-none focus-visible:ring-1"
                        placeholder="Enter your Email Address"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        value={email}
                      />
                      <Mail
                        className="w-[18px] h-[18px] absolute right-4"
                        color="gray"
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-800 text-sm mb-2 block">
                      Password
                    </Label>
                    <div className="relative flex items-center">
                      <Input
                        name="password"
                        type="password"
                        required
                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                        placeholder="Enter password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        value={password}
                      />
                      <Lock
                        className="w-[18px] h-[18px] absolute right-4"
                        color="gray"
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm">{passwordError}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-800 text-sm mb-2 block">
                      Confirm Password
                    </Label>
                    <div className="relative flex items-center">
                      <Input
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                        placeholder="Confirm password"
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                        }}
                        value={confirmPassword}
                      />
                      <Lock
                        className="w-[18px] h-[18px] absolute right-4"
                        color="gray"
                      />
                    </div>
                    {confirmPasswordError && (
                      <p className="text-red-500 text-sm">
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>

                  <div className="mt-8">
                    <Button
                      type="submit"
                      className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Register
                    </Button>
                  </div>

                  <p className="text-sm mt-8 text-center text-gray-800">
                    Have an account?
                    <span
                      className="text-blue-600 font-semibold hover:underline ml-1"
                      onClick={() => setActiveTab("login")}
                    >
                      Login here
                    </span>
                  </p>
                </form>
              </TabsContent>
              <TabsContent value="login">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <Label className="text-gray-800 text-sm mb-2 block">
                      Email ID
                    </Label>
                    <div className="relative flex items-center">
                      <Input
                        name="email"
                        type="email"
                        required
                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                        placeholder="Enter your Email Address"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        value={email}
                      />
                      <Mail
                        className="w-[18px] h-[18px] absolute right-4"
                        color="gray"
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-800 text-sm mb-2 block">
                      Password
                    </Label>
                    <div className="relative flex items-center">
                      <Input
                        name="password"
                        type="password"
                        required
                        className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                        placeholder="Enter password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        value={password}
                      />
                      <Lock
                        className="w-[18px] h-[18px] absolute right-4"
                        color="gray"
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm">{passwordError}</p>
                    )}
                  </div>

                  <div className="mt-8">
                    <Button
                      type="submit"
                      className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      Log in
                    </Button>
                  </div>

                  <p className="text-sm mt-8 text-center text-gray-800">
                    Don't have an account?
                    <span
                      className="text-blue-600 font-semibold hover:underline ml-1"
                      onClick={() => setActiveTab("signup")}
                    >
                      Register
                    </span>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:h-[400px] md:h-[300px] mt-8 md:mt-0">
            <img
              src="https://readymadeui.com/login-image.webp"
              className="w-full h-full object-cover hidden md:block"
              alt="Dining Experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
