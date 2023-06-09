"use client";

import { createEvent } from "@/types/Types";
import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import LoadingSubmitForm from "../LoadingSubmitForm";
import { Post_Company_Register } from "@/services/PostRegister";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useSesionUsuarioContext } from "@/hooks/useSesionUsuarioContext";

const validationSchema = yup.object({
  nombre: yup.string().required(""),
  fecha_inicio: yup.string().required(""),
  fecha_final: yup.string().required(""),
  lugar: yup.string().required(""),
  cupos: yup
    .number()
    .required("El cupo debe ser mayor a 0")
    .positive("El cupo debe ser mayor a 0")
    .integer(),
  establecimiento: yup
    .string()
    .required("Debes ingresar el establecimiento en donde se hara el evento"),
  perfil: yup.string().required(""),
  pago: yup
    .number()
    .required("El Pago debe ser mayor a 0")
    .positive("El Pago debe ser mayor a 0")
    .integer(),
  observaciones: yup.string().required(""),
});

interface PropsCreateEventForm {
  idEvent?: string;
}

interface formProps {
  id_empresa: string;
  nombre: string;
  fecha_inicio: string;
  fecha_final: string;
  lugar: string;
  establecimiento: string;
  cupos: number;
  perfil: string;
  pago: number;
  observaciones: string;
}

