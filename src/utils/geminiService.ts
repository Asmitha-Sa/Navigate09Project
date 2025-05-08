
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

// Use the provided API key for Gemini
const API_KEY = 'AIzaSyD8jj6smoFRmVFPMq6i_etf8heZMTKQBv4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

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
    
    // Create the detailed prompt with all compliance rules
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
      - Only one queue per checkout counter.
      - No food items stored under or behind the checkout counter.
      - Staff must not place their phones on the counter.
      - Trash bins must not be visible near the checkout counter.
      
      Rule 3: Display & Promotion Rules
      - Promotions must be displayed in specified zones.
      - No handwritten promotion signs (unless policy allows).
      - All discount tags must be legible and properly printed.
      - Shelf talkers must not cover product branding.
      - Product stacking for promotion must not exceed safety limits.
      - No conflicting brands on the same promo stand.
      
      Rule 4: Entrance & Exit Rules
      - No trolleys blocking the entrance.
      - Entry/exit signage must be visible.
      - Entrance doors must be clean and transparent.
      - Entry area must not contain advertising boards on the floor.
      
      Rule 5: Floor & Cleanliness Rules
      - No litter on the floor.
      - Aisles must be clear of any obstacles.
      - No liquid spills visible on the floor.
      - Mop buckets or cleaning tools must not be left unattended.
      - No open boxes or packaging lying on the floor.
      - No personal items (e.g., staff bags) on the floor.
      - Entrance mats must be flat and clean.
      - Waste bins must not be overflowing.
      
      Rule 6: Other General Rules
      - No unauthorized persons in staff-only zones.
      - Security cameras must not be blocked.
      - Lighting must be adequate and all bulbs functional.
      - Ceiling panels must be intact (no water damage/stains).
      - Store branding (logo, slogan) must be clean and visible.
      - No handwritten correction over printed price tags.
      - Shopping baskets must be clean and stacked in racks.
      - Trolley area must be organized.
      
      Rule 7: Product Placement Rules
      - Milk must be placed in the refrigerated section.
      - Frozen foods must be in freezers only.
      - Non-edible items (e.g., cleaning products) must not be near food items.
      - Eggs must be kept in a temperature-controlled display.
      - Alcoholic beverages must be placed in designated areas only.
      - Children's products (e.g., toys) must not be placed near alcohol.
      
      Rule 8: Refrigerator/Freezer Rules
      - Refrigerator doors must be closed.
      - Frost or ice buildup should not be visible.
      - No condensation puddles under refrigerators.
      - Items must be within the max/min temperature limits.
      
      Rule 9: Safety & Accessibility Rules
      - Fire exits must be unobstructed.
      - Emergency signage must be clearly visible.
      - No items stacked above head height.
      - Accessibility ramps must not be blocked.
      - No wet floor without a warning sign.
      - Electrical panels must not be blocked.
      
      Rule 10: Shelf Stocking Rules
      - Shelves must not be empty.
      - Products must face forward (front-facing visibility).
      - No expired products on shelves.
      - Products must be aligned and not tilted.
      - Price tags must be present and aligned with products.
      - No gaps between product facings.
      - No mixed products in a single facing row.
      - Overhanging products are not allowed.
      - Top shelf must not exceed maximum load limit.
      - Bottom shelves must not have items on the floor beneath them.
      - Promotional products must be tagged clearly.
      - Products must match the store's planogram.
      - No double stacking unless specified.
      
      Rule 11: Staff Behavior Rules
      - Staff must wear uniform or ID badge.
      - Staff must not be eating on the floor.
      - No sleeping or resting in product aisles.
      - Mobile phone usage must be in break zones only.
      
      Rule 12: Warehouse/Backroom Rules
      - No clutter in the delivery area.
      - Products must not be stored on the ground.
      - Pallets must be stacked safely.
      - No expired inventory mixed with fresh stock.
      
      Analyze the image to determine if the retail store is compliant with these rules.
      Return your response in the following JSON format ONLY (no additional text before or after):
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

    console.log('Calling Gemini API with image and compliance ruleset');
    
    // Prepare the request payload for Gemini API
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: `image/${imageFile.type.split('/')[1]}`,
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      }
    };

    // Make the API call to Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Gemini API response:', result);

    // Extract the text from the Gemini response
    const generatedText = result.candidates[0].content.parts[0].text;
    
    // Try to parse the JSON response from Gemini
    try {
      // Look for JSON object in the response
      const jsonMatch = generatedText.match(/(\{[\s\S]*\})/);
      const jsonString = jsonMatch ? jsonMatch[0] : generatedText;
      
      // Parse the JSON
      const complianceResult: ComplianceResult = JSON.parse(jsonString);
      
      // Validate the structure of the response
      if (!complianceResult.overallStatus || 
          typeof complianceResult.score !== 'number' || 
          !Array.isArray(complianceResult.issues) || 
          !complianceResult.summary) {
        throw new Error('Incomplete response format from Gemini API');
      }
      
      return complianceResult;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      
      // Fallback response when parsing fails
      return {
        overallStatus: 'partial',
        score: 50,
        issues: [
          {
            rule: "API Response",
            description: "Gemini response parsing",
            status: "warning",
            details: "Could not parse the API response properly. Raw response has been logged to console."
          }
        ],
        summary: "Unable to properly analyze the image due to response format issues. Please try again or use a clearer image."
      };
    }
  } catch (error) {
    console.error('Error analyzing image with Gemini API:', error);
    toast.error('Failed to analyze the image. Please try again.');
    
    // Return an error response
    return {
      overallStatus: 'non-compliant',
      score: 0,
      issues: [
        {
          rule: "API Error",
          description: "Image analysis failed",
          status: "fail",
          details: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      summary: "An error occurred while analyzing the image. Please check your connection and try again."
    };
  }
};
