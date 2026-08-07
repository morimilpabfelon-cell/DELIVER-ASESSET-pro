# Registro de deuda técnica

| ID | Deuda | Riesgo | Criterio de cierre |
|---|---|---|---|
| TD-001 | Cobertura unitaria limitada a los módulos puros de routing y movimiento | Medio | Incorporar componentes y metadata sin reducir umbrales |
| TD-002 | Google Fonts continúa como dependencia externa | Bajo | Evaluar fuente local versionada o stack del sistema con revisión visual |
| TD-003 | La protección de rama depende de configuración del repositorio | Alto | Exigir CI, mutation y CodeQL como checks obligatorios en main |
| TD-004 | La prueba visual valida estructura y estilos computados, no pixel-diff | Medio | Añadir snapshots deterministas con tolerancias documentadas para escritorio, tablet, móvil y movimiento reducido |
| TD-005 | Ocho mutantes de routing sobrevivieron pese a un mutation score de 89.19 % | Medio | Añadir casos para múltiples slashes, raíz explícita, trims terminales y mensaje de error hasta eliminar o justificar cada mutante |

Toda deuda nueva requiere ID, riesgo y condición verificable de cierre.
