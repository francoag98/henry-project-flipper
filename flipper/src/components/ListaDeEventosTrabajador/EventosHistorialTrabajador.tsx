import {
  objtrabajadoresEnEventosIncludeEvento,
  objEvento,
  objtrabajadoresEnEventos,
} from "@/types/Types";
import { downloadExcelTrabajador } from "../Excel/generateExcel";
import CardEventoConfirmadoHistorial from "./CardEventoConfirmadoHistorial";
import useSWR, { Fetcher } from "swr";
import { useSesionUsuarioContext } from "@/hooks/useSesionUsuarioContext";

const buttonStyle =
  "btn bg-[#4B39EF] normal-case text-[24px] text-white border-transparent hover:bg-[#605BDC]";

const HistorialTrabajador = () => {
  const { id, token } = useSesionUsuarioContext();

  const fetcherTrabajador: Fetcher<any, string> = (apiRoute) => {
    return fetch(apiRoute, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        realmethod: "GET",
        trabajadorId: id,
        status: "ASISTIO",
        ordenFecha: "HISTORIAL",
      }),
    }).then((res) => res.json());
  };
  const { isLoading, data, error } = useSWR(
    "/api/trabajadoreseneventos",
    fetcherTrabajador
  );
  //const eventosExcel: objtrabajadoresEnEventos[] = [];
  //data?.map(
  //(
  //objtrabajadoresEnEventosIncludeEvento: objtrabajadoresEnEventosIncludeEvento
  //) => {
  //eventosExcel.push(objtrabajadoresEnEventosIncludeEvento.evento);
  //}
  //);
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-full w-full bg-gray-200">
      <div className="p-2">
        <h1 className="text-5xl mt-20 md:mt-10 text-indigo-700 text-center">
          Historial de eventos
        </h1>

        <div className="flex flex-col items-center m-auto w-11/12">
          {data.length == 0 ? (
            <h2 className="mt-20 font-bold">
              Todavia no asististe a ningún evento
            </h2>
          ) : (
            <div className="flex flex-col items-center w-full">
              <button
                onClick={() => {
                  downloadExcelTrabajador(data);
                }}
                className={buttonStyle + " my-4 bg-green-700"}
              >
                Descargar Excel
              </button>
              <CardEventoConfirmadoHistorial eventos={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialTrabajador;
