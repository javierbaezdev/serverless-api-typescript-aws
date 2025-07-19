## 🛠️ Prisma – Comandos útiles para manejo de base de datos

Este proyecto usa [Prisma](https://www.prisma.io/) como ORM. Acá están los comandos clave para trabajar con migraciones, seeds y el cliente.

---

### 🔧 Generar el cliente de Prisma

Ejecutá este comando siempre que edites el archivo `schema.prisma` (modelo de datos):

```bash
npx prisma generate
```

### 🧱 Crear una nueva migración (en desarrollo)

Crea archivos de migración a partir de cambios en tu schema, y los aplica automáticamente a tu base local.

```bash
npx prisma migrate dev --name nombre_migracion
```

### 🚀 Aplicar migraciones en producción o staging

Este comando aplica todas las migraciones pendientes (pero no crea nuevas).

```bash
npx prisma migrate deploy
```

### 🔙 Resetear la base de datos (solo en desarrollo)

Borra toda la base de datos, vuelve a aplicar todas las migraciones y corre el seed (si existe).

```bash
npx prisma migrate reset
```

### 🌱 Ejecutar seed (datos iniciales)

Este comando corre el archivo de seeds configurado. Asegurate de tener en tu package.json algo como:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

### 🔍 Ver el estado de las migraciones

Este comando te muestra si hay migraciones pendientes o diferencias entre tu schema y la base de datos:

```bash
npx prisma migrate status
```

### 🧪 Acceder a Prisma Studio (UI visual)

Abre una interfaz web para explorar y editar los datos de la base:

```bash
npx prisma studio
```