const CreateEventForm = ({ idEvent }: PropsCreateEventForm) => {
  const [isLoading, setIsLoading] = useState(false);
  const { id, token } = useSesionUsuarioContext();
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      id_empresa: id,
      nombre: "",
      fecha_inicio: "",
      fecha_final: "",
      lugar: "",
      establecimiento: "",
      cupos: 0,
      perfil: "",
      pago: 0,
      observaciones: "",
    },
    validationSchema,
    onSubmit: (values) => {
      submitHandler(values);
    },
  });

  useEffect(() => {
    (() => formik.validateForm())();
  }, []);

  useEffect(() => {
    if (idEvent) {
      getEvent();
    }
  }, []);

  const checkFechas = (
    dateInicio: string,
    dateFinal: string
  ): { result: boolean; msg: string } => {
    let actualDate = new Date();
    actualDate.setHours(actualDate.getHours() - 5);
    let fechaI = new Date(dateInicio);
    let fechaF = new Date(dateFinal);

    if (fechaI <= actualDate)
      return {
        result: false,
        msg: "La fecha de inicio no puede ser una fecha pasada",
      };
    if (fechaI >= fechaF)
      return { result: false, msg: "Las fechas deben estar ordenadas" };
    return { result: true, msg: "" };
  };

  const getEvent = async () => {
    const event = await fetch(`/api/event`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        realmethod: "GET",
        eventoId: idEvent,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await formik.setFieldValue("nombre", data.nombre);
        await formik.setFieldValue(
          "fecha_inicio",
          data.fecha_inicio.slice(0, 16)
        );
        await formik.setFieldValue(
          "fecha_final",
          data.fecha_final.slice(0, 16)
        );
        await formik.setFieldValue("lugar", data.lugar);
        await formik.setFieldValue("establecimiento", data.establecimiento);
        await formik.setFieldValue("cupos", data.cupos);
        await formik.setFieldValue("perfil", data.perfil);
        await formik.setFieldValue("pago", data.pago);
        await formik.setFieldValue("observaciones", data.observaciones);
      })
      .then(() => {
        formik.validateForm();
      })
      .catch((err) => err);
  };

  const submitHandler = async (values: createEvent) => {
    console.log(values);
    console.log(token);
    setSubmitError("");
    const validateDate = checkFechas(
      formik.values.fecha_inicio,
      formik.values.fecha_final
    );
    if (validateDate.result) {
      setIsLoading(true);
      router.asPath !== "/home"
        ? await fetch(`/api/event/create-event`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ values, realmethod: "PUT", idEvent }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("No se pudo realizar la petición");
              }
              const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                background: "#B1FFBD",
                color: "green",
                iconColor: "green",
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });

              Toast.fire({
                icon: "success",
                title: "Evento actualizado exitosamente",
              });
              router.push("/home");
            })
            .catch((e) => {
              const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                background: "red",
                color: "white",
                iconColor: "white",
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });

              Toast.fire({
                icon: "error",
                title: "No se pudo actualizar el evento",
              });
            })
        : await fetch("/api/event/create-event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("No se pudo realizar la peticion");
              }
              const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                background: "#B1FFBD",
                color: "green",
                iconColor: "green",
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });

              Toast.fire({
                icon: "success",
                title: "Evento creado exitosamente",
              });
              formik.resetForm();
            })
            .catch((e) => {
              const Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 3000,
                background: "red",
                color: "white",
                iconColor: "white",
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });

              Toast.fire({
                icon: "error",
                title: "No se pudo crear el evento",
              });
            });
      setIsLoading(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: validateDate.msg,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="mt-16 md:mt-0 w-10/12">
        <h3 className="text-indigo-600 p-3 mt-2 text-5xl text-center">
          {router.asPath !== "/home" ? "Editar Evento" : "Crea tu Evento"}
        </h3>

        <form
          onSubmit={formik.handleSubmit}
          className="w-full flex flex-col items-start"
        >
          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Nombre
                <input
                  name="nombre"
                  placeholder="Nombre"
                  type="text"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary flex flex-col justify-center text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.nombre ? (
            <div className="text-red-600">{formik.errors.nombre}</div>
          ) : null}

          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Fecha Inicio
                <input
                  name="fecha_inicio"
                  placeholder="Fecha inicio"
                  type="datetime-local"
                  value={formik.values.fecha_inicio}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary flex justify-center text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.fecha_inicio ? (
            <div className="text-red-600">{formik.errors.fecha_inicio}</div>
          ) : null}
          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Fecha Final
                <input
                  name="fecha_final"
                  placeholder="Fecha final"
                  type="datetime-local"
                  value={formik.values.fecha_final}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary  flex justify-center text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.fecha_final ? (
            <div className="text-red-600">{formik.errors.fecha_final}</div>
          ) : null}
          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Ciudad
                <input
                  name="lugar"
                  placeholder="Ciudad"
                  type="text"
                  value={formik.values.lugar}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.lugar ? (
            <div className="text-red-600">{formik.errors.lugar}</div>
          ) : null}
          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Cupos
                <input
                  name="cupos"
                  placeholder="Cupos"
                  type="number"
                  value={formik.values.cupos}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.cupos ? (
            <div className="text-red-600 mb-2 -mt-2">{formik.errors.cupos}</div>
          ) : null}
          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Lugar del Evento
                <input
                  name="establecimiento"
                  placeholder="Defina el Lugar del evento"
                  type="text"
                  value={formik.values.establecimiento}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary  flex justify-center text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.establecimiento ? (
            <div className="text-red-600 -mt-2 mb-2">
              {formik.errors.establecimiento}
            </div>
          ) : null}
          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Perfil
                <input
                  name="perfil"
                  placeholder="Perfil"
                  type="text"
                  value={formik.values.perfil}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.perfil ? (
            <div className="text-red-600">{formik.errors.perfil}</div>
          ) : null}

          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Pago
                <input
                  name="pago"
                  placeholder="Pago"
                  type="number"
                  value={formik.values.pago}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.pago ? (
            <div className="text-red-600 mb-2 -mt-2">{formik.errors.pago}</div>
          ) : null}

          <div className="w-full">
            <div className="w-full mb-4">
              <label className="relative text-indigo-600 text-lg">
                Observaciones
                <input
                  name="observaciones"
                  placeholder="Observaciones"
                  type="text"
                  value={formik.values.observaciones}
                  onChange={formik.handleChange}
                  className="w-full input input-bordered input-primary text-indigo-600"
                />
              </label>
            </div>
          </div>
          {formik.errors.observaciones ? (
            <div className="text-red-600">{formik.errors.observaciones}</div>
          ) : null}

          {submitError && (
            <span className="bg-red-600 text-white font-bold px-8 py-2 rounded mb-4">
              {submitError}
            </span>
          )}
          <div className="w-full text-center">
            {isLoading ? (
              <LoadingSubmitForm />
            ) : (
              <>
                {!formik.isValid && (
                  <p className="text-red-600">Debe rellenar todos los campos</p>
                )}
                <button
                  type="submit"
                  className={`${
                    formik.touched && formik.isValid
                      ? "bg-[#4B39EF] hover:bg-[#6050f3] cursor-pointer"
                      : "bg-slate-400"
                  } rounded-lg px-16 py-2 mb-6 mt-2 text-lg text-white font-bold transition duration-300`}
                  disabled={!formik.isValid}
                >
                  {router.asPath !== "/home"
                    ? "Actualizar Evento"
                    : "Crear Evento"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;
