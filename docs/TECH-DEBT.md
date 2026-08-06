# Registro de deuda técnica

| ID | Deuda | Riesgo | Criterio de cierre |
|---|---|---|---|
| TD-001 | Cobertura unitaria limitada inicialmente a routing puro | Medio | Incorporar componentes y metadata sin reducir umbrales |
| TD-002 | Google Fonts continúa como dependencia externa | Bajo | Evaluar fuente local versionada o stack del sistema con revisión visual |
| TD-003 | La protección de rama depende de configuración del repositorio | Alto | Exigir CI, mutation y CodeQL como checks obligatorios en main |
| TD-004 | La prueba visual valida estructura y estilos computados, no pixel-diff | Medio | Añadir snapshots visuales estables con tolerancias documentadas |

Toda deuda nueva requiere ID, riesgo y condición verificable de cierre.
