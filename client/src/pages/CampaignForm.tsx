import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Target, MapPin, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CampaignDraft {
  id: string;
  name: string;
  description: string;
  locations: string[];
  businesses: string[];
  jobTitles: string[];
  status: string;
  progress: number;
}

export default function CampaignForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locations, setLocations] = useState([""]);
  const [businesses, setBusinesses] = useState([""]);
  const [titles, setTitles] = useState([""]);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const addItem = (arrSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    arrSetter((prev: string[]) => [...prev, ""]);
  };
  const removeItem = (arrSetter: React.Dispatch<React.SetStateAction<string[]>>, index: number, arr: string[]) => {
    if (arr.length === 1) return;
    arrSetter((prev: string[]) => prev.filter((_, i) => i !== index));
  };
  const updateItem = (arrSetter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    arrSetter((prev: string[]) => prev.map((v, i) => (i === index ? value : v)));
  };

  const canNext = () => {
    if (step === 1) return name.trim().length > 2;
    if (step === 2) return locations.some(l => l.trim());
    if (step === 3) return businesses.some(b => b.trim()) && titles.some(t => t.trim());
    return true;
  };

  const handleSubmit = () => {
    const id = `camp-${Date.now()}`;
    const draft: CampaignDraft = {
      id,
      name,
      description,
      locations: locations.filter(l => l.trim()),
      businesses: businesses.filter(b => b.trim()),
      jobTitles: titles.filter(t => t.trim()),
      status: "created",
      progress: 0,
    };

    const stored = JSON.parse(sessionStorage.getItem("campaigns") || "[]");
    sessionStorage.setItem("campaigns", JSON.stringify([...stored, draft]));

    toast({ title: "Campaign Created", description: "Your campaign draft is ready." });
    navigate(`/campaigns/${id}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Campaign (Step {step}/4)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Marketing Agencies - NYC" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>Locations</Label>
              {locations.map((loc, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={loc} onChange={e => updateItem(setLocations, i, e.target.value)} />
                  <Button variant="outline" size="icon" onClick={() => removeItem(setLocations, i, locations)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => addItem(setLocations)}><Plus className="w-4 h-4 mr-1" />Add Location</Button>
            </div>
          )}

          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Business Types</Label>
                {businesses.map((b, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input value={b} onChange={e => updateItem(setBusinesses, i, e.target.value)} />
                    <Button variant="outline" size="icon" onClick={() => removeItem(setBusinesses, i, businesses)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addItem(setBusinesses)}><Plus className="w-4 h-4 mr-1" />Add Business</Button>
              </div>

              <div className="space-y-4">
                <Label>Job Titles</Label>
                {titles.map((t, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input value={t} onChange={e => updateItem(setTitles, i, e.target.value)} />
                    <Button variant="outline" size="icon" onClick={() => removeItem(setTitles, i, titles)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addItem(setTitles)}><Plus className="w-4 h-4 mr-1" />Add Title</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <Target className="w-12 h-12 text-primary mx-auto" />
              <p className="text-lg">Review and create the campaign.</p>
              <ul className="text-left list-disc list-inside space-y-1">
                <li><strong>Name:</strong> {name}</li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Locations:</strong> {locations.filter(Boolean).join(", ")}</li>
                <li><strong>Businesses:</strong> {businesses.filter(Boolean).join(", ")}</li>
                <li><strong>Titles:</strong> {titles.filter(Boolean).join(", ")}</li>
              </ul>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep(step-1)}>Back</Button>
            {step < 4 ? (
              <Button disabled={!canNext()} onClick={() => setStep(step+1)}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Create Campaign</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 