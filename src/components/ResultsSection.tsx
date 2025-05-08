
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck, CircleX, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ComplianceIssue {
  rule: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  details?: string;
}

interface ResultsSectionProps {
  isVisible: boolean;
  isLoading: boolean;
  complianceResults: {
    overallStatus: 'compliant' | 'non-compliant' | 'partial';
    score: number;
    issues: ComplianceIssue[];
    summary: string;
  } | null;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  isVisible,
  isLoading,
  complianceResults
}) => {
  if (!isVisible) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-retail-green" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-retail-red" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getOverallStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CircleCheck className="h-8 w-8 text-retail-green" />;
      case 'non-compliant':
        return <CircleX className="h-8 w-8 text-retail-red" />;
      case 'partial':
        return <AlertCircle className="h-8 w-8 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <section id="results" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-retail-dark mb-2">Compliance Results</h2>
            <p className="text-gray-600">
              AI-powered analysis of your retail space compliance
            </p>
          </div>

          {isLoading ? (
            <Card className="animate-pulse-bg">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-retail-blue mb-4"></div>
                <p className="text-lg font-medium text-retail-dark">Analyzing compliance...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </CardContent>
            </Card>
          ) : complianceResults ? (
            <div className="space-y-6">
              {/* Overall status card */}
              <Card className="overflow-hidden">
                <div className={`p-4 ${
                  complianceResults.overallStatus === 'compliant' ? 'bg-green-50' : 
                  complianceResults.overallStatus === 'non-compliant' ? 'bg-red-50' : 'bg-yellow-50'
                }`}>
                  <div className="flex items-center">
                    {getOverallStatusIcon(complianceResults.overallStatus)}
                    <div className="ml-4">
                      <h3 className="font-medium text-lg text-retail-dark">
                        {complianceResults.overallStatus === 'compliant' ? 'Compliant' :
                         complianceResults.overallStatus === 'non-compliant' ? 'Non-Compliant' : 'Partially Compliant'}
                      </h3>
                      <p className="text-sm text-gray-600">Compliance Score: {complianceResults.score}%</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-700">{complianceResults.summary}</p>
                </CardContent>
              </Card>

              {/* Issues list */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Compliance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complianceResults.issues.map((issue, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-start">
                          <div className="mt-0.5 mr-3">
                            {getStatusIcon(issue.status)}
                          </div>
                          <div>
                            <h4 className="font-medium text-retail-dark">{issue.rule}</h4>
                            <p className="text-sm text-gray-700 mt-1">{issue.description}</p>
                            {issue.details && (
                              <p className="text-sm italic text-gray-500 mt-2 pl-1 border-l-2 border-gray-200">
                                {issue.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                <p className="text-gray-500">Upload and analyze an image to see compliance results here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
