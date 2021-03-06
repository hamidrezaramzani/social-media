import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert2";
import Input from "../../components/AuthInput/Input";
import AuthLayout from "../../components/AuthLayout";
import httpClient from "../../api/client";
import { UserContext } from "../../context/providers/UserProvider";
import { loginUser } from "../../context/actions/UserActions";
import InterestsModal, { Item } from './Interests/InterestsModal';
const LoginPage = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (state.auth) navigate("/");
  }, [navigate, state.auth]);
  const schema = yup.object().shape({
    username: yup
      .string()
      .required("it can not be empty")
      .min(3, "you must provide at 3 least characters for username"),
    password: yup
      .string()
      .required("it can not be empty")
      .min(6, "you must provide at 6 least characters for password"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const setUserInfo = (data) => {
    localStorage.setItem("social-media-hamidreza", JSON.stringify(data));
    dispatch(loginUser(data));
  }

  const handleSubmitForm = async (values) => {
    try {
      const { data } = await httpClient.post("users/login", values);
      if (data.interests.length) {
        setUserInfo(data);
      } else {
        setData(data);
      }

    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        swal.fire({
          title: "Login Failed",
          text: "username or password is invalid",
          icon: "error",
        });
      } else {
        swal.fire({
          title: "Login Failed",
          text: "server internal error",
          icon: "error",
        });
      }
    }
  };
  return (
    <AuthLayout
      title="Login Page"
      description={"by login you can access all features"}
    >
      <InterestsModal data={data} setUserInfo={setUserInfo} />
      <form className="my-5" onSubmit={handleSubmit(handleSubmitForm)}>
        <Input
          type="text"
          placeholder="Type your username"
          errors={errors}
          register={register}
          name="username"
        />
        <Input
          type="password"
          placeholder="Type your password"
          errors={errors}
          register={register}
          name="password"
        />
        <button className="button">LOGIN</button>
        <Link
          className="text-center w-full text-neutral-400 font-main text-sm pt-4  block"
          to="/auth/register"
        >
          you haven't an account?
        </Link>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
