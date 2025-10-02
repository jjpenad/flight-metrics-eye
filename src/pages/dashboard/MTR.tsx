import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MTR = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    aircraft_id: "",
    record_type: "inspection",
    description: "",
    work_performed: "",
    parts_replaced: "",
    mechanic_name: "",
    mechanic_license: "",
    date_performed: "",
    hours_recorded: "",
    cost: "",
  });

  const { data: aircraft } = useQuery({
    queryKey: ["aircraft"],
    queryFn: async () => {
      const { data, error } = await supabase.from("aircraft").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ["maintenance_records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_records")
        .select("*, aircraft(tail_number)")
        .order("date_performed", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addRecordMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("maintenance_records").insert({
        ...data,
        user_id: user.id,
        hours_recorded: data.hours_recorded ? parseFloat(data.hours_recorded) : null,
        cost: data.cost ? parseFloat(data.cost) : null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance_records"] });
      setOpen(false);
      setFormData({
        aircraft_id: "",
        record_type: "inspection",
        description: "",
        work_performed: "",
        parts_replaced: "",
        mechanic_name: "",
        mechanic_license: "",
        date_performed: "",
        hours_recorded: "",
        cost: "",
      });
      toast({
        title: "Success",
        description: "MTR added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRecordMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Maintenance Records</h1>
          <p className="text-muted-foreground">Track all maintenance and inspection records</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={!aircraft || aircraft.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add MTR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Maintenance Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="aircraft_id">Aircraft *</Label>
                <Select value={formData.aircraft_id} onValueChange={(value) => setFormData({ ...formData, aircraft_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aircraft" />
                  </SelectTrigger>
                  <SelectContent>
                    {aircraft?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.tail_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="record_type">Record Type *</Label>
                <Select value={formData.record_type} onValueChange={(value) => setFormData({ ...formData, record_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="modification">Modification</SelectItem>
                    <SelectItem value="overhaul">Overhaul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="work_performed">Work Performed</Label>
                <Textarea
                  id="work_performed"
                  value={formData.work_performed}
                  onChange={(e) => setFormData({ ...formData, work_performed: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="parts_replaced">Parts Replaced</Label>
                <Input
                  id="parts_replaced"
                  value={formData.parts_replaced}
                  onChange={(e) => setFormData({ ...formData, parts_replaced: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="mechanic_name">Mechanic Name</Label>
                <Input
                  id="mechanic_name"
                  value={formData.mechanic_name}
                  onChange={(e) => setFormData({ ...formData, mechanic_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="mechanic_license">Mechanic License</Label>
                <Input
                  id="mechanic_license"
                  value={formData.mechanic_license}
                  onChange={(e) => setFormData({ ...formData, mechanic_license: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date_performed">Date Performed *</Label>
                <Input
                  id="date_performed"
                  type="date"
                  value={formData.date_performed}
                  onChange={(e) => setFormData({ ...formData, date_performed: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="hours_recorded">Hours Recorded</Label>
                <Input
                  id="hours_recorded"
                  type="number"
                  step="0.1"
                  value={formData.hours_recorded}
                  onChange={(e) => setFormData({ ...formData, hours_recorded: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={addRecordMutation.isPending}>
                {addRecordMutation.isPending ? "Adding..." : "Add Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!aircraft || aircraft.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Add an aircraft first to create maintenance records</p>
        </Card>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : records && records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{record.aircraft?.tail_number}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{record.record_type}</p>
                </div>
                <span className="text-sm text-muted-foreground">{new Date(record.date_performed).toLocaleDateString()}</span>
              </div>
              <p className="mb-2">{record.description}</p>
              {record.work_performed && (
                <p className="text-sm text-muted-foreground mb-1">Work: {record.work_performed}</p>
              )}
              {record.mechanic_name && (
                <p className="text-sm text-muted-foreground">Mechanic: {record.mechanic_name}</p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No maintenance records yet</p>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First MTR
          </Button>
        </Card>
      )}
    </div>
  );
};

export default MTR;
