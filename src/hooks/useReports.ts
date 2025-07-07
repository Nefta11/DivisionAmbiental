// Este archivo ya no es necesario, se mantiene para compatibilidad
// Los reportes ahora se manejan a través del sistema global
export const useReports = () => {
  console.warn('useReports hook is deprecated. Use globalReportsManager instead.');
  return {};
};