import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure agent behavior and thresholds</p>
      </div>

      <Card className="max-w-lg shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">General Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="max_markdown" className="text-xs font-medium">Maximum Allowed Markdown (%)</Label>
              <Input id="max_markdown" type="number" defaultValue={30} />
              <p className="text-xs text-muted-foreground">Agents will cap suggestions at this value.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="risk" className="text-xs font-medium">Default Risk Threshold</Label>
              <Select defaultValue="conservative">
                <SelectTrigger id="risk">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="self-start mt-1">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
