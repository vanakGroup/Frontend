import { useState } from "react";
import { Navigate } from "react-router-dom";
import PhoneStep from "@/components/Custom/PhoneStep";
import OTPStep from "@/components/Custom/OTPStep";
import useUserStore from "@/store/userStore/userStore"; // Adjust path if needed

export default function Login() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [phoneNumber, setPhoneNumber] = useState("");

  const accessToken = useUserStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to="/blank" replace />;
  }

  return (
    <div>
      {step === "login" ? (
        <PhoneStep
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          handleSuccess={() => setStep("otp")}
        />
      ) : (
        <OTPStep
          phoneNumber={phoneNumber}
          handleBack={() => setStep("login")}
        />
      )}
    </div>
  );
}
//for deploy
