import { ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';

interface AccessDeniedProps {
  userRole: string;
  requiredRoles?: string[];
  onGoBack?: () => void;
}

export function AccessDenied({ userRole, requiredRoles, onGoBack }: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <ShieldAlert className="size-10 text-destructive" />
        </div>
        <h2 className="text-3xl text-gray-900 mb-3">Access Denied</h2>
        <p className="text-muted-foreground mb-2">
          You don't have permission to access this page.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Your role: <span className="font-semibold text-gray-900">{userRole}</span>
          </p>
          {requiredRoles && requiredRoles.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Required: <span className="font-semibold text-gray-900">{requiredRoles.join(', ')}</span>
            </p>
          )}
        </div>
        {onGoBack && (
          <Button onClick={onGoBack} className="mt-6">
            Go to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
