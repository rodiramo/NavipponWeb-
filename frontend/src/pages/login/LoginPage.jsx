import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import useUser from "../../hooks/useUser";  

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoginLoading, hasLoginError, isLogged } = useUser();

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [navigate, isLogged]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const submitHandler = (data) => {
    const { email, password } = data;
    login({ email, password });
  };

  return (
    <MainLayout>
      <section className="flex justify-center items-center min-h-screen py-12">
        <div className="w-full max-w-lg p-12 bg-white">
          <h2 className='text-2xl mb-4'>Iniciar sesión</h2>
          <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="email" className="block mb-1 text-[#5a7184] font-semibold">
                Email*
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  pattern: {
                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Ingresa un email válido",
                  },
                  required: {
                    value: true,
                    message: "El Email es requerido",
                  },
                })}
                placeholder="Ingresa tu email"
                className={`w-full p-2 rounded-full bg-[#F2F2F2] border ${errors.email ? 'border-[#FA5564]' : 'border-gray-300'}`}
              />
              {errors.email?.message && (
                <p className='text-[#FA5564] text-xs mt-1'>
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="password" className="block mb-1 text-[#5a7184] font-semibold">
                Contraseña*
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "La contraseña es requerida",
                  },
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                placeholder="Ingresa tu contraseña"
                className={`w-full p-2 rounded-full bg-[#F2F2F2] border ${errors.password ? 'border-[#FA5564]' : 'border-gray-300'}`}
              />
              {errors.password?.message && (
                <p className='text-[#FA5564] text-xs mt-1'>
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className='flex items-center justify-between mb-4'>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-2' />
                Mantenerse conectado
              </label>
              <Link to='/forget-password' className='text-[#FA5564]'>¿Olvidaste tu contraseña?</Link>
            </div>

            <button type='submit' className='w-full mb-4 p-2 bg-[#FA5564] text-white rounded-full' disabled={!isValid || isLoginLoading}>
              Acceder
            </button>

            <div className='flex justify-center'>
              <span>¿No tienes cuenta?</span>
              <Link to='/register' className='ml-2 text-[#FA5564]'>Registrarse</Link>
            </div>
          </form>
          {hasLoginError && <p className='text-[#FA5564] text-xs mt-1'>Credenciales inválidas</p>}
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginPage;