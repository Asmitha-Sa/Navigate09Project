
import React from 'react';
import { usePDF } from 'react-to-pdf';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

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
    page: { 
      margin: 20,
      format: 'letter',
      orientation: 'portrait'
    }
  });
  
  const statusColors: Record<string, string> = {
    'compliant': 'text-green-600',
    'non-compliant': 'text-red-600',
    'partial': 'text-yellow-600',
    'pass': 'text-green-600',
    'fail': 'text-red-600',
    'warning': 'text-yellow-600',
  };
  
  // Group issues by rule category
  const categorizedIssues = results.issues.reduce((acc: Record<string, ComplianceIssue[]>, issue) => {
    if (!acc[issue.rule]) {
      acc[issue.rule] = [];
    }
    acc[issue.rule].push(issue);
    return acc;
  }, {});
  
  // Get main rule categories (max 12)
  const mainRuleCategories = Object.keys(categorizedIssues).slice(0, 12);
  
  // For each category, select the most critical issues (fail first, then warning)
  const limitedIssues = mainRuleCategories.flatMap(category => {
    const categoryIssues = categorizedIssues[category];
    const failIssues = categoryIssues.filter(issue => issue.status === 'fail');
    const warningIssues = categoryIssues.filter(issue => issue.status === 'warning');
    const passIssues = categoryIssues.filter(issue => issue.status === 'pass');
    
    // Return at most 2 issues per category, prioritizing fails then warnings
    return [...failIssues, ...warningIssues, ...passIssues].slice(0, 2);
  });
  
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
      
      {/* PDF Content */}
      <div ref={targetRef} className="p-8 bg-white max-w-4xl mx-auto text-black">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Retail Compliance Report</h1>
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
        
        {/* Compliance Issues Section - Using standard HTML table for better PDF rendering */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Compliance Findings</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb', color: 'black' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'left' }}>Rule Category</th>
                <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'left' }}>Status</th>
                <th style={{ border: '1px solid #e5e7eb', padding: '8px', textAlign: 'left' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {limitedIssues.map((issue, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px', fontWeight: 500 }}>{issue.rule}</td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '9999px', 
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: issue.status === 'pass' ? '#dcfce7' : 
                                      issue.status === 'warning' ? '#fef3c7' : '#fee2e2',
                      color: issue.status === 'pass' ? '#166534' : 
                             issue.status === 'warning' ? '#92400e' : '#b91c1c'
                    }}>
                      {issue.status}
                    </span>
                  </td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '8px' }}>{issue.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Rule Breakdown Analysis - Simplified */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Rule Category Analysis</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {mainRuleCategories.slice(0, 6).map(category => {
              const categoryIssues = categorizedIssues[category];
              const passCount = categoryIssues.filter(issue => issue.status === 'pass').length;
              const totalCount = categoryIssues.length || 1;
              const compliancePercent = Math.round((passCount / totalCount) * 100);
              
              return (
                <div key={category} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{category}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div style={{ 
                      width: '100%',
                      height: '10px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '9999px',
                      marginRight: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${compliancePercent}%`,
                        backgroundColor: compliancePercent >= 80 ? '#22c55e' :
                                        compliancePercent >= 50 ? '#eab308' : '#ef4444',
                        borderRadius: '9999px'
                      }}></div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 500 }}>{compliancePercent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Top Recommendations Section - Limited to 5 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Improvement Recommendations</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
            {results.issues
              .filter(issue => issue.status !== 'pass')
              .slice(0, 5)
              .map((issue, index) => (
                <li key={index} style={{ fontSize: '14px', marginBottom: '8px' }}>
                  <strong>{issue.rule}:</strong> {issue.description} 
                  {issue.details && <span> - {issue.details}</span>}
                </li>
              ))}
          </ul>
        </div>
        
        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          <p>This report was automatically generated by the AI Retail Compliance Validator.</p>
          <p>&copy; {new Date().getFullYear()} Retail Compliance Technologies</p>
        </div>
      </div>
    </div>
  );
};

export default PdfReport;
