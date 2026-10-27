/*src/lib/
├── prisma.ts          el cliente de la base (cuando Prisma esté listo)
├── errors.ts          las clases de error: ApiError, ValidationError, etc.
├── api.ts             el envoltorio de los handlers y el formato de respuesta de error
├── utils.ts           funciones sueltas, como formatPrice
└── auth/
    ├── password.ts    hashear y comparar contraseñas
    ├── tokens.ts      crear y verificar los tokens
    ├── cookies.ts     poner y borrar las cookies
    └── session.ts     leer la sesión en los handlers*/