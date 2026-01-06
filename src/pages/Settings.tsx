import { useState } from "react";
import { useDashboard, DashboardBenchmarks, RoleType, AVAILABLE_ROLES } from "@/hooks/useDashboard";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Settings() {
  const { benchmarks, updateBenchmark, roles, updateRole, getRole } = useDashboard();
  const [newMemberName, setNewMemberName] = useState("");

  const handleBenchmarkChange = (
    key: keyof DashboardBenchmarks,
    field: "min" | "max",
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateBenchmark(key, field, numValue);
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (roles[newMemberName]) {
      toast.error("Member already exists");
      return;
    }
    updateRole(newMemberName, "Lead Generator"); // Default role
    setNewMemberName("");
    toast.success("Member added");
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage KPI Benchmarks and Team Roles
            </p>
          </div>
        </header>

        <Tabs defaultValue="benchmarks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="team">Team Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="benchmarks">
            <Card>
              <CardHeader>
                <CardTitle>KPI Thresholds</CardTitle>
                <CardDescription>
                  Set the minimum (Needs Improvement) and maximum (Great) values for each metric.
                  Values between Min and Max are considered "Good".
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(benchmarks).map(([key, range]) => (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end p-4 border rounded-lg">
                    <div className="col-span-1 md:col-span-2">
                       <Label className="text-base font-semibold capitalize">
                         {key.replace(/([A-Z])/g, ' $1').trim()} (%)
                       </Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`${key}-min`}>Min (Needs Improvement if &lt;)</Label>
                      <Input
                        id={`${key}-min`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={range.min}
                        onChange={(e) => handleBenchmarkChange(key as keyof DashboardBenchmarks, "min", e.target.value)}
                        className="border-destructive/50 focus:border-destructive"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${key}-max`}>Max (Great if &gt;)</Label>
                      <Input
                        id={`${key}-max`}
                        type="number"
                        min="0"
                        step="0.1"
                        value={range.max}
                        onChange={(e) => handleBenchmarkChange(key as keyof DashboardBenchmarks, "max", e.target.value)}
                        className="border-success/50 focus:border-success"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Assign roles to team members to ensure they appear in the correct performance reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex gap-4 items-end">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="new-member">Add New Member</Label>
                    <Input 
                      id="new-member" 
                      placeholder="Name" 
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddMember}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>

                <Separator />

                <div className="grid gap-4">
                  {Object.entries(roles).map(([name, role]) => (
                    <div key={name} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <span className="font-medium">{name}</span>
                      <Select 
                        value={role} 
                        onValueChange={(val) => updateRole(name, val as RoleType)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_ROLES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
