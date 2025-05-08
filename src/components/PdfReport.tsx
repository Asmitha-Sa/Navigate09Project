
import React from 'react';
import { usePDF } from 'react-to-pdf';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';

interface ComplianceIssue {
  rule: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  details?: string;
}

interface ComplianceResult {
  overallStatus: 'compliant' | 'non-compliant' | 'partial';
  score: number;
  issues: ComplianceIssue[];
  summary: string;
}

interface PdfReportProps {
  results: ComplianceResult;
}

const PdfReport = ({ results }: PdfReportProps) => {
  const { toPDF, targetRef } = usePDF({
    filename: 'retail-compliance-report.pdf',
  });
  
  const statusColors: Record<string, string> = {
    'compliant': 'text-green-600',
    'non-compliant': 'text-red-600',
    'partial': 'text-yellow-600',
    'pass': 'text-green-600',
    'fail': 'text-red-600',
    'warning': 'text-yellow-600',
  };
  
  return (
    <div className="mt-6">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          onClick={() => toPDF()} 
          className="w-full bg-retail-blue hover:bg-blue-800"
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate PDF Report
          <Download className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
      
      {/* Hidden div that will be converted to PDF */}
      <div className="hidden">
        <div ref={targetRef} className="p-8 bg-white max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-retail-blue">Retail Compliance Report</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          
          {/* Executive Summary Section */}
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Overall Compliance Status</h2>
            <p className={`text-lg font-medium ${statusColors[results.overallStatus]}`}>
              {results.overallStatus.toUpperCase()}: {results.score}%
            </p>
            <p className="mt-2">{results.summary}</p>
          </div>
          
          {/* Compliance Score Visualization */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Compliance Score</h2>
            <div className="relative pt-1">
              <div className="overflow-hidden h-6 mb-4 text-xs flex rounded bg-gray-200">
                <div 
                  style={{ width: `${results.score}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    results.score > 80 ? 'bg-green-500' : 
                    results.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                >
                  <span className="font-bold">{results.score}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Compliance Issues Section - Now with table for better formatting */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Detailed Compliance Issues</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.issues.map((issue, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{issue.rule}</TableCell>
                    <TableCell>{issue.description}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issue.status === 'pass' ? 'bg-green-100 text-green-800' :
                        issue.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {issue.status}
                      </span>
                    </TableCell>
                    <TableCell>{issue.details || 'No additional details'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Rule Breakdown Analysis */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Rule Compliance Analysis</h2>
            <div className="grid grid-cols-3 gap-4">
              {['Aisle Arrangement', 'Checkout Counter', 'Display & Promotion', 'Entrance & Exit', 'Floor & Cleanliness'].map(category => {
                const categoryIssues = results.issues.filter(issue => issue.rule === category);
                const passCount = categoryIssues.filter(issue => issue.status === 'pass').length;
                const totalCount = categoryIssues.length || 1;
                const compliancePercent = Math.round((passCount / totalCount) * 100);
                
                return (
                  <div key={category} className="p-3 border rounded-lg">
                    <h3 className="text-sm font-medium mb-1">{category}</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            compliancePercent >= 80 ? 'bg-green-500' :
                            compliancePercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${compliancePercent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium ms-2">{compliancePercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Recommendations Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Improvement Recommendations</h2>
            <ul className="list-disc pl-5 space-y-2">
              {results.issues.filter(issue => issue.status !== 'pass').map((issue, index) => (
                <li key={index} className="text-sm">
                  <strong>{issue.rule}:</strong> {issue.description} - {issue.details}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>This report was automatically generated by the AI Retail Compliance Validator.</p>
            <p>&copy; {new Date().getFullYear()} Retail Compliance Technologies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfReport;
