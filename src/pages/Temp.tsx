import CustomToast from "@/components/Custom/CustomToast";
import { loginService } from "@/services/authService";
import useUserStore from "@/store/userStore/userStore";
import { translateNumber } from "@/utils/translateNumber";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Temp() {
  const { username, setUsername } = useUserStore();
  const [email, setEmail] = useState<string>("");
  const [count, setCounter] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const showToast = () => {
    CustomToast("This is a toast");
  };
  const increaseCounter = () => {
    setCounter((prev) => prev + 1);
  };
  const login = () => {
    setLoading(true);
    loginService({ phone: email })
      .then((data) => {
        setUsername(data?.data?.phone || "کاربر");
        CustomToast("Login successful", "success");
      })
      .catch((error) => {
        console.log(error);
        CustomToast("Login failed", "error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full h-screen font-3xl flex flex-col place-self-center justify-center gap-4">
      <div className="flex gap-2 rounded-md place-self-center">
        <button
          className="bg-red-600 text-white rounded-md p-2 cursor-pointer"
          onClick={() => showToast()}
        >
          toast
        </button>

        <button
          className="cursor-pointer bg-accent rounded-md p-2"
          onClick={login}
        >
          {loading ? <p>Logging in...</p> : <p>Login</p>}
        </button>
      </div>
      <div className="bg-neutral-400 w-fit p-4 rounded-md flex flex-col place-self-center gap-4">
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="username"
          className="border-1 border-neutral-800"
        />
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="password"
          className="border-1 border-neutral-800"
        />
      </div>
      <div></div>
      <div className="flex flex-col place-items-center gap-2 ">
        <Button className="text-rounded-md p-4 cursor-pointer" size="sm">
          Login
        </Button>
        <Button
          disabled
          className="text-rounded-md p-4 cursor-pointer"
          size="sm"
        >
          test
        </Button>
      </div>
      <div className="w-fit p-4 rounded-md flex flex-col place-self-center gap-4">
        <Select>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="none">none</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <p className="text-5xl text-center ">This is a temp page</p>
      <div className="flex flex-col place-items-center gap-2">
        <button
          className="bg-red-600 text-white rounded-md p-4 cursor-pointer"
          onClick={increaseCounter}
        >
          Increase count
        </button>
        <div className="text-red-600 flex vazir">
          Count: {translateNumber(count)}
        </div>
      </div>
      <div className="bg-hover">
        <input
          value={username || ""}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="border-1 border-neutral-800"
        />
      </div>
    </div>
  );
}
