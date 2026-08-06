# Doctrina de ingeniería

Todo cambio se evalúa en estados separados: implementado, verificado, fusionado, desplegado y validado en producción. Ningún estado implica automáticamente el siguiente.

## Gates

1. Alcance, causa raíz, exclusiones, riesgo y rollback.
2. Arquitectura: una fuente de verdad y límites explícitos.
3. Reproducibilidad: Node y npm fijados, package-lock y npm ci.
4. Análisis estático: TypeScript estricto, ESLint y contratos propios.
5. Pruebas: unitarias, cobertura, navegador instrumentado y post-deploy.
6. Mutation testing para lógica pura con score de ruptura mínimo de 80%.
7. Seguridad: auditoría de producción, CodeQL y permisos mínimos.
8. Evidencia: SHA, artefacto, digest, reportes y release.json público.
9. Limpieza: sin workflows temporales, scripts de una ejecución o parches obsoletos.

## Umbrales iniciales

- Líneas, funciones y statements: 90%.
- Ramas: 85%.
- Mutation score: 80% mínimo.
- Vulnerabilidades de producción altas o críticas: cero.

Los umbrales se aplican inicialmente al módulo puro de routing. La cobertura se ampliará por ratchet sin disminuir la línea base.
