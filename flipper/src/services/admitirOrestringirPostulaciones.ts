interface ResponseAdmitirOrestringirPostulaciones {
  message: string;
}

export const admitirOrestringirPostulaciones = (
  idEvent: string,
  admitePostulaciones: boolean,
  token: String
): Promise<ResponseAdmitirOrestringirPostulaciones> => {
  return fetch(`/api/event/admitirOrestringirPostulaciones`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      admitePostulaciones,
      eventoId: idEvent,
      realmethod: "PUT",
    }),
  }).then((response) => response.json());
};
