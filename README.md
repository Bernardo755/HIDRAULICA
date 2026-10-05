# HidroPro · versión ampliada

Aplicación web modular de cálculo y diseño preliminar para plomería, tuberías, hidráulica y mecánica de fluidos.

## Módulos

1. Inicio / dashboard
2. Conversor de unidades
3. Propiedades de fluidos
4. Tuberías y accesorios
5. Calculadoras hidráulicas
6. Red hidráulica visual 2D
7. Bombas
8. Tinacos y cisternas
9. Drenaje y pendientes
10. Agua caliente
11. Materiales y presupuesto
12. Ingeniería avanzada
    - Comparador automático de diámetros
    - NPSH disponible
    - Golpe de ariete (Joukowsky)
    - Unidades de gasto / predimensionamiento
    - Perfil hidráulico
    - Diagnóstico de red
13. Reportes / JSON
14. Aprender

## Motor técnico incorporado

- Continuidad
- Área y velocidad
- Reynolds
- Factor de fricción
- Darcy-Weisbach
- Colebrook iterativo
- Hazen-Williams
- Pérdidas menores por K
- Presión hidrostática
- Bernoulli como base conceptual
- Potencia hidráulica y de bomba
- Potencia térmica
- Pendientes
- NPSH disponible
- Joukowsky para estimación de golpe de ariete
- Predimensionamiento por unidades de gasto
- Comparación de diámetros
- Perfil hidráulico

## Próxima expansión recomendada

La arquitectura permite incorporar posteriormente:
- solver de redes con continuidad/energía por nodos,
- Newton-Raphson / Hardy-Cross,
- curvas reales de bomba y curva del sistema,
- NPSH requerido,
- golpe de ariete transitorio por método de características,
- dibujo de planos y exportación DXF/SVG,
- catálogo de fabricantes,
- normas por jurisdicción,
- reportes PDF profesionales,
- importación/exportación de proyectos,
- optimización automática de diámetro y costo.

## Importante

Los criterios de diseño y los valores de la base son preliminares. Las normas cambian por jurisdicción y edición; deben verificarse antes de ejecutar una instalación. El software no sustituye un proyecto ejecutivo, revisión de fabricante ni firma de un profesional competente.

## Corrección de carga — versión reparada

Esta versión corrige errores que impedían cargar la aplicación completa:
- `advanced.js` ya no importa `fmt` desde `ui.js`; ahora lo obtiene desde `units.js`.
- Se corrigió el campo de eficiencia del módulo de calculadoras.
- `app.js` ahora captura errores de módulos y muestra una pantalla de diagnóstico en lugar de dejar la interfaz en blanco.
- El estado guardado en `localStorage` se normaliza para evitar que un proyecto antiguo o incompleto rompa la aplicación.
- Se validaron sintaxis, imports ES Modules y renderizado de las 14 rutas principales.
