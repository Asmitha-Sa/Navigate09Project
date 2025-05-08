
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Rule {
  id: number;
  name: string;
  description: string[];
}

const rules: Rule[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    name: "Entrance & Exit Rules",
    description: [
      "No trolleys blocking the entrance.",
      "Entry/exit signage must be visible.",
      "Entrance doors must be clean and transparent.",
      "Entry area must not contain advertising boards on the floor."
    ]
  },
  {
    id: 5,
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
  }
];

const RulesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRules = rules.filter(rule => 
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.some(desc => desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section id="rules" className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-retail-dark mb-2">Compliance Rules</h2>
            <p className="text-gray-600">
              Review the retail compliance standards our system validates
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search rules..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Retail Compliance Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {filteredRules.length > 0 ? (
                  filteredRules.map((rule) => (
                    <AccordionItem key={rule.id} value={`rule-${rule.id}`}>
                      <AccordionTrigger className="font-medium">{rule.name}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-1">
                          {rule.description.map((desc, i) => (
                            <li key={i} className="text-gray-700">{desc}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No rules match your search
                  </div>
                )}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RulesList;
