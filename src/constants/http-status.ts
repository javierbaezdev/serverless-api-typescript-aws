export enum HttpStatus {
  CONTINUE = 100, // El servidor ha recibido los encabezados de la solicitud y el cliente debe proceder con el cuerpo.
  SWITCHING_PROTOCOLS = 101, // El servidor acepta cambiar el protocolo según lo solicitado.
  PROCESSING = 102, // La solicitud está siendo procesada pero aún no tiene respuesta (WebDAV).
  EARLYHINTS = 103, // Indica que el servidor está enviando algunos encabezados antes de la respuesta final.

  OK = 200, // La solicitud se ha procesado correctamente.
  CREATED = 201, // La solicitud fue exitosa y se creó un nuevo recurso.
  ACCEPTED = 202, // La solicitud se ha aceptado para procesamiento, pero aún no se ha completado.
  NON_AUTHORITATIVE_INFORMATION = 203, // La respuesta es de una fuente no original (por ejemplo, un proxy).
  NO_CONTENT = 204, // La solicitud se procesó correctamente pero no se devuelve contenido.
  RESET_CONTENT = 205, // La solicitud se procesó correctamente y el cliente debe reiniciar la vista del documento.
  PARTIAL_CONTENT = 206, // La respuesta contiene una parte del contenido solicitado (descargas parciales).

  AMBIGUOUS = 300, // Existen múltiples opciones para el recurso solicitado.
  MOVED_PERMANENTLY = 301, // El recurso ha sido movido permanentemente a una nueva URL.
  FOUND = 302, // El recurso fue encontrado en una ubicación diferente temporalmente.
  SEE_OTHER = 303, // El recurso debe ser accedido por otra URL usando GET.
  NOT_MODIFIED = 304, // El recurso no ha sido modificado desde la última solicitud.
  TEMPORARY_REDIRECT = 307, // Redirección temporal, se debe usar el mismo método HTTP.
  PERMANENT_REDIRECT = 308, // Redirección permanente, se debe usar el mismo método HTTP.

  BAD_REQUEST = 400, // La solicitud está malformada o contiene sintaxis incorrecta.
  UNAUTHORIZED = 401, // La autenticación es requerida y falló o no fue proporcionada.
  PAYMENT_REQUIRED = 402, // Reservado para uso futuro (pago requerido).
  FORBIDDEN = 403, // El cliente no tiene permisos para acceder al recurso.
  NOT_FOUND = 404, // El recurso solicitado no se encontró.
  METHOD_NOT_ALLOWED = 405, // El método HTTP no está permitido para el recurso.
  NOT_ACCEPTABLE = 406, // El recurso no puede generar contenido aceptable según el encabezado Accept.
  PROXY_AUTHENTICATION_REQUIRED = 407, // Se requiere autenticación con el proxy.
  REQUEST_TIMEOUT = 408, // El cliente tardó demasiado en enviar la solicitud.
  CONFLICT = 409, // Hay un conflicto con el estado actual del recurso.
  GONE = 410, // El recurso ya no está disponible y no volverá.
  LENGTH_REQUIRED = 411, // Se requiere especificar la longitud del contenido.
  PRECONDITION_FAILED = 412, // Una condición previa de la solicitud ha fallado.
  PAYLOAD_TOO_LARGE = 413, // El cuerpo de la solicitud es demasiado grande.
  URI_TOO_LONG = 414, // La URI solicitada es demasiado larga.
  UNSUPPORTED_MEDIA_TYPE = 415, // El tipo de medio del cuerpo de la solicitud no es soportado.
  REQUESTED_RANGE_NOT_SATISFIABLE = 416, // El rango especificado no puede ser cumplido.
  EXPECTATION_FAILED = 417, // La expectativa especificada en el encabezado Expect falló.
  I_AM_A_TEAPOT = 418, // Código en broma; el servidor es una tetera (RFC 2324).
  MISDIRECTED = 421, // La solicitud fue dirigida a un servidor que no puede producir respuesta.
  UNPROCESSABLE_ENTITY = 422, // El servidor entiende la solicitud pero no puede procesarla (WebDAV).
  FAILED_DEPENDENCY = 424, // La solicitud falló porque una dependencia falló (WebDAV).
  PRECONDITION_REQUIRED = 428, // El servidor requiere una condición previa en la solicitud.
  TOO_MANY_REQUESTS = 429, // El cliente ha enviado demasiadas solicitudes en un tiempo determinado.

  INTERNAL_SERVER_ERROR = 500, // Error interno del servidor.
  NOT_IMPLEMENTED = 501, // El servidor no reconoce o no puede cumplir el método solicitado.
  BAD_GATEWAY = 502, // El servidor recibió una respuesta inválida de otro servidor.
  SERVICE_UNAVAILABLE = 503, // El servidor no puede manejar la solicitud (sobrecarga o mantenimiento).
  GATEWAY_TIMEOUT = 504, // El servidor no recibió respuesta a tiempo de otro servidor.
  HTTP_VERSION_NOT_SUPPORTED = 505, // El servidor no soporta la versión del protocolo HTTP usada.
}
