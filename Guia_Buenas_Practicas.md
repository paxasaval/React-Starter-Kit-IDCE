# Manual de Buenas Prácticas y Versionamiento IDCE

Este manual establece los estándares para el versionamiento de *software* y las convenciones de *commit* para el equipo de desarrollo, asegurando la coherencia y la trazabilidad en todos los productos.

## 1\. Guía de Versionamiento Semántico (SemVer)

Todos los productos de *software* (Backend y Frontend) deben seguir el formato de **Versionamiento Semántico** (`MAYOR.MENOR.PARCHE`).

### Formato de Versión: `MAYOR.MENOR.PARCHE` (Ej: 2.5.10)

| Segmento | Nombre | Regla de Incremento |
| :--- | :--- | :--- |
| **MAYOR** (Major) | Versión principal | Incrementa cuando hay **cambios incompatibles** (*breaking changes*) con versiones anteriores. Esto obliga a los consumidores (Frontend o sistemas externos) a adaptarse. |
| **MENOR** (Minor) | Funcionalidad | Incrementa cuando se añade **nueva funcionalidad** de manera **retrocompatible**. |
| **PARCHE** (Patch) | Corrección | Incrementa cuando se hacen **correcciones de errores (bugs)** de manera **retrocompatible**. |

## 2\. Convenciones de Versionamiento por Componente

Cada capa de la arquitectura debe versionarse de forma independiente, utilizando el estándar SemVer.

### A. Backend - WEB API (.NET)

El Backend es el **núcleo** que define la compatibilidad de la API y el *Schema* de la Base de Datos.

| Tipo | Regla | Ubicación de la Versión |
| :--- | :--- | :--- |
| **Código** | La versión del código deberá actualizarse según los requerimientos (SemVer). | Se añadirá en el archivo del proyecto (`.csproj`) bajo la etiqueta `<Version>`.  |
| **SSO Central** | La versión del producto en la tabla `SSO.Productos` se actualizará a la **última versión desplegada del Backend-WebAPI** (`vX.Y.Z`). | La versión del Backend es la única versión que se registra en el SSO, ya que es la que representa la capacidad actual del producto. |

### B. Frontend - REACT CRA

| Tipo | Regla | Ubicación de la Versión |
| :--- | :--- | :--- |
| **Código** | La versión del código deberá actualizarse según los requerimientos (SemVer). | Se registrará en el archivo de configuración de paquetes (`package.json`) bajo el campo `version`.  |

### C. Base de Datos (SQL Server)

La Base de Datos no tiene un versionamiento independiente, sino que está **acoplada a la versión del Backend**.

| Tipo | Regla | Impacto |
| :--- | :--- | :--- |
| **Schema** | Los cambios de *Schema* se realizan a través de **migraciones** gestionadas por el Backend. | Las migraciones deben ser retrocompatibles, salvo en un cambio de versión **MAYOR** del Backend. |

-----

## 3\. Estrategia de Ramas en Git

Se utilizará la estrategia de **Etiquetas (Tags)** para identificar cada versión desplegada, en lugar de ramas por cada versión de parche.

| Elemento | Propósito | Ejemplo de Uso |
| :--- | :--- | :--- |
| **Etiquetas (Tags)** | Marcar un punto de liberación inmutable (`release`). Una etiqueta se asigna al *commit* en la rama `main` justo después del despliegue. | `git tag v2.5.0` |
| **Ramas de Soporte** | Solo se crean para mantener versiones **MAYORES** antiguas que aún requieren *hotfixes* mientras se desarrolla la siguiente versión Mayor. | `release/2.x.x` |
| **Flujo de Trabajo** | El desarrollo se realiza en `develop` o *feature branches*, y las liberaciones se etiquetan en `main`. | Todo *hotfix* debe ser aplicado al *commit* etiquetado y luego fusionado a `main` y `develop`. |

-----

## 4\. Manual de Buenas Prácticas para Commits

Se utilizarán **Commits Convencionales** para asegurar un historial de cambios limpio y automatizar la generación del `Changelog`.

### Estructura del Commit

```
TIPO: Ámbito(Opcional) | Descripción
```

**Ejemplo:** `FT: Colocacion | Upload C01 XML`

### Tipos de Commit

| Tipo | Uso | Relación con Versión |
| :--- | :--- | :--- |
| **FT** (Feature) | Nueva funcionalidad implementada. | Corresponde a un incremento **MENOR**. |
| **FIX** | Corrección de un error o *bug* en la base del código. | Corresponde a un incremento **PARCHE**. |
| **STYLE** | Cambios de formato en el código (espacios en blanco, puntos y comas, indentación) que no alteran la lógica. | No afecta el versionamiento. |
| **MNT** (Mantenimiento) | Cambios en el código que responden a mejoras de rendimiento, legibilidad o refactorización de código existente. | Corresponde a un incremento **PARCHE** (si la refactorización es menor). |
| **DOCS** | Cambios en la documentación (interna o externa). | No afecta el versionamiento. |
| **TEST** | Añadir pruebas faltantes o corregir pruebas existentes. | No afecta el versionamiento. |

### Cambio Incompatible (`!`)

Se utiliza el signo de exclamación `!` inmediatamente después del tipo para indicar un **cambio incompatible** (*breaking change*).

| Estructura | Significado | Relación con Versión |
| :--- | :--- | :--- |
| `TIPO!` | La modificación responde a un cambio **MAYOR** en el versionamiento, es decir, **no tiene compatibilidad con versiones anteriores**. | Corresponde a un incremento **MAYOR**. |
| **Ejemplo:** `FT!: Usuarios | Cambio de endpoint de /api/users/id a /api/customers/guid` | | |