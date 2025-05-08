
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
    console.log('Starting image analysis with Gemini...');
    
    // Convert image to base64
    const imageBase64 = await fileToBase64(imageFile);
    
    // Load rules from RulesList for analysis
    const rules = getRules();
    
    // Create detailed prompt based on all rules
    const prompt = createAnalysisPrompt(rules);
    
    // Create the request payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: imageFile.type || 'image/jpeg',
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

    console.log('Sending request to Gemini API...');
    
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
    console.log('Received response from Gemini API');
    
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
        console.error('Incomplete response format from Gemini API');
        throw new Error('Incomplete response format from Gemini API');
      }
      
      return complianceResult;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError, generatedText);
      
      // If we can't parse JSON, try to extract structured information from the text response
      return processTextResponse(generatedText);
    }
  } catch (error) {
    console.error('Error analyzing image with Gemini API:', error);
    
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

// Helper function to process text response when JSON parsing fails
const processTextResponse = (text: string): ComplianceResult => {
  console.log('Processing text response as structured data...');
  
  // Extract rules that pass or fail from the text
  const passMatches = text.match(/pass|compliant|followed|adherence|correctly placed|properly organized/gi) || [];
  const failMatches = text.match(/fail|non-compliant|violated|not followed|missing|incorrect/gi) || [];
  
  // Calculate an approximate score based on mentions
  const totalMatches = passMatches.length + failMatches.length;
  const score = totalMatches > 0 ? Math.round((passMatches.length / totalMatches) * 100) : 50;
  
  // Determine overall status based on score
  let overallStatus: 'compliant' | 'non-compliant' | 'partial' = 'partial';
  if (score >= 80) overallStatus = 'compliant';
  else if (score <= 30) overallStatus = 'non-compliant';

  // Extract issues by parsing text paragraphs
  const paragraphs = text.split('\n\n');
  const issues: ComplianceIssue[] = [];
  
  paragraphs.forEach(paragraph => {
    if (paragraph.trim().length > 10) {
      // Try to identify rule category and status
      let ruleMatch = paragraph.match(/Rule\s+(\d+):?\s*([\w\s&]+)/i);
      const isPassing = paragraph.match(/pass|compliant|followed|adherence/gi);
      
      if (!ruleMatch) {
        // Try alternative format detection
        ruleMatch = paragraph.match(/([\w\s&]+Rules):/i);
      }
      
      const ruleName = ruleMatch ? ruleMatch[1] + (ruleMatch[2] ? ': ' + ruleMatch[2] : '') : 'General Compliance';
      const status = isPassing ? 'pass' : paragraph.match(/fail|non-compliant|violated|not followed/gi) ? 'fail' : 'warning';
      
      issues.push({
        rule: ruleName,
        description: paragraph.substring(0, 100) + '...',
        status,
        details: paragraph
      });
    }
  });
  
  // If no issues were extracted, create a general one
  if (issues.length === 0) {
    issues.push({
      rule: "General Compliance",
      description: "Overall store compliance assessment",
      status: overallStatus === 'compliant' ? 'pass' : overallStatus === 'non-compliant' ? 'fail' : 'warning',
      details: text.substring(0, 300) + (text.length > 300 ? '...' : '')
    });
  }

  return {
    overallStatus,
    score,
    issues,
    summary: text.substring(0, 200) + (text.length > 200 ? '...' : '')
  };
};

// Function to get rules for analysis
const getRules = () => {
  return [
    {
      id: "Rule 1",
      name: "Aisle Arrangement Rules",
      description: [
        "Aisles must be wide enough for two-way traffic.",
        "No product pallets left in the middle of aisles.",
        "Promotional stands must not block main walkways.",
        "No carts or trolleys parked in aisles.",
        "Directional signage must be clearly visible.",
        "End caps must only display allowed promotional items."
      ]
    },
    {
      id: "Rule 2",
      name: "Checkout Counter Rules",
      description: [
        "No water bottles on the checkout counter.",
        "No helmets on the checkout counter.",
        "Checkout counter must be free of personal belongings.",
        "Checkout counter must have a visible POS system.",
        "No clutter (bags, boxes, etc.) on the counter.",
        "Promotional material must be within the designated space.",
        "Only one queue per checkout counter.",
        "No food items stored under or behind the checkout counter.",
        "Staff must not place their phones on the counter.",
        "Trash bins must not be visible near the checkout counter."
      ]
    },
    {
      id: "Rule 3",
      name: "Display & Promotion Rules",
      description: [
        "Promotions must be displayed in specified zones.",
        "No handwritten promotion signs (unless policy allows).",
        "All discount tags must be legible and properly printed.",
        "Shelf talkers must not cover product branding.",
        "Product stacking for promotion must not exceed safety limits.",
        "No conflicting brands on the same promo stand."
      ]
    },
    {
      id: "Rule 4",
      name: "Entrance & Exit Rules",
      description: [
        "No trolleys blocking the entrance.",
        "Entry/exit signage must be visible.",
        "Entrance doors must be clean and transparent.",
        "Entry area must not contain advertising boards on the floor."
      ]
    },
    {
      id: "Rule 5",
      name: "Floor & Cleanliness Rules",
      description: [
        "No litter on the floor.",
        "Aisles must be clear of any obstacles.",
        "No liquid spills visible on the floor.",
        "Mop buckets or cleaning tools must not be left unattended.",
        "No open boxes or packaging lying on the floor.",
        "No personal items (e.g., staff bags) on the floor.",
        "Entrance mats must be flat and clean.",
        "Waste bins must not be overflowing."
      ]
    },
    {
      id: "Rule 6",
      name: "Other General Rules",
      description: [
        "No unauthorized persons in staff-only zones.",
        "Security cameras must not be blocked.",
        "Lighting must be adequate and all bulbs functional.",
        "Ceiling panels must be intact (no water damage/stains).",
        "Store branding (logo, slogan) must be clean and visible.",
        "No handwritten correction over printed price tags.",
        "Shopping baskets must be clean and stacked in racks.",
        "Trolley area must be organized."
      ]
    },
    {
      id: "Rule 7",
      name: "Product Placement Rules",
      description: [
        "Milk must be placed in the refrigerated section.",
        "Frozen foods must be in freezers only.",
        "Non-edible items (e.g., cleaning products) must not be near food items.",
        "Eggs must be kept in a temperature-controlled display.",
        "Alcoholic beverages must be placed in designated areas only.",
        "Children's products (e.g., toys) must not be placed near alcohol."
      ]
    },
    {
      id: "Rule 8",
      name: "Refrigerator/Freezer Rules",
      description: [
        "Refrigerator doors must be closed.",
        "Frost or ice buildup should not be visible.",
        "No condensation puddles under refrigerators.",
        "Items must be within the max/min temperature limits."
      ]
    },
    {
      id: "Rule 9",
      name: "Safety & Accessibility Rules",
      description: [
        "Fire exits must be unobstructed.",
        "Emergency signage must be clearly visible.",
        "No items stacked above head height.",
        "Accessibility ramps must not be blocked.",
        "No wet floor without a warning sign.",
        "Electrical panels must not be blocked."
      ]
    },
    {
      id: "Rule 10",
      name: "Shelf Stocking Rules",
      description: [
        "Shelves must not be empty.",
        "Products must face forward (front-facing visibility).",
        "No expired products on shelves.",
        "Products must be aligned and not tilted.",
        "Price tags must be present and aligned with products.",
        "No gaps between product facings.",
        "No mixed products in a single facing row.",
        "Overhanging products are not allowed.",
        "Top shelf must not exceed maximum load limit.",
        "Bottom shelves must not have items on the floor beneath them.",
        "Promotional products must be tagged clearly.",
        "Products must match the store's planogram.",
        "No double stacking unless specified."
      ]
    },
    {
      id: "Rule 11",
      name: "Staff Behavior Rules",
      description: [
        "Staff must wear uniform or ID badge.",
        "Staff must not be eating on the floor.",
        "No sleeping or resting in product aisles.",
        "Mobile phone usage must be in break zones only."
      ]
    },
    {
      id: "Rule 12",
      name: "Warehouse/Backroom Rules",
      description: [
        "No clutter in the delivery area.",
        "Products must not be stored on the ground.",
        "Pallets must be stacked safely.",
        "No expired inventory mixed with fresh stock."
      ]
    }
  ];
};

// Create analysis prompt for Gemini
const createAnalysisPrompt = (rules: any[]) => {
  let prompt = `
Analyze this retail store image for compliance with these rules:

`;

  rules.forEach(rule => {
    prompt += `${rule.id}: ${rule.name}\n`;
    rule.description.forEach((desc: string) => {
      prompt += `- ${desc}\n`;
    });
    prompt += '\n';
  });

  prompt += `
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

  return prompt;
};
