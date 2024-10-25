import Button from "../components/Button/Button";
import InputField from "../components/Input/Input";
import { useOnInputState } from "../hooks/form";
import { useValue } from "../hooks/form";
import { useState } from "react";
import { requestHandler } from "../utils/api";
import { toastSuccess } from "../utils/SweetAlert";
import { toastError } from "../utils/SweetAlert";
import { GetAllUsers } from "../utils/api";
import { changePassword } from "../utils/api";

export class changepasswordmodel {
  user_password: string = "";
  // user_id:string=''
}

const ChangePassword = () => {
  const [data, setData] = useState<changepasswordmodel>(
    new changepasswordmodel()
  );
  const [confirmPassword, setConfirmPassword] = useState("");

  const onInput = useOnInputState(data, setData);
  const FieldAttributes = useValue(data, onInput);

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const validatePasswords = (): boolean => {
    if (data.user_password !== confirmPassword) {
      // setErrorMessage("Passwords do not match");
      toastError.fire({
        title: "password do not match",
      });
      return false;
    }
    return true;
  };

  const change_password = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validatePasswords()) return;

    requestHandler(
      async () => {
        return await changePassword(data);
      },
      (responseData) => {
        toastSuccess.fire({
          title: responseData.message,
        });
        GetAllUsers();
      },
      (errorMessage) => {
        // console.log(errorMessage, "errorMessage");

        toastError.fire({
          title: errorMessage,
        });
      }
    );
  };


  return (
    <div className="flex align-center justify-center mt-32">
      <div className="w-[400px]">
        <form onSubmit={change_password}>
          <InputField
            required
            label="New password"
            type="password"
            {...FieldAttributes("user_password")}
          />
          <InputField
            required
            type="password"
            label="Confirm password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            name="Confirm Password"
          />
          {/* {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} */}
          <Button varient="blue">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
