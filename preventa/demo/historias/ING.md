# ING · Ingreso con código (diseño 11, ingreso)

### ING-01 · Ingresar con un código al ir a pagar (oleada 2)
- **Historia:** Como Valentina o Diego, que tengo cuenta pero no sesión en este dispositivo, quiero entrar con un código y sin contraseña al ir a pagar, para no perder mi pedido ni escribir mis datos.
- **Pantallas:** `Login.dc.html` (hoja móvil), `Login-Desktop.dc.html` (ventana con el resumen del pedido a la izquierda).
- **Requerimientos:** 11 reglas 1–3, R4.8, S-D7.
- **Criterios:**
  1. Se abre al tocar «Ir a pagar» sin sesión, o desde «Ingresar», y nunca antes de agregar productos.
  2. Paso 1: celular +56 9 por defecto, con teclado numérico, y la alternativa «Usar mi correo». Casilla «Quiero recibir ofertas…» que se guarda en `c_pjMarketingOptIn`.
  3. Paso 2: código de 6 dígitos con autocompletado `one-time-code`. «Reenviar» se habilita a los 30 s, y se muestra «¿No te llega el código?» con sus alternativas.
  4. Paso 3: «Hola de nuevo, Valentina · tienes 40 Papa Puntos · este pedido suma 46 (dobles)». Para Diego: «Hola, Diego · este pedido suma N Papa Puntos».
  4b. El texto del paso 2 dice a dónde se envió el código de verdad (S-D7, S-D13), no «por SMS al +56…» si no se envió.
  5. Después vuelve al checkout con el carrito intacto: el carrito de invitado se fusiona con el del cliente.
  6. Usa el login sin contraseña de SLAS del template (`passwordless-login-form`, `otp-modal`, `action.otp-*`) con `features.passwordlessLogin` activado. La entrega del código sigue S-D7.
  7. No se muestran «Seguir sin cuenta», «¿Prefieres no crear cuenta?» ni «Pagar como invitada» (S-D14). «¿No te llega el código?» ofrece reenviar y enviar al correo.

### ING-02 · Código visible para el presentador (oleada 2)
- **Criterios:**
  1. Si SLAS no puede enviar el código por correo o SMS en el sandbox, el último código emitido se ve en el panel del presentador (PAN), nunca en la tienda.
  2. El mecanismo queda documentado en el informe.
