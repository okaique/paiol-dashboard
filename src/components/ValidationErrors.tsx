
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import type { ValidationError } from '@/hooks/useBusinessValidations';

interface ValidationErrorsProps {
  errors: ValidationError[];
  className?: string;
}

export const ValidationErrors = ({ errors, className = '' }: ValidationErrorsProps) => {
  if (errors.length === 0) return null;

  const errorsByType = errors.reduce((acc, error) => {
    if (!acc[error.type]) acc[error.type] = [];
    acc[error.type].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);

  return (
    <div className={`space-y-2 ${className}`}>
      {errorsByType.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {errorsByType.error.map((error, index) => (
                <div key={index} className="text-sm">
                  {error.field && <span className="font-medium">{error.field}: </span>}
                  {error.message}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {errorsByType.warning && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {errorsByType.warning.map((error, index) => (
                <div key={index} className="text-sm">
                  {error.field && <span className="font-medium">{error.field}: </span>}
                  {error.message}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
