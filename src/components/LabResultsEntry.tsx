import { useState } from 'react';
import { motion } from 'motion/react';
import { Beaker, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface TestResult {
  id: string;
  patientName: string;
  testType: string;
  sampleId: string;
  results: { parameter: string; value: string; normalRange: string; flag?: 'high' | 'low' | 'critical' }[];
  status: 'pending' | 'completed' | 'verified';
  enteredBy?: string;
  enteredDate?: string;
}

export function LabResultsEntry() {
  const [pendingTests, setPendingTests] = useState<TestResult[]>([
    {
      id: '1',
      patientName: 'John Smith',
      testType: 'Complete Blood Count (CBC)',
      sampleId: 'SAMPLE-001',
      results: [
        { parameter: 'WBC', value: '', normalRange: '4.5-11.0 x10³/μL' },
        { parameter: 'RBC', value: '', normalRange: '4.5-5.9 x10⁶/μL' },
        { parameter: 'Hemoglobin', value: '', normalRange: '14.0-18.0 g/dL' },
        { parameter: 'Hematocrit', value: '', normalRange: '42-52%' },
      ],
      status: 'pending',
    },
    {
      id: '2',
      patientName: 'Emily Davis',
      testType: 'Lipid Panel',
      sampleId: 'SAMPLE-002',
      results: [
        { parameter: 'Total Cholesterol', value: '', normalRange: '<200 mg/dL' },
        { parameter: 'HDL Cholesterol', value: '', normalRange: '>40 mg/dL' },
        { parameter: 'LDL Cholesterol', value: '', normalRange: '<100 mg/dL' },
        { parameter: 'Triglycerides', value: '', normalRange: '<150 mg/dL' },
      ],
      status: 'pending',
    },
  ]);

  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);

  const handleResultChange = (parameterIndex: number, value: string) => {
    if (!selectedTest) return;

    const updatedResults = [...selectedTest.results];
    updatedResults[parameterIndex] = { ...updatedResults[parameterIndex], value };

    // Auto-flag abnormal values (simplified logic)
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const normalRange = updatedResults[parameterIndex].normalRange;
      if (normalRange.includes('-')) {
        const [min, max] = normalRange.split('-').map(s => parseFloat(s.replace(/[^\d.]/g, '')));
        if (numValue < min) updatedResults[parameterIndex].flag = 'low';
        else if (numValue > max) updatedResults[parameterIndex].flag = 'high';
        else delete updatedResults[parameterIndex].flag;
      }
    }

    setSelectedTest({ ...selectedTest, results: updatedResults });
  };

  const handleSaveResults = () => {
    if (!selectedTest) return;

    const updatedTest = {
      ...selectedTest,
      status: 'completed' as const,
      enteredBy: 'Lab Technician',
      enteredDate: new Date().toISOString().split('T')[0],
    };

    setPendingTests(pendingTests.map(test => 
      test.id === selectedTest.id ? updatedTest : test
    ));

    setSelectedTest(null);
    toast.success('Test results saved successfully!');
  };

  const getFlagColor = (flag?: string) => {
    switch (flag) {
      case 'high': return 'bg-red-100 text-destructive';
      case 'low': return 'bg-blue-100 text-primary';
      case 'critical': return 'bg-red-200 text-red-800';
      default: return 'bg-green-100 text-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900">Lab Results Entry</h1>
        <p className="text-muted-foreground">Enter test results and flag critical values</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="size-5 text-primary" />
              Pending Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTests.filter(test => test.status === 'pending').map((test) => (
              <motion.div
                key={test.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTest(test)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedTest?.id === test.id ? 'border-primary bg-primary/5' : 'hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{test.patientName}</p>
                    <p className="text-xs text-muted-foreground">{test.testType}</p>
                    <p className="text-xs text-muted-foreground">Sample: {test.sampleId}</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                    Pending
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Results Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="size-5 text-primary" />
              Enter Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTest ? (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded">
                  <p className="text-sm font-semibold">{selectedTest.patientName}</p>
                  <p className="text-xs text-muted-foreground">{selectedTest.testType}</p>
                  <p className="text-xs text-muted-foreground">Sample: {selectedTest.sampleId}</p>
                </div>

                <div className="space-y-3">
                  {selectedTest.results.map((result, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium">{result.parameter}</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          value={result.value}
                          onChange={(e) => handleResultChange(index, e.target.value)}
                          placeholder="Enter value"
                          className="flex-1"
                        />
                        {result.flag && (
                          <Badge className={getFlagColor(result.flag)}>
                            {result.flag === 'high' && <AlertTriangle className="size-3 mr-1" />}
                            {result.flag === 'low' && <AlertTriangle className="size-3 mr-1" />}
                            {result.flag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Normal: {result.normalRange}</p>
                    </div>
                  ))}
                </div>

                <Button onClick={handleSaveResults} className="w-full">
                  <Save className="size-4 mr-2" />
                  Save Results
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a pending test to enter results
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completed Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="size-5 text-primary" />
            Recently Completed Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingTests.filter(test => test.status === 'completed').map((test) => (
              <div key={test.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{test.patientName}</p>
                    <p className="text-xs text-muted-foreground">{test.testType}</p>
                    <p className="text-xs text-muted-foreground">
                      Completed by {test.enteredBy} on {test.enteredDate}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-primary">
                    Completed
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}