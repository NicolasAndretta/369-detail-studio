"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WorkActions({
  id,
  visible,
  enInicio,
  vehiculo,
}: {
  id: string;
  visible: boolean;
  enInicio: boolean;
  vehiculo: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const patch = async (body: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/trabajos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        alert(j?.error ?? "No se pudo guardar");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (
      !confirm(
        `¿Borrar el trabajo "${vehiculo}" con todas sus fotos? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/trabajos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        alert(j?.error ?? "No se pudo borrar");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="abtn"
        disabled={busy}
        onClick={() => patch({ visible: !visible })}
      >
        {visible ? "Ocultar" : "Mostrar"}
      </button>
      <button
        type="button"
        className="abtn"
        disabled={busy}
        onClick={() => patch({ en_inicio: !enInicio })}
      >
        {enInicio ? "Sacar del inicio" : "Poner en inicio"}
      </button>
      <button
        type="button"
        className="abtn abtn--danger"
        disabled={busy}
        onClick={remove}
      >
        Borrar
      </button>
    </>
  );
}
