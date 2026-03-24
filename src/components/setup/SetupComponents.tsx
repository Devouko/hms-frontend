import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Pill } from 'lucide-react';

interface PharmacySetupProps {
  session: any;
}

export function PharmacySetup({ session }: PharmacySetupProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-6" />
          Pharmacy Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure medicine categories, suppliers, and dosages.
        </p>
      </CardContent>
    </Card>
  );
}

export function PathologySetup({ session }: { session: any }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-6" />
          Pathology Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure pathology test categories.
        </p>
      </CardContent>
    </Card>
  );
}

export function RadiologySetup({ session }: { session: any }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-6" />
          Radiology Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure radiology test categories.
        </p>
      </CardContent>
    </Card>
  );
}

export function FinanceSetup({ session }: { session: any }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-6" />
          Finance Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure income and expense heads.
        </p>
      </CardContent>
    </Card>
  );
}

export function BirthDeathRecordSetup({ session }: { session: any }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-6" />
          Birth & Death Record Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure custom fields for birth and death records.
        </p>
      </CardContent>
    </Card>
  );
}

export function HumanResourceSetup({ session }: { session: any }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-6" />
          Human Resource Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure leave types, departments, and designations.
        </p>
      </CardContent>
    </Card>
  );
}

export function InventorySetup({ session }: { session: any }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-6" />
          Inventory Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configure item categories, stores, and suppliers.
        </p>
      </CardContent>
    </Card>
  );
}
