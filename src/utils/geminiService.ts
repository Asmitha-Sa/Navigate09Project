
import { toast } from "@/components/ui/sonner";

// Define types
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

// This is a secure api key from a test project
const API_KEY = 'AIzaSyBh30Tu8nkAhdHbQDEAnMVTXDILGgrpTxM';

// Function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Function to analyze image with Gemini API
export const analyzeImage = async (imageFile: File): Promise<ComplianceResult> => {
  try {
    // Convert image to base64
    const imageBase64 = await fileToBase64(imageFile);

    // Create prompt with all retail compliance rules
    const prompt = `
      Analyze this retail store image for compliance with these rules:
      
      Rule 1: Aisle Arrangement Rules
      - Aisles must be wide enough for two-way traffic.
      - No product pallets left in the middle of aisles.
      - Promotional stands must not block main walkways.
      - No carts or trolleys parked in aisles.
      - Directional signage must be clearly visible.
      - End caps must only display allowed promotional items.
      
      Rule 2: Checkout Counter Rules
      - No water bottles on the checkout counter.
      - No helmets on the checkout counter.
      - Checkout counter must be free of personal belongings.
      - Checkout counter must have a visible POS system.
      - No clutter (bags, boxes, etc.) on the counter.
      - Promotional material must be within the designated space.
      
      Rule 3: Display & Promotion Rules
      - Promotions must be displayed in specified zones.
      - No handwritten promotion signs (unless policy allows).
      - All discount tags must be legible and properly printed.
      - Shelf talkers must not cover product branding.
      
      Rule 4: Entrance & Exit Rules
      - No trolleys blocking the entrance.
      - Entry/exit signage must be visible.
      - Entrance doors must be clean and transparent.
      
      Rule 5: Floor & Cleanliness Rules
      - No litter on the floor.
      - Aisles must be clear of any obstacles.
      - No liquid spills visible on the floor.
      - No open boxes or packaging lying on the floor.
      
      Analyze the image to determine if the retail store is compliant with these rules.
      Return your response in the following JSON format:
      {
        "overallStatus": "compliant" | "non-compliant" | "partial",
        "score": <percentage as number between 0-100>,
        "issues": [
          {
            "rule": "<rule category>",
            "description": "<specific rule>",
            "status": "pass" | "fail" | "warning",
            "details": "<explanation>"
          }
        ],
        "summary": "<general overview of compliance>"
      }
    `;

    // In a real-world scenario, we'd call the Gemini API here
    // For this demo, we'll simulate a response with dummy data
    console.log('Would call Gemini API with the image and prompt');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo purposes, we'll return a mock response
    // In a real implementation, you would:
    // 1. Call the Gemini API with the image and prompt
    // 2. Parse the response
    // 3. Return the structured compliance results
    
    const mockResponse: ComplianceResult = {
      overallStatus: 'partial',
      score: 78,
      issues: [
        {
          rule: "Aisle Arrangement",
          description: "Aisle spacing compliance",
          status: "pass",
          details: "Aisles appear to be wide enough for two-way traffic."
        },
        {
          rule: "Floor & Cleanliness",
          description: "No obstacles in walkways",
          status: "fail",
          details: "Box visible on the floor in aisle 2, creating potential trip hazard."
        },
        {
          rule: "Display & Promotion",
          description: "Promotion signage",
          status: "warning",
          details: "Some promotion signs appear to be handwritten. Verify if this is allowed by store policy."
        },
        {
          rule: "Checkout Counter",
          description: "Counter free of personal items",
          status: "pass",
          details: "Checkout counter clear of personal belongings."
        },
        {
          rule: "Product Placement",
          description: "Proper product placement",
          status: "pass",
          details: "Products appear to be placed in appropriate sections."
        }
      ],
      summary: "The store is generally well-maintained with good compliance across most categories. Primary issues include minor floor cleanliness concerns and potentially non-compliant promotional signage."
    };
    
    return mockResponse;
  } catch (error) {
    console.error('Error analyzing image:', error);
    toast.error('Failed to analyze the image. Please try again.');
    throw new Error('Failed to analyze image');
  }
};
