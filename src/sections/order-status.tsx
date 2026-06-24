"use client";

import Script from "next/script";

export function OrderStatusSection() {
  return (
    <section className="order-status" aria-label="Consulta de estado de orden">
      <div className="container">
        <div className="order-status__inner">
          <div className="order-status__copy">
            <span className="order-status__label" aria-hidden="true">Estado de tu vehículo</span>
            <p className="order-status__text">
              ¿Ya dejaste tu auto?{" "}
              <span className="order-status__sub">
                Consultá el estado de tu orden en tiempo real.
              </span>
            </p>
          </div>

          <div
            className="order-status__btn-wrap"
            dangerouslySetInnerHTML={{
              __html: `<button onclick="gtaller_modal();" id="gtaller_modal" disabled data-gt-ventana="1" class="gestioo-btn">CONSULTAR ORDEN</button>`,
            }}
          />
        </div>
      </div>

      <Script
        src="https://taller.gestioo.net/gwidget/consulta_web/js/gtaller_modal.init.js?v=4.1.113&lang=spanish"
        strategy="afterInteractive"
      />
    </section>
  );
}
